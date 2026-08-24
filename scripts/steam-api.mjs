/**
 * Thin client for the Steam Web API.
 *
 * Only the handful of endpoints the activity poller needs. Every call is
 * retried on transient failures and never leaks the API key into an error
 * message (these surface in public CI logs).
 */

const BASE = "https://api.steampowered.com";

export class SteamApiError extends Error {
  constructor(message, { status, endpoint } = {}) {
    super(message);
    this.name = "SteamApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/** Strip anything that looks like a key out of text bound for a log. */
export function redact(text, key) {
  if (!key) return text;
  return String(text).split(key).join("<redacted>");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(endpoint, params, { key, retries = 3, timeoutMs = 15000 }) {
  const url = new URL(`${BASE}/${endpoint}`);
  url.searchParams.set("key", key);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(Math.min(500 * 2 ** (attempt - 1), 4000));

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { "user-agent": "astro-blog-steam-activity/1.0" },
      });

      // 401/403 mean a bad key or a private profile. Retrying will not help.
      if (res.status === 401 || res.status === 403) {
        throw new SteamApiError(
          `${endpoint} returned ${res.status} — check STEAM_API_KEY and that the profile's "Game details" privacy is set to Public`,
          { status: res.status, endpoint },
        );
      }
      // 400 usually means the app has no stats/achievements for this user.
      if (res.status === 400) {
        throw new SteamApiError(`${endpoint} returned 400 (no data for these parameters)`, {
          status: 400,
          endpoint,
        });
      }
      if (!res.ok) {
        lastError = new SteamApiError(`${endpoint} returned ${res.status}`, {
          status: res.status,
          endpoint,
        });
        continue; // 429 / 5xx — worth another try
      }

      return await res.json();
    } catch (err) {
      if (err instanceof SteamApiError && err.status !== undefined && err.status < 500 && err.status !== 429) {
        throw err;
      }
      lastError = err;
    }
  }

  throw new SteamApiError(redact(`${endpoint} failed after ${retries + 1} attempts: ${lastError?.message}`, key), {
    endpoint,
  });
}

export function createSteamClient({ key, steamId }) {
  if (!key) throw new Error("Missing STEAM_API_KEY");
  if (!steamId) throw new Error("Missing STEAM_ID (your 64-bit SteamID)");

  return {
    /** Turns a vanity profile name into a 64-bit SteamID, or null. */
    async resolveVanity(vanity) {
      const data = await call("ISteamUser/ResolveVanityURL/v1/", { vanityurl: vanity }, { key });
      return data?.response?.success === 1 ? data.response.steamid : null;
    },

    /**
     * Raw GetRecentlyPlayedGames response. Worth having separately: a private
     * "Game details" setting returns {} while a public profile with no recent
     * play returns { total_count: 0 }, and only the raw body tells them apart.
     */
    async recentlyPlayedRaw() {
      const data = await call("IPlayerService/GetRecentlyPlayedGames/v1/", { steamid: steamId }, { key });
      return data?.response ?? {};
    },

    /** Games played in the last two weeks, with playtime in minutes. */
    async recentlyPlayed() {
      return (await this.recentlyPlayedRaw()).games ?? [];
    },

    /** Profile summary — includes the game currently being played, if any. */
    async playerSummary() {
      const data = await call("ISteamUser/GetPlayerSummaries/v2/", { steamids: steamId }, { key });
      return data?.response?.players?.[0] ?? null;
    },

    /** Unlocked achievements for one game. Returns [] when the game has none. */
    async achievements(appid) {
      try {
        const data = await call(
          "ISteamUserStats/GetPlayerAchievements/v1/",
          { steamid: steamId, appid, l: "english" },
          { key, retries: 1 },
        );
        if (!data?.playerstats?.success) return [];
        return data.playerstats.achievements ?? [];
      } catch (err) {
        if (err instanceof SteamApiError && (err.status === 400 || err.status === 403)) return [];
        throw err;
      }
    },

    /** Achievement display names + icons for one game. Returns a Map keyed by apiname. */
    async achievementSchema(appid) {
      try {
        const data = await call("ISteamUserStats/GetSchemaForGame/v2/", { appid, l: "english" }, { key, retries: 1 });
        const list = data?.game?.availableGameStats?.achievements ?? [];
        return new Map(list.map((a) => [a.name, a]));
      } catch (err) {
        if (err instanceof SteamApiError && (err.status === 400 || err.status === 403)) return new Map();
        throw err;
      }
    },
  };
}
