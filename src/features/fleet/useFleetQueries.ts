import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getRoutes, getTrips, getVehicle, getVehicles } from '../../api/mbta.ts'
import { exactTotal } from '../../domain/rules.ts'
import { OPTION_PAGE_SIZE, REFRESH_MS, VEHICLE_POLL_MS } from '../../domain/types.ts'

function sorted(ids: readonly string[]): string[] {
  return [...ids].sort()
}

export function useVehiclePage(input: {
  routeIds: readonly string[]
  tripIds: readonly string[]
  page: number
  pageSize: number
}) {
  const routeIds = sorted(input.routeIds)
  const tripIds = sorted(input.tripIds)
  return useQuery({
    queryKey: [
      'vehicles',
      { routeIds, tripIds, page: input.page, pageSize: input.pageSize },
    ],
    queryFn: () =>
      getVehicles({
        offset: (input.page - 1) * input.pageSize,
        limit: input.pageSize,
        routeIds,
        tripIds,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  })
}

export function useVehicleTotal(input: {
  routeIds: readonly string[]
  tripIds: readonly string[]
  pageSize: number
  offset: number
  countOnPage: number
  lastOffset: number | null
  ready: boolean
}) {
  const routeIds = sorted(input.routeIds)
  const tripIds = sorted(input.tripIds)
  const needsLastPage =
    input.ready && input.lastOffset != null && input.lastOffset !== input.offset

  const lastPage = useQuery({
    queryKey: [
      'vehicles-last',
      { routeIds, tripIds, pageSize: input.pageSize, lastOffset: input.lastOffset },
    ],
    enabled: needsLastPage,
    queryFn: () =>
      getVehicles({
        offset: input.lastOffset ?? 0,
        limit: input.pageSize,
        routeIds,
        tripIds,
      }),
    refetchInterval: REFRESH_MS,
  })

  const total = input.ready
    ? exactTotal({
        offset: input.offset,
        countOnPage: input.countOnPage,
        lastOffset: input.lastOffset,
        countOnLastPage: needsLastPage ? (lastPage.data?.vehicles.length ?? null) : null,
      })
    : null

  return {
    total,
    isLoading: needsLastPage && lastPage.isPending,
    isError: needsLastPage && lastPage.isError,
    refetch: lastPage.refetch,
  }
}

export function useRouteOptions() {
  return useInfiniteQuery({
    queryKey: ['routes', OPTION_PAGE_SIZE],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getRoutes(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })
}

export function useTripOptions(routeIds: readonly string[]) {
  const sortedRouteIds = sorted(routeIds)
  return useInfiniteQuery({
    queryKey: ['trips', sortedRouteIds, OPTION_PAGE_SIZE],
    enabled: sortedRouteIds.length > 0,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getTrips(sortedRouteIds, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })
}

export function useVehicleDetail(id: string | null) {
  return useQuery({
    queryKey: ['vehicle', id],
    enabled: id != null,
    queryFn: () => getVehicle(id ?? ''),
    refetchInterval: id != null ? VEHICLE_POLL_MS : false,
  })
}
