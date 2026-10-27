# Decisions

Grilling log for the TransJakarta frontend technical test (Sistem Manajemen Armada).

Status: design accepted on 2026-10-28, and the screen in this file is what the app implements. The working checklist is `TODO.md`. Deadline was 2026-10-28 10:00 local time.

## Accepted

### Audience

The reviewer is a professional frontend developer. The repository should read as a small professional project: typed boundaries, honest trade-offs, and a screen that holds up when resized and when the API misbehaves. Meeting the PDF is the floor, not the finish.

### Process

- Decisions are recorded in this file as they are accepted.
- The build checklist, drop order, and video beats live in `TODO.md`.
- Domain words live in `CONTEXT.md`. Implementation does not.
- An ADR is written only for a choice that is hard to reverse, surprising later, and the result of a real trade-off.
- The demo video is recorded by the candidate. The repo includes a short speaker script once the screen is frozen.
- The candidate can explain TanStack Query and strict TypeScript on camera. The script will spell out query keys, keeping the previous page visible while the next page loads, and offset pagination.

### Assignment constraints

Source: `Tes Teknis Frontend.pdf`.

- Read-only fleet board. The PDF does not ask for login, creating vehicles, or editing vehicles.
- React, Tailwind, function components, and hooks.
- Vehicle data comes from the MBTA v3 Vehicle index API.
- The board shows vehicles as cards: label, current status, latitude, longitude, last update.
- Vehicle pagination shows the visible range, a page-size control, the number of pages, and page buttons.
- Route and trip filters are multi-select dropdowns. Their options use infinite scroll.
- Vehicle detail opens in a popup with the card fields, route, trip, and any other fields we judge useful. A map is a bonus.
- Every fetch shows a loading indicator. Failures show a plain-language error.
- TypeScript is a bonus.
- Delivery is a public GitHub repository and a README with run steps and a short architecture note.
- The 5–10 minute video must explain how data is fetched, how the UI is built, and how pagination works.

### Verified API facts

Checked against the live API on 2026-10-27. These are constraints, not design choices.

- Base URL: `https://api-v3.mbta.com`. Responses are JSON:API. No API key is required for this volume.
- `GET /vehicles` returns the vehicles reporting right now (about 550 at the time of the check).
- Vehicle pages use `page[offset]` and `page[limit]`. The body includes `links.first`, `links.last`, and `links.next`. It does not include a total count.
- `filter[route]` and `filter[trip]` accept comma-separated ids. `include=route,trip,stop` embeds those resources.
- `GET /routes` can be paged. There are about 179 routes.
- `GET /trips` with no filter returns 400: at least one filter is required. A trip dropdown cannot lazy-load every trip in the system.
- A vehicle’s useful attributes include `label`, `current_status`, `latitude`, `longitude`, `updated_at`, `direction_id`, `bearing`, and `occupancy_status`. Status values used by the brief are `IN_TRANSIT_TO`, `STOPPED_AT`, and `INCOMING_AT`.

### Baseline

Accepted in full on 2026-10-27.

1. Vite, React, TypeScript in strict mode, Tailwind, function components.
2. JSON:API stays in an adapter. Components receive a Vehicle, Route, Trip, or Stop.
3. TanStack Query owns fetch, cache, loading, and error. The page owns the open popup, selected ids, page, and page size.
4. Vehicle pages are server-side: `page[offset]` and `page[limit]`. Default page size 10, choices 5, 10, 20, 50. A filter or page-size change returns to page 1.
5. Routes lazy-load in pages. The trip dropdown stays disabled until at least one route is selected, then lazy-loads trips for those routes. Several routes match as OR, several trips match as OR, and route plus trip match as AND.
6. Detail is a dialog on this screen. Fields: label, status, latitude, longitude, last update, route short name, long name, and color, trip headsign, current stop name, direction, occupancy, and vehicle id. MapLibre shows the position, with no API key in the repo.
7. The current vehicle page refreshes every 30 seconds, including while a dropdown or the dialog is open. The cards stay fully visible during that refresh. A failed refresh keeps the last cards and says the update failed. The screen shows the time of the last successful fetch and how long ago it was. The open vehicle refreshes every 10 seconds, and its card uses whichever report is newer. Returning to the browser tab refreshes only when that data is already older than its interval. The map pin glides along the trip shape from the previous report to the new one, then waits.
8. One operations screen, usable at phone width. Filters stack and the dialog becomes a full-height sheet.
9. The board, both dropdowns, and the dialog each have loading, empty, and error states. An error says what failed and offers a retry.
10. Unit tests cover the vehicle query string, the total-count math, and dropping a trip whose route was removed. ESLint, Prettier, and `tsc --strict` are required.
11. The README is in Indonesian and explains how to run, the folder boundaries, and the two API traps: vehicles have no total count, and trips cannot be listed without a filter.

