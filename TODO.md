# TODO

Working notes for Sistem Manajemen Armada. Decisions and the reasons for them live in `DECISIONS.md`. Domain words live in `CONTEXT.md`.

Status: the accepted design is implemented and checked in the browser on 2026-10-28. Deadline was 2026-10-28 10:00 local time. The public repository is not created yet.

## What we want

The full scope, in the order a reviewer should feel it. Check these off only when the behavior is true in the running app.

- [x] Vite + React + TypeScript strict + Tailwind + function components
- [x] MBTA JSON:API adapter. Components see Vehicle, Route, Trip, and Stop
- [x] TanStack Query for fetch, cache, loading, and error
- [x] Vehicle cards: label, status label plus raw code, latitude, longitude, last update in Boston time
- [x] Server pagination: range label, page size 5/10/20/50 (default 10), page count, page buttons
- [x] Exact “dari {total}”, cached until the filter or page size changes
- [x] Route multi-select, options lazy-loaded 20 at a time
- [x] Trip multi-select, disabled until a route is selected, then lazy-loaded for those routes
- [x] Removing a route drops trips that belonged only to that route
- [x] Detail dialog with the accepted fields, focus trapped, focus returned on close
- [x] MapLibre marker on OpenFreeMap Liberty, no API key
- [x] Refresh the current page every 30 seconds, paused while a dropdown or the dialog is open
- [x] Loading, empty, and error on the board, both dropdowns, and the dialog, each with a retry
- [x] Usable at phone width: stacked filters, one card column, full-height dialog
- [x] TransJakarta design language: navy header `#06367c`, blue field `#0846a1`, white sheet, PT Sans, 1rem cards, short `#174DA1` bar, flat surfaces, no copied logo
- [x] Unit tests for the query string, the total-count math, and trip pruning
- [x] ESLint, Prettier, `tsc --strict`
- [x] Indonesian README: how to run, folder boundaries, the two API traps
- [x] Speaker script for the 5–10 minute video

## Build order

Do these in order. A later box does not start while an earlier PDF box is broken.

1. [x] Scaffold the app in this folder with npm. Strict TypeScript, Tailwind, ESLint, Prettier, Vitest.
2. [x] Domain types and the MBTA adapter. Pure helpers: vehicle query string, total from `links.last`, prune trips when routes change. Tests for those three.
3. [x] Vehicle query hook and the board: header, cards, pagination, loading, empty, error.
4. [x] Route listbox with infinite scroll.
5. [x] Trip listbox, gated on the selected routes, including the prune rule. Filter changes return to page 1.
6. [x] Vehicle dialog and the accepted fields.
7. [x] Map in the dialog.
8. [x] 30-second refresh with pause, and the “last fetched” time.
9. [x] Phone layout pass.
10. [x] README and `docs/skrip-demo.md`.

## If time runs out

Stop adding, in this order. Record the cut in this file when it happens, with the date.

1. [ ] Do not start GitHub Actions or a deployed URL.
2. [ ] Replace auto-refresh with a “Muat ulang” button.
3. [ ] Skip unit tests that are not already written.
4. [ ] Skip the map.
5. [ ] Show the total as the `links.last` estimate, and say so in the README.

Never cut to save time: cards, pagination controls, both infinite-scroll filters, the dialog fields, loading, errors, strict TypeScript, the Indonesian README, the speaker script.

## How the pieces talk

Recorded here so the build does not invent a second plan.

- `src/api/` fetches MBTA and knows JSON:API.
- `src/domain/` holds Vehicle, Route, Trip, Stop, and the pure rules. No React.
- `src/features/fleet/` holds the board, the query hooks, and the dialog.
- `src/components/` holds the dialog shell, the listbox, the status chip, and pagination.
- Page, page size, selected route ids, selected trip ids, and the open vehicle id live in the URL. A refresh keeps the board the reviewer was looking at.
- Query keys include the filter and the page, so a filter change cannot show the previous filter’s rows as if they matched.

## Video beats

The script has to cover these three, in this order, with the code visible.

1. Get data: TanStack Query calls the adapter. The adapter requests `page[offset]`, `page[limit]`, `filter[route]`, `filter[trip]`, and `include=route,trip,stop`. The UI never parses `included` itself.
2. UI: Tailwind, the TransJakarta color shell, a native dialog, and our listbox. Name the keyboard behavior.
3. Pagination: server offset pages, the range label, and why one extra last-page request exists. The API does not return a total.

## Before the repo is public

- [x] Author name: Doni Prima Yukri. Print it in the README and the blue footer.
- [ ] Create the public repository `sistem-manajemen-armada`.
- [x] Confirm no API key, no logo file from transjakarta.co.id, and no secrets.

## Not in this submission

A backend, login, creating or editing vehicles, Redux, Next.js, Storybook, end-to-end tests, a component package, GitHub Actions, and a hosted URL. The marketing homepage on transjakarta.co.id is a reference for color and type only.
