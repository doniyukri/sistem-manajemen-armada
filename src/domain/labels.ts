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
