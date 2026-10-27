import { describe, expect, it } from 'vitest'
import { mapOneVehicle } from './mapResource.ts'
import {
  decodePolyline,
  glideDuration,
  measureTrack,
  pointAlong,
  smoothstep,
  snapToTrack,
} from './polyline.ts'

describe('decodePolyline', () => {
  it('decodes the standard Google sample into longitude, latitude', () => {
    const points = decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@')

    expect(points).toHaveLength(3)
    expect(points[0]?.[0]).toBeCloseTo(-120.2, 4)
    expect(points[0]?.[1]).toBeCloseTo(38.5, 4)
    expect(points[1]?.[0]).toBeCloseTo(-120.95, 4)
    expect(points[1]?.[1]).toBeCloseTo(40.7, 4)
    expect(points[2]?.[0]).toBeCloseTo(-126.453, 3)
    expect(points[2]?.[1]).toBeCloseTo(43.252, 3)
  })

  it('returns no points for an empty string', () => {
    expect(decodePolyline('')).toEqual([])
  })
})

describe('mapOneVehicle shape', () => {
  it('reads the trip shape polyline onto the vehicle', () => {
    const vehicle = mapOneVehicle({
      data: {
        id: 'v1',
        type: 'vehicle',
        attributes: {
          latitude: 42,
          longitude: -71,
          label: '1',
          current_status: 'IN_TRANSIT_TO',
        },
        relationships: { trip: { data: { id: 't1', type: 'trip' } } },
      },
      included: [
        {
          id: 't1',
          type: 'trip',
          attributes: { headsign: 'Nubian' },
          relationships: {
            shape: { data: { id: 's1', type: 'shape' } },
            route: { data: { id: '1', type: 'route' } },
          },
        },
        {
          id: 's1',
          type: 'shape',
          attributes: { polyline: '_p~iF~ps|U_ulLnnqC_mqNvxq`@' },
        },
      ],
    })

    expect(vehicle.shapeId).toBe('s1')
    expect(vehicle.shape).toHaveLength(3)
  })
})

describe('track geometry', () => {
  const track = measureTrack([
    [0, 0],
    [0, 1],
  ])

  it('snaps a midpoint back onto the segment', () => {
    if (!track) throw new Error('track missing')
    const snapped = snapToTrack(track, 0, 0.5)
    const point = pointAlong(track, snapped.distance)

    expect(point.longitude).toBeCloseTo(0, 4)
    expect(point.latitude).toBeCloseTo(0.5, 3)
    expect(point.bearing).toBeCloseTo(0, 5)
  })

  it('keeps a later fix on its own segment', () => {
    const longer = measureTrack([
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ])
    if (!longer) throw new Error('track missing')
    const start = longer.cumulative[2] ?? 0
    const end = longer.cumulative[3] ?? 0
    const point = pointAlong(longer, start + (end - start) / 2)

    expect(point.longitude).toBeCloseTo(1, 3)
    expect(point.latitude).toBeCloseTo(1.5, 3)
  })

  it('glides across the gap between reports and holds a pin that barely moved', () => {
    expect(glideDuration(10_000, true, 180)).toBe(10_000)
    expect(glideDuration(30_000, true, 180)).toBe(12_000)
    expect(glideDuration(10_000, true, 3)).toBe(0)
    expect(glideDuration(10_000, false, 40)).toBe(700)
  })

  it('eases in and out without leaving the unit interval', () => {
    expect(smoothstep(0)).toBe(0)
    expect(smoothstep(1)).toBe(1)
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 5)
  })
})
