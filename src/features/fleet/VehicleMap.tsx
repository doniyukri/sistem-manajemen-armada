import maplibregl, { type GeoJSONSource } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  glideDuration,
  heading,
  measureTrack,
  pointAlong,
  smoothstep,
  snapToTrack,
  type Track,
} from '../../domain/polyline.ts'
import { VEHICLE_POLL_MS, type LngLat } from '../../domain/types.ts'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const EMPTY_LINE = { type: 'FeatureCollection' as const, features: [] }

type TrackMotion = {
  kind: 'track'
  from: number
  to: number
  start: number
  duration: number
}

type FreeMotion = {
  kind: 'free'
  fromLng: number
  fromLat: number
  toLng: number
  toLat: number
  start: number
  duration: number
}

type Fix = {
  latitude: number
  longitude: number
  bearing: number | null
  moving: boolean
  updatedAt: string | null
  label: string
  color: string
  shapeId: string | null
  shape: LngLat[] | null
}

function createPin(): HTMLDivElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 28 28')
  svg.setAttribute('width', '28')
  svg.setAttribute('height', '28')
  svg.style.display = 'block'
  svg.setAttribute('aria-hidden', 'true')
  const nose = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  nose.setAttribute('d', 'M14 2 L19 12 L9 12 Z')
  nose.setAttribute('stroke', '#ffffff')
  nose.setAttribute('stroke-width', '1.5')
  nose.setAttribute('stroke-linejoin', 'round')
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  body.setAttribute('cx', '14')
  body.setAttribute('cy', '14')
  body.setAttribute('r', '6')
  body.setAttribute('stroke', '#ffffff')
  body.setAttribute('stroke-width', '2')
  svg.append(nose, body)
  const holder = document.createElement('div')
  holder.append(svg)
  return holder
}

function paintPin(holder: HTMLElement, color: string) {
  const svg = holder.firstElementChild
  if (!svg) return
  for (const node of svg.children) node.setAttribute('fill', color)
}

function lineFeature(shape: readonly LngLat[]) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: shape.map((point) => [point[0], point[1]]),
    },
  }
}

function distanceNow(motion: TrackMotion, now: number): number {
  const amount =
    motion.duration <= 0 ? 1 : smoothstep((now - motion.start) / motion.duration)
  return motion.from + (motion.to - motion.from) * amount
}

function reportGap(previous: string | null, next: string | null): number {
  const from = Date.parse(previous ?? '')
  const to = Date.parse(next ?? '')
  if (Number.isNaN(from) || Number.isNaN(to)) return VEHICLE_POLL_MS
  return to - from
}

