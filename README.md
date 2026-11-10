# Carols songbook

This is a static React app. Song lyrics live in individual files under `src/data/songs/`; `src/data/songs/index.js` is the catalog that controls which songs appear. A database is unnecessary while songs are maintained through this repository and published with the site.

The app caches its shell and same-origin assets for offline use. Visitors need to open the site online once so the service worker can install and cache the app; after that, the songbook can open without a connection. Service workers require HTTPS (or localhost during development).

## Add or activate songs

1. Add a new `.js` file in `src/data/songs/`, following an existing song file. Put only the lyrics in the file.
2. Import that file in `src/data/songs/index.js` and add it to `songCatalog` with `title`, `content`, and `active`. When alternate-language lyrics are available, also set `otherLangContent` to the imported lyrics; otherwise omit it.
3. To hide a song while retaining its lyrics, change its catalog entry to `active: false`. Set it back to `true` when you want to use it again.
4. Build and deploy the site for changes to appear to visitors.

Only active songs appear in the songbook, search, favourites, next/previous navigation, and shared song links. A link to an inactive song opens the songbook instead. Visitors cannot change active status themselves.

Treat repository write access as admin access: only people allowed to edit and deploy this code can change song status. There is no public admin page or browser setting for it.

If songs need to be edited or activated without changing code and redeploying, a content management system or backend would be the next step.

## Development

Run `npm start` for local development, `npm test -- --watch=false` for tests, and `npm run build` for a production build.
