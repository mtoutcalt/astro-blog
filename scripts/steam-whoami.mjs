/**
 * Setup preflight: resolves a Steam profile to its 64-bit SteamID and checks
 * that the API key works and playtime is actually visible.
 *
 * Usage:
 *   npm run steam:whoami -- <profile-url | vanity-name | steamid64>
 *
 * Needs only STEAM_API_KEY. Prints the STEAM_ID value to configure.
 */

import { createSteamClient, redact } from "./steam-api.mjs";

// Fall back to a configured STEAM_ID so the check can verify an existing setup.
const input = process.argv[2] || process.env.STEAM_ID;

if (!input) {
  console.error(
    [
      "Pass your profile URL, vanity name, or SteamID64:",
      "",
      "  npm run steam:whoami -- https://steamcommunity.com/id/yourname",
      "  npm run steam:whoami -- yourname",
      "",
      "Find the URL in the Steam client: click your name > View my profile,",
      "then copy it from the address bar (or right-click the page > Copy Page URL).",
      "",
      "With STEAM_ID already set in .env, no argument is needed.",
    ].join("\n"),
  );
  process.exit(1);
}

/** Pull a SteamID64 or vanity name out of whatever form was pasted in. */
function parseInput(raw) {
  const value = raw.trim().replace(/\/+$/, "");

  // Already a SteamID64: 17 digits starting with 7656119.
  if (/^7656119\d{10}$/.test(value)) return { steamId: value };

  const profiles = value.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profiles) return { steamId: profiles[1] };

  const vanity = value.match(/steamcommunity\.com\/id\/([^/?#]+)/);
  if (vanity) return { vanity: vanity[1] };

  if (/^https?:/i.test(value)) return { error: `Not a recognisable Steam profile URL: ${value}` };

  return { vanity: value };
}

async function main() {
  const key = process.env.STEAM_API_KEY;
  if (!key) {
    console.error("Missing STEAM_API_KEY. Put it in .env (copy .env.example) and retry.");
    process.exit(1);
  }

  const parsed = parseInput(input);
  if (parsed.error) {
    console.error(parsed.error);
    process.exit(1);
  }

  // steamId is not known yet when resolving a vanity name, so stand one in.
  let steamId = parsed.steamId;
  const client = createSteamClient({ key, steamId: steamId ?? "0" });

  if (!steamId) {
    steamId = await client.resolveVanity(parsed.vanity);
    if (!steamId) {
      console.error(`Steam does not know a profile named "${parsed.vanity}".`);
      console.error("If your profile URL looks like /profiles/7656119..., pass that number directly.");
      process.exit(1);
    }
  }

  const me = createSteamClient({ key, steamId });
  const summary = await me.playerSummary();
  const recent = await me.recentlyPlayedRaw();

  console.log("");
  console.log(`  Profile     ${summary?.personaname ?? "(unknown)"}`);
  if (summary?.profileurl) console.log(`  URL         ${summary.profileurl}`);
  console.log(`  STEAM_ID    ${steamId}`);
  console.log("");

  // communityvisibilitystate 3 = public. Anything else hides the profile, and
  // "Game details" can still be private even on a public profile.
  const profilePublic = summary?.communityvisibilitystate === 3;
  const playtimeVisible = Object.prototype.hasOwnProperty.call(recent, "total_count");

  if (!profilePublic) {
    console.log("  ! Profile is not public. Set Privacy Settings > My profile to Public.");
  }

  if (!playtimeVisible) {
    console.log("  ! Playtime is not readable. The API returned no game data at all, which");
    console.log("    means Privacy Settings > Game details is not set to Public.");
    console.log("    ('Friends only' fails here exactly like 'Private'.)");
    process.exitCode = 1;
  } else {
    const count = recent.total_count ?? 0;
    console.log(`  Playtime is readable. ${count} game(s) played in the last two weeks.`);
    for (const game of recent.games ?? []) {
      const hours = ((game.playtime_2weeks ?? 0) / 60).toFixed(1);
      console.log(`    - ${game.name} (${hours}h recently)`);
    }
    console.log("");
    console.log("  Setup looks good. Add STEAM_ID above to .env and to your GitHub Actions secrets.");
  }
  console.log("");
}

main().catch((err) => {
  console.error(redact(err.message, process.env.STEAM_API_KEY));
  process.exit(1);
});
