import { pruneTrips, readPageSize } from '../../domain/rules.ts'
import { DEFAULT_PAGE_SIZE, type SelectedTrip } from '../../domain/types.ts'

export type BoardState = {
  page: number
  pageSize: ReturnType<typeof readPageSize>
  routeIds: string[]
  trips: SelectedTrip[]
  vehicleId: string | null
}

function positiveInt(raw: string | null, fallback: number): number {
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1) return fallback
  return value
}

function list(raw: string | null): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function parseTrip(token: string): SelectedTrip | null {
  const separator = token.indexOf('~')
  if (separator <= 0 || separator === token.length - 1) return null
  return { routeId: token.slice(0, separator), id: token.slice(separator + 1) }
}

export function parseBoardSearch(search: string): BoardState {
  const params = new URLSearchParams(search)
  const routeIds = list(params.get('routes'))
  const trips = list(params.get('trips')).flatMap((token) => {
    const trip = parseTrip(token)
    return trip ? [trip] : []
  })
  const vehicleId = params.get('vehicle')
  return {
    page: positiveInt(params.get('page'), 1),
    pageSize: readPageSize(params.get('pageSize')),
    routeIds,
    trips: pruneTrips(trips, routeIds),
    vehicleId: vehicleId && vehicleId.length > 0 ? vehicleId : null,
  }
}

export function boardSearch(state: BoardState): string {
  const params = new URLSearchParams()
  if (state.page !== 1) params.set('page', String(state.page))
  if (state.pageSize !== DEFAULT_PAGE_SIZE) params.set('pageSize', String(state.pageSize))
  if (state.routeIds.length > 0) params.set('routes', state.routeIds.join(','))
  if (state.trips.length > 0) {
    params.set('trips', state.trips.map((trip) => `${trip.routeId}~${trip.id}`).join(','))
  }
  if (state.vehicleId) params.set('vehicle', state.vehicleId)
  const query = params.toString()
  return query ? `?${query}` : ''
}
