# Minimal Astro App

A stripped-down Astro application with just the essentials.

## Requirements

Node 24 (see `.nvmrc`). This is also the version Vercel builds with, pinned via
`engines.node` in `package.json`.

## Commands

| Command       | Action                           |
| :------------ | :------------------------------- |
| `npm install` | Installs dependencies            |
| `npm run dev` | Starts local dev server          |
| `npm run build` | Build production site            |
| `npm run preview` | Preview build locally          |
## Steam activity log

`/steam` renders an automatically collected log of what I have been playing.

### How it works

Steam has no session-history API — nothing reports "played Hades 8:14pm–10:02pm".
The only cumulative signal is `playtime_forever` per game, so activity is
reconstructed by diffing it:

1. `.github/workflows/steam-activity.yml` runs daily at 09:00 UTC (~5am US
   Eastern, chosen so a 24-hour window contains a whole "gaming day" instead of
   splitting late-night play across two entries).
2. `scripts/poll-steam.mjs` fetches recently-played games, compares each total
   against the baseline in `src/data/steam-state.json`, and appends any movement
   to `src/data/steam-events.json`.
3. Changed data is committed, which triggers a Vercel redeploy of the page.

Durations are accurate; start and end times are not recorded. Achievement
unlocks are the exception — those carry real timestamps and appear at the exact
minute they happened.

### Event types

| Type | Meaning |
| :--- | :------ |
| `play` | Minutes a game gained over the window |
| `first_play` | A game appeared in the log for the first time |
| `achievement` | An achievement unlocked (exact timestamp) |
| `milestone` | Lifetime playtime crossed 1/5/10/25/50/100/250/500/1000 hours |

### Setup

1. Get an API key at <https://steamcommunity.com/dev/apikey>.
2. Find your 64-bit SteamID (17 digits). Put the key in `.env` first (copy
   `.env.example`), then let Steam resolve it for you — this also confirms the
   key works and that playtime is actually readable:

   ```sh
   npm run steam:whoami -- https://steamcommunity.com/id/yourname
   ```

   Accepts a profile URL, a bare vanity name, or a SteamID64.
3. Set **Game details** on your Steam profile to **Public**, or the API returns
   nothing. (Privacy → Game details. "Private" and "Friends only" both fail.)
4. Add repository secrets `STEAM_API_KEY` and `STEAM_ID` under
   Settings → Secrets and variables → Actions.
5. Run the workflow once by hand (Actions → Steam activity → Run workflow). The
   first run only records baselines and emits no events — that is deliberate, so
   the log starts now rather than replaying years of accumulated playtime as one
   entry.

### Running locally

Copy `.env.example` to `.env` and fill in both values. `.env` is gitignored;
the npm scripts load it with `--env-file-if-exists`, so the same commands work
in CI where the secrets arrive as real environment variables instead.

```sh
npm run steam:dry-run   # print what would change, write nothing
npm run steam:poll      # write the data files
```

### Notes

- The state file is rewritten every run so the next window knows where it
  started, which means one small commit per day even when nothing was played.
  The commit message says which it was.
- GitHub disables scheduled workflows after 60 days of repository inactivity.
  The daily commit normally counts as activity, but if the job goes quiet, check
  the Actions tab first.
- A missed run is not lost data. `GetRecentlyPlayedGames` covers a rolling two
  weeks and the baseline diff is cumulative, so playtime is still captured — it
  is just attributed to the day of the next successful run.
