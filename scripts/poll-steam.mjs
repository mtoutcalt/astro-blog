/**
 * Steam activity poller.
 *
 * Runs once a day from GitHub Actions. Steam exposes no session history, so
 * activity is derived by diffing cumulative `playtime_forever` against the
 * baseline recorded on the previous run. Each run therefore produces at most
 * one "play" entry per game, covering the window between the two polls.
 *
 * Achievement unlocks carry real timestamps and are recorded exactly.
 *
 * Usage:
 *   node scripts/poll-steam.mjs [--dry-run]
 *
 * Env:
 *   STEAM_API_KEY   required — https://steamcommunity.com/dev/apikey
 *   STEAM_ID        required — 64-bit SteamID (17 digits)
 *   STEAM_TIMEZONE  optional — IANA zone for day bucketing (default America/New_York)
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createSteamClient, redact } from "./steam-api.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = resolve(HERE, "../src/data/steam-state.json");
const EVENTS_PATH = resolve(HERE, "../src/data/steam-events.json");

const MILESTONE_HOURS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
const TIMEZONE = process.env.STEAM_TIMEZONE || "America/New_York";

const dryRun = process.argv.includes("--dry-run");

/** Calendar day (YYYY-MM-DD) that an instant falls on, in the display timezone. */
function dayKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw new Error(`Could not parse ${path}: ${err.message}`);
  }
}

