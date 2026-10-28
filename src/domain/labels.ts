import type { Route, Trip } from './types.ts'

const STATUS_LABELS: Record<string, string> = {
  IN_TRANSIT_TO: 'Dalam perjalanan',
  STOPPED_AT: 'Berhenti',
  INCOMING_AT: 'Akan tiba',
}

const OCCUPANCY_LABELS: Record<string, string> = {
  MANY_SEATS_AVAILABLE: 'Banyak kursi tersedia',
  FEW_SEATS_AVAILABLE: 'Sedikit kursi tersedia',
  FULL: 'Penuh',
  STANDING_ROOM_ONLY: 'Hanya tempat berdiri',
  CRUSHED_STANDING_ROOM_ONLY: 'Sangat penuh',
  EMPTY: 'Kosong',
  NOT_ACCEPTING_PASSENGERS: 'Tidak menerima penumpang',
}

const bostonTime = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'America/New_York',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const localTime = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function occupancyLabel(status: string | null): string | null {
  if (!status) return null
  return OCCUPANCY_LABELS[status] ?? status
}

export function formatBoston(iso: string | null): string {
  if (!iso) return 'Tidak ada waktu'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return bostonTime.format(date)
}

export function formatLocalClock(timestamp: number): string {
  return localTime.format(timestamp)
}

function sincePhrase(then: number, now: number): string {
  const totalSeconds = Math.floor(Math.max(0, now - then) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours} jam ${minutes} menit yang lalu`
  if (minutes > 0) return `${minutes} menit ${seconds} detik yang lalu`
  return `${seconds} detik yang lalu`
}

/** Card line. Seconds only under a minute, then minutes and leftover seconds. */
export function formatUpdatedAgo(iso: string | null, now: number): string {
  if (!iso) return 'Diperbarui tidak ada waktu'
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return 'Diperbarui tidak ada waktu'
  return `Diperbarui ${sincePhrase(then, now)}`
}

/** Age of the board fetch, without the "Diperbarui" prefix. */
export function formatSince(then: number, now: number): string {
  return sincePhrase(then, now)
}

export function formatAge(then: number, now: number): string {
  const elapsed = Math.max(0, now - then)
  if (elapsed < 5_000) return 'baru saja'
  if (elapsed < 60_000) return `${Math.floor(elapsed / 1000)} detik lalu`
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)} menit lalu`
  return `${Math.floor(elapsed / 3_600_000)} jam lalu`
}

export function boardRefreshLabel(input: {
  updatedAt: number
  now: number
  fetching: boolean
  failed: boolean
}): string {
  if (input.updatedAt <= 0) return 'Data belum dimuat'
  const clock = `Data dimuat pukul ${formatLocalClock(input.updatedAt)}`
  if (input.fetching) return `${clock} · memperbarui…`
  if (input.failed) return `${clock} · gagal memperbarui, menampilkan data terakhir`
  return `${clock} · ${formatAge(input.updatedAt, input.now)} · diperbarui otomatis setiap 30 detik`
}

export function routeTitle(route: Route | null): string {
  if (!route) return 'Rute tidak diketahui'
  if (route.shortName && route.longName) return `${route.shortName} · ${route.longName}`
  return route.shortName || route.longName || route.id
}

export function routeShort(route: Route): string {
  return route.shortName || route.longName || route.id
}

export function tripTitle(trip: Trip, routeName?: string | null): string {
  const name = trip.headsign || trip.name || trip.id
  return routeName ? `${routeName} · ${name}` : name
}

export function directionLabel(
  directionId: number | null,
  route: Route | null,
): string | null {
  if (directionId == null || !route) return null
  return route.directionNames[directionId] ?? null
}

export function formatCoordinate(value: number | null): string {
  if (value == null) return '—'
  return value.toFixed(5)
}
