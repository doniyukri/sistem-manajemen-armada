import { describe, expect, it } from 'vitest'
import {
  buildVehicleSearchParams,
  exactTotal,
  fresherVehicle,
  parsePageOffset,
  pruneTrips,
} from './rules.ts'
import type { Vehicle } from './types.ts'

describe('buildVehicleSearchParams', () => {
  it('asks for one vehicle page and its route, trip, and stop', () => {
    const params = buildVehicleSearchParams({
      offset: 20,
      limit: 10,
      routeIds: ['Red', '1'],
      tripIds: ['78182069'],
    })

    expect(params.get('page[offset]')).toBe('20')
    expect(params.get('page[limit]')).toBe('10')
    expect(params.get('include')).toBe('route,trip,stop')
    expect(params.get('filter[route]')).toBe('Red,1')
    expect(params.get('filter[trip]')).toBe('78182069')
  })

  it('omits filters when nothing is selected', () => {
    const params = buildVehicleSearchParams({
      offset: 0,
      limit: 10,
      routeIds: [],
      tripIds: [],
    })

    expect(params.get('filter[route]')).toBeNull()
    expect(params.get('filter[trip]')).toBeNull()
  })
})

describe('parsePageOffset', () => {
  it('reads the offset from a last-page link', () => {
    expect(
      parsePageOffset('https://api-v3.mbta.com/vehicles?page[limit]=10&page[offset]=540'),
    ).toBe(540)
  })

  it('returns null when the link has no offset', () => {
    expect(parsePageOffset(null)).toBeNull()
    expect(parsePageOffset('https://api-v3.mbta.com/vehicles')).toBeNull()
  })
})

describe('exactTotal', () => {
  it('is zero when the first page is empty', () => {
    expect(
      exactTotal({ offset: 0, countOnPage: 0, lastOffset: null, countOnLastPage: null }),
    ).toBe(0)
  })

  it('uses the current page when it is the last page', () => {
    expect(
      exactTotal({ offset: 20, countOnPage: 4, lastOffset: 20, countOnLastPage: null }),
    ).toBe(24)
  })

  it('waits for the last page before inventing a total', () => {
    expect(
      exactTotal({ offset: 0, countOnPage: 10, lastOffset: 540, countOnLastPage: null }),
    ).toBeNull()
  })

  it('adds the last page length to its offset', () => {
    expect(
      exactTotal({ offset: 0, countOnPage: 10, lastOffset: 540, countOnLastPage: 7 }),
    ).toBe(547)
  })
})

describe('pruneTrips', () => {
  it('drops a trip whose route was removed and keeps the rest', () => {
    const trips = [
      { id: 'trip-1', routeId: '1' },
      { id: 'trip-red', routeId: 'Red' },
    ]

    expect(pruneTrips(trips, ['Red'])).toEqual([{ id: 'trip-red', routeId: 'Red' }])
  })

  it('clears every trip when no route remains', () => {
    expect(pruneTrips([{ id: 'trip-1', routeId: '1' }], [])).toEqual([])
  })
})

function vehicle(id: string, updatedAt: string | null, shapeId: string | null): Vehicle {
  return {
    id,
    label: id,
    status: 'IN_TRANSIT_TO',
    latitude: 42,
    longitude: -71,
    updatedAt,
    directionId: null,
    bearing: null,
    occupancyStatus: null,
    route: null,
    trip: null,
    stop: null,
    shapeId,
    shape: shapeId
      ? [
          [-71, 42],
          [-71.1, 42.1],
        ]
      : null,
  }
}

describe('fresherVehicle', () => {
  it('keeps the newer detail, including its shape', () => {
    const listed = vehicle('y1', '2026-10-28T10:00:00Z', null)
    const detail = vehicle('y1', '2026-10-28T10:00:10Z', 'shape-1')

    expect(fresherVehicle(listed, detail)).toBe(detail)
  })

  it('keeps a newer list report and the shape the list does not have', () => {
    const listed = vehicle('y1', '2026-10-28T10:00:20Z', null)
    const detail = vehicle('y1', '2026-10-28T10:00:10Z', 'shape-1')
    const chosen = fresherVehicle(listed, detail)

    expect(chosen.updatedAt).toBe(listed.updatedAt)
    expect(chosen.shapeId).toBe('shape-1')
    expect(chosen.shape).toEqual(detail.shape)
  })
})
