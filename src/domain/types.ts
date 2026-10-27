export const PAGE_SIZES = [5, 10, 20, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const OPTION_PAGE_SIZE = 20
export const REFRESH_MS = 30_000
export const VEHICLE_POLL_MS = 10_000

export type LngLat = readonly [number, number]

export type PageSize = (typeof PAGE_SIZES)[number]

export type Route = {
  id: string
  shortName: string
  longName: string
  color: string
  textColor: string
  description: string
  directionNames: string[]
}

export type Trip = {
  id: string
  headsign: string
  name: string
  directionId: number | null
  routeId: string | null
}

export type Stop = {
  id: string
  name: string
}

export type Vehicle = {
  id: string
  label: string
  status: string
  latitude: number | null
  longitude: number | null
  updatedAt: string | null
  directionId: number | null
  bearing: number | null
  occupancyStatus: string | null
  route: Route | null
  trip: Trip | null
  stop: Stop | null
  shapeId: string | null
  shape: LngLat[] | null
}

export type SelectedTrip = {
  id: string
  routeId: string
}

export type JsonResource = {
  id: string
  type: string
  attributes?: Record<string, unknown>
  relationships?: Record<string, { data?: { id: string; type: string } | null }>
}

export type JsonCollection = {
  data: JsonResource[]
  included?: JsonResource[]
  links?: {
    first?: string
    last?: string
    next?: string
    prev?: string
  }
}
