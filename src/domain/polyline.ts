import type { LngLat } from './types.ts'

export type Track = {
  points: LngLat[]
  cumulative: number[]
}

const METERS_PER_DEGREE = 111_320

export function decodePolyline(encoded: string, precision = 5): LngLat[] {
  const scale = 10 ** precision
  const points: LngLat[] = []
  let index = 0
  let latitude = 0
  let longitude = 0

  while (index < encoded.length) {
    const latitudeDelta = readChunk(encoded, index)
    index = latitudeDelta.index
    latitude += latitudeDelta.value
    const longitudeDelta = readChunk(encoded, index)
    index = longitudeDelta.index
    longitude += longitudeDelta.value
    points.push([longitude / scale, latitude / scale])
  }

  return points
}

export function measureTrack(points: readonly LngLat[]): Track | null {
  if (points.length < 2) return null
  const cumulative = [0]
  for (let index = 1; index < points.length; index += 1) {
    const previous = cumulative[index - 1] ?? 0
    cumulative.push(previous + distanceMeters(points[index - 1], points[index]))
  }
  return { points: points.map((point) => [point[0], point[1]]), cumulative }
}

export function snapToTrack(
  track: Track,
  longitude: number,
  latitude: number,
): { distance: number; bearing: number } {
  const target = project(latitude, [longitude, latitude])
  let best = Number.POSITIVE_INFINITY
  let distance = 0
  let bearing = 0

  for (let index = 1; index < track.points.length; index += 1) {
    const startPoint = track.points[index - 1]
    const endPoint = track.points[index]
    const start = project(latitude, startPoint)
    const end = project(latitude, endPoint)
    const dx = end.x - start.x
    const dy = end.y - start.y
    const lengthSquared = dx * dx + dy * dy
    const ratio =
      lengthSquared === 0
        ? 0
        : clamp(
            ((target.x - start.x) * dx + (target.y - start.y) * dy) / lengthSquared,
            0,
            1,
          )
    const closestX = start.x + dx * ratio
    const closestY = start.y + dy * ratio
    const gap = (closestX - target.x) ** 2 + (closestY - target.y) ** 2
    if (gap < best) {
      best = gap
      const segment = (track.cumulative[index] ?? 0) - (track.cumulative[index - 1] ?? 0)
      distance = (track.cumulative[index - 1] ?? 0) + segment * ratio
      bearing = segmentBearing(startPoint, endPoint)
    }
  }

  return { distance, bearing }
}

export function pointAlong(
  track: Track,
  distance: number,
): { longitude: number; latitude: number; bearing: number } {
  const lastIndex = track.points.length - 1
  const last = track.cumulative[lastIndex] ?? 0
  const clamped = clamp(distance, 0, last)
  let segment = 0
  while (segment < lastIndex - 1 && (track.cumulative[segment + 1] ?? 0) < clamped) {
    segment += 1
  }
  const next = Math.min(lastIndex, segment + 1)
  const startDistance = track.cumulative[segment] ?? 0
  const endDistance = track.cumulative[next] ?? startDistance
  const span = endDistance - startDistance
  const ratio = span === 0 ? 0 : clamp((clamped - startDistance) / span, 0, 1)
  const start = track.points[segment]
  const end = track.points[next]
  return {
    longitude: start[0] + (end[0] - start[0]) * ratio,
    latitude: start[1] + (end[1] - start[1]) * ratio,
    bearing: segmentBearing(start, end),
  }
}

export function heading(start: LngLat, end: LngLat): number {
  return segmentBearing(start, end)
}

export function smoothstep(amount: number): number {
  const t = clamp(amount, 0, 1)
  return t * t * (3 - 2 * t)
}

const MIN_GLIDE_METERS = 12

export function glideDuration(
  gapMs: number,
  moving: boolean,
  distanceMeters: number,
): number {
  if (distanceMeters < MIN_GLIDE_METERS) return 0
  if (!moving) return 700
  if (!Number.isFinite(gapMs) || gapMs <= 0) return 10_000
  return clamp(gapMs, 800, 12_000)
}

function readChunk(encoded: string, start: number): { value: number; index: number } {
  let value = 0
  let shift = 0
  let index = start
  while (index < encoded.length) {
    const byte = encoded.charCodeAt(index) - 63
    index += 1
    value |= (byte & 0x1f) << shift
    shift += 5
    if (byte < 0x20) break
  }
  const signed = (value & 1) === 1 ? ~(value >> 1) : value >> 1
  return { value: signed, index }
}

function distanceMeters(start: LngLat, end: LngLat): number {
  const lat1 = (start[1] * Math.PI) / 180
  const lat2 = (end[1] * Math.PI) / 180
  const dLat = ((end[1] - start[1]) * Math.PI) / 180
  const dLng = ((end[0] - start[0]) * Math.PI) / 180
  const haversine =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * 6_371_000 * Math.asin(Math.min(1, Math.sqrt(haversine)))
}

function project(originLatitude: number, point: LngLat): { x: number; y: number } {
  const latRad = (originLatitude * Math.PI) / 180
  return {
    x: point[0] * METERS_PER_DEGREE * Math.cos(latRad),
    y: point[1] * METERS_PER_DEGREE,
  }
}

function segmentBearing(start: LngLat, end: LngLat): number {
  const lat1 = (start[1] * Math.PI) / 180
  const lat2 = (end[1] * Math.PI) / 180
  const dLng = ((end[0] - start[0]) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
