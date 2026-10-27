# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The person at the screen is doing a dispatcher's job, and a professional reviewer is watching that job. The reviewer is evaluating Doni Prima Yukri's TransJakarta frontend technical test. Success is that the reviewer can follow the work without a tour: find a live vehicle, filter by route and trip, and open its detail.

## Product Purpose

Sistem Manajemen Armada is a read-only fleet board of vehicles that are reporting a position right now. It exists so that job can be done on the public MBTA v3 feed, which is the API the brief requires. Success is a board the reviewer can operate as that dispatcher, covering the brief's screen, filters, pagination, detail, and plain-language errors.

## Positioning

The vehicles, routes, and trips are MBTA's, in Boston. The interface is Indonesian and uses the public TransJakarta site as its design-language reference. It is not a Jakarta fleet and not a TransJakarta backend. A neighboring operations screen could not truthfully copy both of those facts at once.

## Operating Context

One local screen, opened from the Vite dev server. There is no login. The URL holds the page, page size, selected routes, selected trips, and the open vehicle, so a refresh keeps the same view. The reviewer is expected to record a 5–10 minute demo of fetch, the interface, and pagination. The public GitHub repository and that video are still undone.

## Capabilities and Constraints

The board lists the current vehicle page from MBTA, 5/10/20/50 rows at a time, with an exact total. Route and trip are multi-selects that load further pages as the list is scrolled. Several routes match as OR, several trips match as OR, and route plus trip match as AND. The trip list stays closed until at least one route is selected. Removing a route also removes a selected trip that belonged only to that route.

Detail is a dialog on this screen, not a separate page. It shows the vehicle label, status, coordinates, last update, route, trip, current stop, direction, occupancy, vehicle id, bearing, and a map of the trip shape. The map pin moves along that shape from one reported position to the next.

The current page reloads every 30 seconds, including while a menu or the dialog is open. The open vehicle reloads every 10 seconds. A failed reload keeps the last cards. Returning to the browser tab reloads only when the data is already older than its interval.

Confirmed words: fleet board, vehicle, route, trip, stop, vehicle status. Do not call the screen a dashboard, a vehicle a bus, a route a line, or a stop a station.

Out of scope: a backend, login, create and edit, Redux, Next.js, Storybook, end-to-end tests, a published component package, GitHub Actions, and a hosted URL.

## Brand Commitments

The product name is Sistem Manajemen Armada. The author named in the interface and the README is Doni Prima Yukri. The interface language is Indonesian. Each vehicle status shows an Indonesian label and the raw API code. Vehicle times use America/New_York and are labeled waktu Boston. The public TransJakarta site is the binding design-language reference. Do not copy its logo, its homepage, or its marketing layout.

## Evidence on Hand

- The brief is `Tes Teknis Frontend.pdf`.
- Live positions come from `https://api-v3.mbta.com`. No API key.
- The demo narration is `docs/skrip-demo.md`. It is a script for the author, not a customer quote.
- There is no hosted deployment, no public repository yet, and no testimonial, case study, or press to cite. Do not invent any.

## Product Principles

- The screen is an operations tool. The technical test is why it exists, not a second product.
- Show only positions the API reported. Never present Boston vehicles as a Jakarta fleet.
- The whole job is finding a vehicle, filtering it, and opening its detail. The board does not edit the fleet.
- Indonesian labels stay beside the raw API codes so the mapping can be checked.
- Say when the data was loaded, and whose clock that time belongs to.

## Accessibility & Inclusion

The board must stay usable at phone width. Filters, pagination, and the detail dialog must be operable from the keyboard. No formal accessibility standard was named.
