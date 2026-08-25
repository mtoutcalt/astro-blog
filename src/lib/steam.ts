/**
 * Shaping helpers for the Steam activity log.
 *
 * The poller writes a flat, append-only event array; everything the timeline
 * page needs (day grouping, totals, per-game rollups) is derived here at build
 * time so the page itself stays declarative.
 */

export type PlayEvent = {
  id: string;
  type: "play";
  appid: number;
  name: string;
  minutes: number;
  covers_from: string;
  covers_to: string;
  at: string;
  day: string;
};

export type FirstPlayEvent = {
  id: string;
  type: "first_play";
  appid: number;
  name: string;
  at: string;
  day: string;
};

export type AchievementEvent = {
  id: string;
  type: "achievement";
  appid: number;
  name: string;
  achievement: string;
  description: string | null;
  icon: string | null;
  at: string;
  day: string;
};

export type MilestoneEvent = {
  id: string;
  type: "milestone";
  appid: number;
  name: string;
  hours: number;
  at: string;
  day: string;
};

export type SteamEvent = PlayEvent | FirstPlayEvent | AchievementEvent | MilestoneEvent;

export type SteamState = {
  version: number;
  last_polled_at: string | null;
  profile: { persona: string | null; avatar: string | null; profile_url: string | null } | null;
  now_playing: { name: string; appid: number | null; at: string } | null;
  apps: Record<
    string,
    {
      name: string;
      img_icon_url: string | null;
      playtime_forever: number;
      first_seen_at: string;
      last_played_at: string;
      achievements_since: number;
      milestones: number[];
    }
  >;
};

const TIMEZONE = "America/New_York";

/** Steam's 460x215 store capsule. Stable URL, keyed only on appid. */
export function headerImage(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

/**
 * Small square game icon. Not every app publishes capsule art — newer ones
 * often 404 — but the icon hash comes straight from the API and resolves.
 */
export function iconImage(appid: number, hash: string | null | undefined): string | null {
  if (!hash) return null;
  return `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`;
}

export function storeUrl(appid: number): string {
  return `https://store.steampowered.com/app/${appid}/`;
}

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatHours(mins: number): string {
  return (mins / 60).toFixed(mins < 600 ? 1 : 0);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Full timestamp in the display timezone, e.g. "Aug 24, 2026 at 5:00 AM EDT". */
export function formatDateTime(iso: string): string {
  // dateStyle/timeStyle cannot be combined with timeZoneName, so spell the
  // components out.
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** "Saturday, August 24" — year appended only when it is not the current one. */
export function formatDayLabel(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(y === new Date().getUTCFullYear() ? {} : { year: "numeric" }),
  }).format(date);
}

export type Day = {
  day: string;
  minutes: number;
  plays: PlayEvent[];
  moments: (AchievementEvent | MilestoneEvent | FirstPlayEvent)[];
};

/** Group the flat log into days, newest first. */
export function groupByDay(events: SteamEvent[]): Day[] {
  const days = new Map<string, Day>();

  for (const event of events) {
    let bucket = days.get(event.day);
    if (!bucket) {
      bucket = { day: event.day, minutes: 0, plays: [], moments: [] };
      days.set(event.day, bucket);
    }
    if (event.type === "play") {
      bucket.plays.push(event);
      bucket.minutes += event.minutes;
    } else {
      bucket.moments.push(event);
    }
  }

  for (const bucket of days.values()) {
    bucket.plays.sort((a, b) => b.minutes - a.minutes);
    bucket.moments.sort((a, b) => b.at.localeCompare(a.at));
  }

  return [...days.values()].sort((a, b) => b.day.localeCompare(a.day));
}

export type GameRollup = {
  appid: number;
  name: string;
  minutes: number;
  days: number;
  achievements: number;
};

/** Per-game totals across the whole log, biggest first. */
export function rollupGames(events: SteamEvent[]): GameRollup[] {
  const games = new Map<number, GameRollup & { dayKeys: Set<string> }>();

  const ensure = (event: SteamEvent) => {
    let game = games.get(event.appid);
    if (!game) {
      game = { appid: event.appid, name: event.name, minutes: 0, days: 0, achievements: 0, dayKeys: new Set() };
      games.set(event.appid, game);
    }
    return game;
  };

  for (const event of events) {
    const game = ensure(event);
    if (event.type === "play") {
      game.minutes += event.minutes;
      game.dayKeys.add(event.day);
    } else if (event.type === "achievement") {
      game.achievements += 1;
    }
  }

  return [...games.values()]
    .map(({ dayKeys, ...game }) => ({ ...game, days: dayKeys.size }))
    .filter((game) => game.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
}

export type Totals = {
  minutes: number;
  games: number;
  activeDays: number;
  achievements: number;
  longestDay: Day | null;
};

export function totals(days: Day[], games: GameRollup[]): Totals {
  const played = days.filter((d) => d.minutes > 0);
  return {
    minutes: played.reduce((sum, d) => sum + d.minutes, 0),
    games: games.length,
    activeDays: played.length,
    achievements: games.reduce((sum, g) => sum + g.achievements, 0),
    longestDay: played.reduce<Day | null>((best, d) => (!best || d.minutes > best.minutes ? d : best), null),
  };
}