export function VehicleMap(props: Fix) {
  const containerRef = useRef<HTMLDivElement>(null)
  const recenterRef = useRef(true)
  const latest = useRef(props)
  const [following, setFollowing] = useState(true)

  useEffect(() => {
    latest.current = props
  }, [props])

  const routeNamed =
    props.shape != null && props.shape.length > 1
      ? `Peta posisi kendaraan ${props.label} beserta rute perjalanan`
      : `Peta posisi kendaraan ${props.label}`

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      center: [latest.current.longitude, latest.current.latitude],
      zoom: 15,
      attributionControl: {},
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    const pin = createPin()
    const marker = new maplibregl.Marker({ element: pin, rotationAlignment: 'map' })
    let frame = 0
    let removed = false
    let track: Track | null = null
    let trackKey = ''
    let fixKey = ''
    let seenAt: string | null = null
    let motion: TrackMotion | FreeMotion | null = null

    const sample = (now: number) => {
      const current = latest.current
      if (motion?.kind === 'track' && track) {
        const distance = distanceNow(motion, now)
        const point = pointAlong(track, distance)
        const amount =
          motion.duration <= 0 ? 1 : smoothstep((now - motion.start) / motion.duration)
        const traveling = Math.abs(motion.to - motion.from) >= 12 && amount < 1
        const forward = motion.to >= motion.from
        const along = forward ? point.bearing : (point.bearing + 180) % 360
        return {
          longitude: point.longitude,
          latitude: point.latitude,
          bearing: traveling ? along : (current.bearing ?? along),
        }
      }
      if (motion?.kind === 'free') {
        const amount =
          motion.duration <= 0 ? 1 : smoothstep((now - motion.start) / motion.duration)
        return {
          longitude: motion.fromLng + (motion.toLng - motion.fromLng) * amount,
          latitude: motion.fromLat + (motion.toLat - motion.fromLat) * amount,
          bearing:
            current.bearing ??
            heading([motion.fromLng, motion.fromLat], [motion.toLng, motion.toLat]),
        }
      }
      return {
        longitude: current.longitude,
        latitude: current.latitude,
        bearing: current.bearing ?? 0,
      }
    }

    const applyShape = () => {
      const source = map.getSource('route')
      if (!source) return
      const current = latest.current
      const key = `${current.shapeId ?? ''}:${current.shape?.length ?? 0}`
      if (key === trackKey) return
      trackKey = key
      const shape = current.shape
      const line = source as GeoJSONSource
      if (shape && shape.length > 1) {
        line.setData(lineFeature(shape))
        track = measureTrack(shape)
      } else {
        line.setData(EMPTY_LINE)
        track = null
      }
      motion = null
      fixKey = ''
      seenAt = null
    }

    const consumeFix = (now: number) => {
      const current = latest.current
      const key = `${current.longitude},${current.latitude},${current.updatedAt ?? ''}`
      if (key === fixKey) return
      const previous = motion
      const placeNow = fixKey === '' || previous == null
      fixKey = key
      if (track) {
        const snapped = snapToTrack(track, current.longitude, current.latitude)
        const from =
          !placeNow && previous?.kind === 'track'
            ? distanceNow(previous, now)
            : snapped.distance
        motion = {
          kind: 'track',
          from,
          to: snapped.distance,
          start: now,
          duration: placeNow
            ? 0
            : glideDuration(
                reportGap(seenAt, current.updatedAt),
                current.moving,
                Math.abs(snapped.distance - from),
              ),
        }
        seenAt = current.updatedAt
        return
      }
      const here =
        previous?.kind === 'free'
          ? {
              longitude:
                previous.fromLng +
                (previous.toLng - previous.fromLng) *
                  (previous.duration <= 0
                    ? 1
                    : smoothstep((now - previous.start) / previous.duration)),
              latitude:
                previous.fromLat +
                (previous.toLat - previous.fromLat) *
                  (previous.duration <= 0
                    ? 1
                    : smoothstep((now - previous.start) / previous.duration)),
            }
          : { longitude: current.longitude, latitude: current.latitude }
      motion = {
        kind: 'free',
        fromLng: placeNow ? current.longitude : here.longitude,
        fromLat: placeNow ? current.latitude : here.latitude,
        toLng: current.longitude,
        toLat: current.latitude,
        start: now,
        duration: placeNow ? 0 : VEHICLE_POLL_MS,
      }
    }

    const loop = (now: number) => {
      if (removed) return
      if (map.isStyleLoaded() && map.getSource('route')) {
        applyShape()
        map.setPaintProperty('route-line', 'line-color', latest.current.color)
        consumeFix(now)
        const place = sample(now)
        marker.setLngLat([place.longitude, place.latitude])
        marker.setRotation(place.bearing)
        paintPin(pin, latest.current.color)
        if (recenterRef.current) {
          map.jumpTo({ center: [place.longitude, place.latitude], zoom: 15 })
          recenterRef.current = false
        }
      }
      frame = requestAnimationFrame(loop)
    }

    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: EMPTY_LINE })
      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 8, 'line-opacity': 0.95 },
      })
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': latest.current.color, 'line-width': 4.5 },
      })
      marker.setLngLat([latest.current.longitude, latest.current.latitude]).addTo(map)
      map.resize()
      frame = requestAnimationFrame(loop)
    })
    map.on('dragstart', () => {
      recenterRef.current = false
      setFollowing(false)
    })

    const observer = new ResizeObserver(() => map.resize())
    observer.observe(container)

    return () => {
      removed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      marker.remove()
      map.remove()
    }
  }, [])

  return (
    <section
      className="relative h-64 w-full overflow-hidden rounded-2xl border border-line"
      aria-label={routeNamed}
    >
      <div ref={containerRef} className="h-full w-full" />
      {following ? null : (
        <button
          type="button"
          className="absolute bottom-2 left-2 z-10 cursor-pointer rounded bg-navy px-2 py-1 text-xs text-white"
          onClick={() => {
            recenterRef.current = true
            setFollowing(true)
          }}
        >
          Ikuti kendaraan
        </button>
      )}
    </section>
  )
}
