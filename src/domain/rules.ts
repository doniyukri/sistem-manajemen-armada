import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  type PageSize,
  type SelectedTrip,
  type Vehicle,
} from './types.ts'

const API_ORIGIN = 'https://api-v3.mbta.com'

export function buildVehicleSearchParams(input: {
  offset: number
  limit: number
  routeIds: readonly string[]
  tripIds: readonly string[]
}): URLSearchParams {
  const params = new URLSearchParams()
  params.set('page[offset]', String(input.offset))
  params.set('page[limit]', String(input.limit))
  params.set('include', 'route,trip,stop')
  if (input.routeIds.length > 0) params.set('filter[route]', input.routeIds.join(','))
  if (input.tripIds.length > 0) params.set('filter[trip]', input.tripIds.join(','))
  return params
}

export function parsePageOffset(link: string | null | undefined): number | null {
  if (!link) return null
  try {
    const url = new URL(link, API_ORIGIN)
    const raw = url.searchParams.get('page[offset]')
    if (raw == null) return null
    const value = Number(raw)
    if (!Number.isInteger(value) || value < 0) return null
    return value
  } catch {
    return null
  }
}

/**
 * MBTA list responses include links.last and no total.
 * The exact count is the last page offset plus the number of rows on that page.
 * Returns null while the last page still has to be fetched.
 */
export function exactTotal(input: {
  offset: number
  countOnPage: number
  lastOffset: number | null
  countOnLastPage: number | null
}): number | null {
  if (input.offset === 0 && input.countOnPage === 0) return 0
  if (input.lastOffset == null || input.lastOffset === input.offset) {
    return input.offset + input.countOnPage
  }
  if (input.countOnLastPage == null) return null
  return input.lastOffset + input.countOnLastPage
}

export function pruneTrips(
  trips: readonly SelectedTrip[],
  routeIds: readonly string[],
): SelectedTrip[] {
  const allowed = new Set(routeIds)
  return trips.filter((trip) => allowed.has(trip.routeId))
}

export function isPageSize(value: number): value is PageSize {
  return PAGE_SIZES.some((size) => size === value)
}

export function readPageSize(raw: string | null): PageSize {
  const value = Number(raw)
  return isPageSize(value) ? value : DEFAULT_PAGE_SIZE
}

function reportedAt(vehicle: Vehicle): number {
  const time = Date.parse(vehicle.updatedAt ?? '')
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time
}

/** Prefer the newer report, and keep a trip shape the list response does not include. */
export function fresherVehicle(listed: Vehicle, detail: Vehicle): Vehicle {
  const chosen = reportedAt(detail) >= reportedAt(listed) ? detail : listed
  const other = chosen === detail ? listed : detail
  if (chosen.shape != null || other.shape == null) return chosen
  return { ...chosen, shape: other.shape, shapeId: other.shapeId }
}