Explicitly out of the repo: a backend, login, create and edit, Redux, Next.js, Storybook, end-to-end tests, and a published component package.

### Filter and pagination behavior

- Removing a route also removes any selected trip that ran only on that route. The board then shows vehicles on the routes that remain.
- “Menampilkan {awal}–{akhir} dari {total} data” uses an exact total. The total is computed from `links.last`, plus one request of the last page when the remainder is unknown. That result is cached until the filter or page size changes.
- A list refresh does not wait for the dialog or the dropdowns to close. The last successful cards stay on screen if the new request fails.

### Language

Indonesian interface. Each vehicle status shows an Indonesian label and the raw API code. Code identifiers stay English. The README is Indonesian.

Accepted copy:

| Place | Copy |
| --- | --- |
| Title | Sistem Manajemen Armada |
| Subtitle | Posisi kendaraan langsung dari API MBTA. |
| Range | Menampilkan {awal}–{akhir} dari {total} data |
| Empty board | Tidak ada kendaraan untuk filter ini. |
| Board error | Gagal memuat kendaraan. Periksa koneksi, lalu coba lagi. |
| Trip dropdown before a route | Pilih rute terlebih dahulu. |
| Status | Dalam perjalanan / `IN_TRANSIT_TO`, Berhenti / `STOPPED_AT`, Akan tiba / `INCOMING_AT` |
| Card time | Diperbarui {waktu} waktu Boston |

### Visual

The design language is the public site at `https://transjakarta.co.id/`, taken from its `kustom.css` on 2026-10-27. The fleet board uses that language. It does not reproduce the marketing homepage.

Structure, matching their page:

- Fixed header `#06367c`, white PT Sans Bold at 1.1rem, vertical padding 0.5rem.
- The area outside the sheet is `#0846a1`. The board is a white sheet, the same move as their `main`.
- A short footer in `#0846a1` with white text, including the author credit.
- Section titles are PT Sans Bold in `#06367c`. A section is marked by a short bar, `#174DA1` at about 0.25rem tall, the same device as `#layanan .garis`.

Type and color:

- PT Sans Regular for body at 1rem, color `#06367c`. PT Sans Bold for titles. Loaded from a font package, not from their server.
- Meta text at 0.8rem. Secondary text `#5B5B5B`.
- Links and text actions `#06367c`, with no underline.
- Accent `#0846a1` and `#174DA1`. Quiet panels and selected chips `#CDE6FD`. Pale separation `#EBF3F9`. Hairline borders `#CDD6E4`. Dividers `#A9A9A9`.
- Cards and photos use a 1rem radius. Small controls use a 5px radius. Cards are flat. The site’s only strong shadow, `0 5px 6px rgba(0, 0, 0, 0.25)`, stays on the filter bar if a separation from the sheet is needed.
- Status chips: Dalam perjalanan in `#174DA1`, Berhenti in `#5B5B5B`, Akan tiba in `#35A344`.
- A route mark is their circular badge shape. The fill is the route color from the API, with `#174DA1` when the API sends none. White label.

Left on their site and out of this board: the logo file, the carousel, the news list, the service tiles, Bootstrap, and the red fallback painted on every route number.

The map style is OpenFreeMap Liberty at `https://tiles.openfreemap.org/styles/liberty`. Confirmed reachable on 2026-10-28. No API key.

### Time

`updated_at` is shown in Boston local time (`America/New_York`) and labeled “waktu Boston”. It is not converted to WIB.

### Widgets

The vehicle detail uses a native `<dialog>`. Each filter is a small listbox we write: checkbox rows, an infinite-scroll sentinel, Escape to close, arrows to move, Space to toggle. No headless component library.

### Repository

Public GitHub repository name: `sistem-manajemen-armada`.

Author printed in the README and the footer: Doni Prima Yukri.

### If time runs out

Accepted drop order. The full wanted scope stays written in `TODO.md`. Drop in this order, and stop as soon as the deadline wins:

1. GitHub Actions and a deployed URL. They are not started.
2. The 30-second refresh becomes a “Muat ulang” button.
3. The unit tests.
4. The map.
5. The exact “dari N” count falls back to the estimate from `links.last`.

Never drop: cards, pagination, both filters with infinite scroll, the dialog, loading, errors, strict TypeScript, the Indonesian README, and the speaker script.

## Open

None. The design is accepted.

## Rejected

- Cloning the TransJakarta marketing homepage.
- Putting their logo file in the repository.
- Converting vehicle timestamps to WIB.
- React Aria, or any other headless component library, for the dialog and the dropdowns.
- A backend, login, create and edit, Redux, Next.js, Storybook, end-to-end tests, and a published component package.