function emptyState() {
  return { version: 1, last_polled_at: null, profile: null, now_playing: null, apps: {} };
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function makePlayEvent(game, minutes, coversFrom, coversTo) {
  return {
    id: `play:${game.appid}:${coversTo}`,
    type: "play",
    appid: game.appid,
    name: game.name,
    minutes,
    covers_from: coversFrom,
    covers_to: coversTo,
    at: coversTo,
    day: dayKey(new Date(coversFrom)),
  };
}

async function main() {
  const key = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  const steam = createSteamClient({ key, steamId });

  const state = await readJson(STATE_PATH, emptyState());
  const log = await readJson(EVENTS_PATH, { version: 1, events: [] });

  // An empty app map means this is the first run ever: record baselines and
  // emit nothing, so the log starts at "now" instead of replaying years of
  // accumulated playtime as one enormous entry.
  const bootstrap = Object.keys(state.apps ?? {}).length === 0;

  const now = new Date();
  const nowIso = now.toISOString();
  const coversFrom = state.last_polled_at ?? nowIso;

  const [games, summary] = await Promise.all([steam.recentlyPlayed(), steam.playerSummary()]);

  const newEvents = [];
  const changedApps = [];

  for (const game of games) {
    const id = String(game.appid);
    const prev = state.apps[id];
    const total = game.playtime_forever ?? 0;

    if (!prev) {
      state.apps[id] = {
        name: game.name,
        img_icon_url: game.img_icon_url ?? null,
        playtime_forever: total,
        first_seen_at: nowIso,
        last_played_at: nowIso,
        // Forward-only: never backfill achievements earned before we started.
        achievements_since: Math.floor(now.getTime() / 1000),
        milestones: MILESTONE_HOURS.filter((h) => total >= h * 60),
      };

      if (!bootstrap) {
        // A game absent last run but present now was played for the first time
        // in this window. playtime_2weeks is the best available estimate of how
        // much, since its baseline was zero.
        newEvents.push({
          id: `first_play:${id}:${nowIso}`,
          type: "first_play",
          appid: game.appid,
          name: game.name,
          at: nowIso,
          day: dayKey(new Date(coversFrom)),
        });

        const minutes = game.playtime_2weeks ?? 0;
        if (minutes > 0) {
          newEvents.push(makePlayEvent(game, minutes, coversFrom, nowIso));
          changedApps.push({ game, minutes });
        }
      }
      continue;
    }

    // Keep display metadata fresh even when playtime has not moved.
    prev.name = game.name;
    if (game.img_icon_url) prev.img_icon_url = game.img_icon_url;

    const delta = total - (prev.playtime_forever ?? 0);
    if (delta <= 0) continue;

    prev.playtime_forever = total;
    prev.last_played_at = nowIso;
    newEvents.push(makePlayEvent(game, delta, coversFrom, nowIso));
    changedApps.push({ game, minutes: delta });

    // Lifetime-playtime milestones.
    const already = new Set(prev.milestones ?? []);
    for (const h of MILESTONE_HOURS) {
      if (total >= h * 60 && !already.has(h)) {
        already.add(h);
        newEvents.push({
          id: `milestone:${id}:${h}`,
          type: "milestone",
          appid: game.appid,
          name: game.name,
          hours: h,
          at: nowIso,
          day: dayKey(now),
        });
      }
    }
    prev.milestones = [...already].sort((a, b) => a - b);
  }

  // Achievements only for games that actually moved this run — keeps the call
  // count to a handful per day rather than one per owned game.
  for (const { game } of changedApps) {
    const id = String(game.appid);
    const app = state.apps[id];
    const since = app.achievements_since ?? 0;

    const unlocked = (await steam.achievements(game.appid)).filter(
      (a) => a.achieved === 1 && (a.unlocktime ?? 0) > since,
    );
    if (unlocked.length === 0) continue;

    const schema = await steam.achievementSchema(game.appid);
    for (const a of unlocked) {
      const meta = schema.get(a.apiname);
      const at = new Date(a.unlocktime * 1000);
      newEvents.push({
        id: `achievement:${id}:${a.apiname}`,
        type: "achievement",
        appid: game.appid,
        name: game.name,
        achievement: meta?.displayName || a.apiname,
        description: meta?.description || null,
        icon: meta?.icon || null,
        at: at.toISOString(),
        day: dayKey(at),
      });
    }
    app.achievements_since = Math.max(since, ...unlocked.map((a) => a.unlocktime));
  }

  if (summary) {
    state.profile = {
      persona: summary.personaname ?? null,
      avatar: summary.avatarfull ?? null,
      profile_url: summary.profileurl ?? null,
    };
    state.now_playing = summary.gameextrainfo
      ? { name: summary.gameextrainfo, appid: Number(summary.gameid) || null, at: nowIso }
      : null;
  }

  // Drop any event id already present, so a re-run cannot duplicate entries.
  const seen = new Set(log.events.map((e) => e.id));
  const toAppend = newEvents.filter((e) => !seen.has(e.id));
  log.events.push(...toAppend);
  log.events.sort((a, b) => String(a.at).localeCompare(String(b.at)));

  state.last_polled_at = nowIso;
  report({ bootstrap, games: games.length, toAppend, changedApps });

  if (dryRun) return;

  // Only rewrite the log when something actually happened, so the daily commit
  // is signal rather than noise.
  if (toAppend.length > 0) {
    await writeFile(EVENTS_PATH, JSON.stringify(log, null, 2) + "\n");
  }
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

function report({ bootstrap, games, toAppend, changedApps }) {
  const prefix = dryRun ? "[dry-run] " : "";
  if (bootstrap) {
    console.log(`${prefix}Bootstrapped baselines for ${games} recently-played game(s). No events emitted.`);
    return;
  }
  if (toAppend.length === 0) {
    console.log(`${prefix}No new activity across ${games} recently-played game(s).`);
    return;
  }
  for (const { game, minutes } of changedApps) {
    console.log(`${prefix}  +${formatMinutes(minutes)}  ${game.name}`);
  }
  const achievements = toAppend.filter((e) => e.type === "achievement").length;
  if (achievements) console.log(`${prefix}  ${achievements} achievement(s) unlocked`);
  console.log(`${prefix}Appended ${toAppend.length} event(s).`);
}

main().catch((err) => {
  console.error(redact(err.stack || err.message, process.env.STEAM_API_KEY));
  process.exit(1);
});
