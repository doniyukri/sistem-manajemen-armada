import { mapOneVehicle, mapRouteCollection, mapTripCollection, mapVehicleCollection } from '../domain/mapResource.ts'
import { buildVehicleSearchParams, parsePageOffset } from '../domain/rules.ts'
import {
  OPTION_PAGE_SIZE,
  type JsonCollection,
  type JsonResource,
  type Route,
  type Trip,
  type Vehicle,
} from '../domain/types.ts'

const API_ORIGIN = 'https://api-v3.mbta.com'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`MBTA responded with ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

type JsonDocument = JsonCollection | {
  data: JsonResource
  included?: JsonResource[]
}

async function getDocument(path: string, params: URLSearchParams): Promise<JsonDocument> {
  const url = new URL(path, API_ORIGIN)
  url.search = params.toString()
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.api+json' },
  })
  if (!response.ok) throw new ApiError(response.status)
  return (await response.json()) as JsonDocument
}

export type VehiclePage = {
  vehicles: Vehicle[]
  lastOffset: number | null
  nextOffset: number | null
}

export async function getVehicles(input: {
  offset: number
  limit: number
  routeIds: readonly string[]
  tripIds: readonly string[]
}): Promise<VehiclePage> {
  const document = (await getDocument('/vehicles', buildVehicleSearchParams(input))) as JsonCollection
  return {
    vehicles: mapVehicleCollection(document),
    lastOffset: parsePageOffset(document.links?.last),
    nextOffset: parsePageOffset(document.links?.next),
  }
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const params = new URLSearchParams()
  params.set('include', 'route,trip,stop,trip.shape')
  const document = await getDocument(`/vehicles/${encodeURIComponent(id)}`, params)
  return mapOneVehicle(document)
}

export type OptionPage<T> = {
  items: T[]
  nextOffset: number | null
}

export async function getRoutes(offset: number): Promise<OptionPage<Route>> {
  const params = new URLSearchParams()
  params.set('page[offset]', String(offset))
  params.set('page[limit]', String(OPTION_PAGE_SIZE))
  params.set('sort', 'sort_order')
  const document = (await getDocument('/routes', params)) as JsonCollection
  return {
    items: mapRouteCollection(document),
    nextOffset: parsePageOffset(document.links?.next),
  }
}

export async function getTrips(
  routeIds: readonly string[],
  offset: number,
): Promise<OptionPage<Trip>> {
  const params = new URLSearchParams()
  params.set('page[offset]', String(offset))
  params.set('page[limit]', String(OPTION_PAGE_SIZE))
  params.set('filter[route]', [...routeIds].join(','))
  const document = (await getDocument('/trips', params)) as JsonCollection
  return {
    items: mapTripCollection(document),
    nextOffset: parsePageOffset(document.links?.next),
  }
}
