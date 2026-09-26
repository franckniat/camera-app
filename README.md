# Web camera app

Take pictures and record videos right from the browser. Everything stays on your device: captures are stored locally in IndexedDB and never uploaded.

## Features

- **Photos** with self-timer (3 s / 10 s), mirror mode and a capture flash
- **Videos** with optional sound and a recording timer (WebM, or MP4 on Safari/iOS)
- **Camera switching** (front/back on phones, any connected webcam on desktop)
- **Gallery**: full-screen viewer with keyboard navigation, per-item download, download everything as a `.zip`, delete with confirmation
- **Keyboard shortcut**: <kbd>Space</kbd> takes a picture or starts/stops recording
- **English and French** interface (`/en`, `/fr`), picked from the browser language and remembered
- Light and dark themes

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler) and React 19
- [Tailwind CSS 4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- Native `getUserMedia` / `MediaRecorder` APIs, [idb-keyval](https://github.com/jakearchibald/idb-keyval) for storage, [client-zip](https://github.com/Touffy/client-zip) for archives

All pages are statically prerendered. Camera code is loaded on the client only, and the gallery panel is only downloaded the first time it is opened.

## Getting started

Requires [Bun](https://bun.sh) (or Node.js 20.9+ with npm).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `bun dev`           | Development server            |
| `bun run build`     | Production build              |
| `bun start`         | Serve the production build    |
| `bun run lint`      | ESLint                        |
| `bun run typecheck` | TypeScript                    |

> Browsers only allow camera access on **HTTPS** or `localhost`. To test on a phone over your local network, use an HTTPS tunnel or `next dev --experimental-https`.

## Project structure

```
app/[lang]/              Localized pages (home, photos, videos)
components/camera/       Camera preview, toolbar, photo and video modes
components/gallery/      Gallery button, panel and full-screen viewer
hooks/                   Camera stream, settings, media library
lib/                     Storage (IndexedDB), capture helpers, i18n
proxy.ts                 Redirects unprefixed URLs to the visitor's language
```

## Browser support

Recent versions of Chrome, Edge, Firefox and Safari (desktop and mobile). Video recording uses the best format the browser supports.

## License

[MIT](LICENSE)
