---
version: 1
slug: "src-features-fleet-fleetboard-tsx"
primary_target: "src/features/fleet/FleetBoard.tsx"
related_targets: ["src/features/fleet/VehicleCard.tsx","src/features/fleet/VehicleDialog.tsx","src/features/fleet/VehicleMap.tsx","src/components/MultiSelect.tsx","src/components/Pagination.tsx","src/components/StatusChip.tsx"]
---

# Fleet board

Mode: operate. One local screen, the read-only fleet board.

Audience: a reviewer watching a dispatcher find a live vehicle, filter by route and trip, and open its detail. Behavior, Indonesian copy, refresh, and the map pin's glide stay. The header and the ink stay navy. A generic operations grid would be the failure.

## Direction contract

THESIS: The board is a corridor blade. A route circle large enough to read while walking is how a vehicle is found. It refuses both the generic admin grid and a platform-edge stripe.

OWN-WORLD: Navy masthead and navy ink. A blue ground behind a white sheet. Mark blue is the short rule and the in-transit pill. Filters sit in a pale band. Cards are flat white enamel with a hairline and a 4px top rule. PT Sans, 400 and 700. The signature is the route circle, 56px, filled with the API route color.

STORY: The reviewer filters, reads the circle and the vehicle number, and opens the detail. The dialog repeats the circle. The map still glides along the trip shape.

FIRST VIEWPORT: Sticky navy masthead, name at the left, subtitle at the right. White sheet. "Kendaraan" at 40px, then a 48 by 4px mark. Pale filter band, two fields. Refresh line and Muat ulang. Three enamel cards: the circle at the top right, the vehicle number at 36px, the status once, the Boston time under it.

FORM: Koridor Blade, the first grounded candidate, chosen over the assigned platform edge. seed:e589dc2f321d3e78

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
