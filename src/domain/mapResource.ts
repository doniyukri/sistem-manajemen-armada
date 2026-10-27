import { decodePolyline } from './polyline.ts'
import type { JsonCollection, JsonResource, Route, Stop, Trip, Vehicle } from './types.ts'

const FALLBACK_ROUTE_COLOR = '#174DA1'

function text(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function numberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function cssColor(value: unknown, fallback: string): string {
  const raw = text(value)?.replace('#', '')
  if (!raw || !/^[0-9a-fA-F]{6}$/.test(raw)) return fallback
  return `#${raw}`
}

function indexIncluded(included: JsonResource[] | undefined): Map<string, JsonResource> {
  const index = new Map<string, JsonResource>()
  for (const resource of included ?? []) {
    index.set(`${resource.type}:${resource.id}`, resource)
  }
  return index
}

function related(
  resource: JsonResource,
  name: string,
  index: Map<string, JsonResource>,
): JsonResource | null {
  const data = resource.relationships?.[name]?.data
  if (!data) return null
  return index.get(`${data.type}:${data.id}`) ?? null
}

export function mapRoute(resource: JsonResource): Route {
  const attributes = resource.attributes ?? {}
  const directionNames = Array.isArray(attributes.direction_names)
    ? attributes.direction_names.filter((name): name is string => typeof name === 'string')
    : []
  return {
    id: resource.id,
    shortName: text(attributes.short_name) ?? '',
    longName: text(attributes.long_name) ?? '',
    color: cssColor(attributes.color, FALLBACK_ROUTE_COLOR),
    textColor: cssColor(attributes.text_color, '#FFFFFF'),
    description: text(attributes.description) ?? '',
    directionNames,
  }
}

export function mapTrip(resource: JsonResource, routeId: string | null): Trip {
  const attributes = resource.attributes ?? {}
  return {
    id: resource.id,
    headsign: text(attributes.headsign) ?? '',
    name: text(attributes.name) ?? '',
    directionId: numberValue(attributes.direction_id),
    routeId,
  }
}

export function mapStop(resource: JsonResource): Stop {
  return {
    id: resource.id,
    name: text(resource.attributes?.name) ?? resource.id,
  }
}

export function mapVehicle(resource: JsonResource, index: Map<string, JsonResource>): Vehicle {
  const attributes = resource.attributes ?? {}
  const routeResource = related(resource, 'route', index)
  const tripResource = related(resource, 'trip', index)
  const stopResource = related(resource, 'stop', index)
  const tripRouteId = tripResource?.relationships?.route?.data?.id ?? routeResource?.id ?? null
  const shapeRef = tripResource?.relationships?.shape?.data
  const shapeResource = shapeRef ? (index.get(`${shapeRef.type}:${shapeRef.id}`) ?? null) : null
  const polyline = text(shapeResource?.attributes?.polyline)
  return {
    id: resource.id,
    label: text(attributes.label) ?? resource.id,
    status: text(attributes.current_status) ?? 'UNKNOWN',
    latitude: numberValue(attributes.latitude),
    longitude: numberValue(attributes.longitude),
    updatedAt: text(attributes.updated_at),
    directionId: numberValue(attributes.direction_id),
    bearing: numberValue(attributes.bearing),
    occupancyStatus: text(attributes.occupancy_status),
    route: routeResource ? mapRoute(routeResource) : null,
    trip: tripResource ? mapTrip(tripResource, tripRouteId) : null,
    stop: stopResource ? mapStop(stopResource) : null,
    shapeId: shapeRef?.id ?? null,
    shape: polyline ? decodePolyline(polyline) : null,
  }
}

export function mapVehicleCollection(collection: JsonCollection): Vehicle[] {
  const index = indexIncluded(collection.included)
  return collection.data
    .filter((resource) => resource.type === 'vehicle')
    .map((resource) => mapVehicle(resource, index))
}

export function mapOneVehicle(document: {
  data: JsonResource | JsonResource[]
  included?: JsonResource[]
}): Vehicle {
  const resource = Array.isArray(document.data) ? document.data[0] : document.data
  if (!resource) throw new Error('Respons kendaraan kosong.')
  return mapVehicle(resource, indexIncluded(document.included))
}

export function mapRouteCollection(collection: JsonCollection): Route[] {
  return collection.data.filter((resource) => resource.type === 'route').map(mapRoute)
}

export function mapTripCollection(collection: JsonCollection): Trip[] {
  return collection.data
    .filter((resource) => resource.type === 'trip')
    .map((resource) => mapTrip(resource, resource.relationships?.route?.data?.id ?? null))
}
