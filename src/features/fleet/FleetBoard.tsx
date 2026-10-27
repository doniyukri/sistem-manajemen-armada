import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MultiSelect, type SelectOption } from '../../components/MultiSelect.tsx'
import { Pagination } from '../../components/Pagination.tsx'
import { boardRefreshLabel, routeShort, tripTitle } from '../../domain/labels.ts'
import { fresherVehicle, pruneTrips } from '../../domain/rules.ts'
import {
  REFRESH_MS,
  VEHICLE_POLL_MS,
  type PageSize,
  type SelectedTrip,
  type Vehicle,
} from '../../domain/types.ts'
import { VehicleCard } from './VehicleCard.tsx'
import { VehicleDialog } from './VehicleDialog.tsx'
import { useBoardState } from './useBoardState.ts'
import {
  useRouteOptions,
  useTripOptions,
  useVehicleDetail,
  useVehiclePage,
  useVehicleTotal,
} from './useFleetQueries.ts'

function flattenPages<T>(pages: { items: T[] }[] | undefined): T[] {
  return pages?.flatMap((page) => page.items) ?? []
}

export function FleetBoard() {
  const { state, commit } = useBoardState()
  const openerRef = useRef<HTMLElement | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const tripIds = state.trips.map((trip) => trip.id)

  const vehiclesQuery = useVehiclePage({
    routeIds: state.routeIds,
    tripIds,
    page: state.page,
    pageSize: state.pageSize,
  })
  const pageData = vehiclesQuery.data
  const showCurrentPage = pageData != null && !vehiclesQuery.isPlaceholderData
  const offset = (state.page - 1) * state.pageSize
  const totalQuery = useVehicleTotal({
    routeIds: state.routeIds,
    tripIds,
    pageSize: state.pageSize,
    offset,
    countOnPage: showCurrentPage ? pageData.vehicles.length : 0,
    lastOffset: showCurrentPage ? pageData.lastOffset : null,
    ready: showCurrentPage,
  })

  const routesQuery = useRouteOptions()
  const tripsQuery = useTripOptions(state.routeIds)
  const routes = useMemo(() => flattenPages(routesQuery.data?.pages), [routesQuery.data])
  const trips = useMemo(() => flattenPages(tripsQuery.data?.pages), [tripsQuery.data])
  const routeById = useMemo(
    () => new Map(routes.map((route) => [route.id, route])),
    [routes],
  )

  const detailQuery = useVehicleDetail(state.vehicleId)
  const knownVehicle =
    pageData?.vehicles.find((vehicle) => vehicle.id === state.vehicleId) ?? null
  const detailVehicle =
    knownVehicle && detailQuery.data
      ? fresherVehicle(knownVehicle, detailQuery.data)
      : (detailQuery.data ?? knownVehicle)

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setNow(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      const seen = Date.now()
      if (
        vehiclesQuery.dataUpdatedAt > 0 &&
        seen - vehiclesQuery.dataUpdatedAt >= REFRESH_MS
      ) {
        void vehiclesQuery.refetch()
        void totalQuery.refetch()
      }
      if (
        state.vehicleId &&
        detailQuery.dataUpdatedAt > 0 &&
        seen - detailQuery.dataUpdatedAt >= VEHICLE_POLL_MS
      ) {
        void detailQuery.refetch()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [detailQuery, state.vehicleId, totalQuery, vehiclesQuery])

  useEffect(() => {
    if (totalQuery.total == null || totalQuery.total === 0) return
    const pages = Math.ceil(totalQuery.total / state.pageSize)
    if (state.page > pages) {
      commit({ ...state, page: pages }, 'replace')
    }
  }, [totalQuery.total, state, commit])

  const loadMoreRoutes = useCallback(() => {
    if (routesQuery.hasNextPage && !routesQuery.isFetchingNextPage) {
      void routesQuery.fetchNextPage()
    }
  }, [routesQuery])

  const loadMoreTrips = useCallback(() => {
    if (tripsQuery.hasNextPage && !tripsQuery.isFetchingNextPage) {
      void tripsQuery.fetchNextPage()
    }
  }, [tripsQuery])

  function openVehicle(id: string, opener: HTMLElement) {
    openerRef.current = opener
    commit({ ...state, vehicleId: id }, 'push')
  }

  function closeVehicle() {
    const opener = openerRef.current
    commit({ ...state, vehicleId: null }, 'replace')
    // The dialog restores focus while it unmounts, after this function returns.
    window.setTimeout(() => {
      if (opener?.isConnected) opener.focus()
    }, 0)
  }

  const routeOptions: SelectOption[] = routes.map((route) => ({
    id: route.id,
    label: routeShort(route),
    description: route.longName || route.description,
    color: route.color,
    textColor: route.textColor,
  }))
  const tripOptions: SelectOption[] = trips.map((trip) => ({
    id: trip.id,
    label: tripTitle(trip, routeById.get(trip.routeId ?? '')?.shortName || trip.routeId),
    description: trip.headsign || trip.name,
  }))

  const listed = pageData?.vehicles ?? []
  const detail = detailQuery.data
  const vehicles =
    detail == null
      ? listed
      : listed.map((vehicle) =>
          vehicle.id === detail.id ? fresherVehicle(vehicle, detail) : vehicle,
        )
  const initialLoading = vehiclesQuery.isPending
  const refreshing = vehiclesQuery.isFetching && !initialLoading
  const boardError = vehiclesQuery.isError && vehicles.length === 0
  const refreshFailed = vehiclesQuery.isError && vehicles.length > 0

  function reload() {
    void vehiclesQuery.refetch()
    void totalQuery.refetch()
    if (state.vehicleId) void detailQuery.refetch()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          <p className="text-lg font-bold">Sistem Manajemen Armada</p>
          <p className="text-sm text-white/80">
            Posisi kendaraan langsung dari API MBTA.
          </p>
        </div>
      </header>
      <main className="flex-1 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Kendaraan</h1>
            <div className="mt-2 h-1 w-12 bg-bar" />
          </div>
          <section className="rounded-2xl bg-field p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <MultiSelect
                label="Rute"
                placeholder="Semua rute"
                options={routeOptions}
                selectedIds={state.routeIds}
                onChange={(routeIds) =>
                  commit(
                    {
                      ...state,
                      routeIds,
                      trips: pruneTrips(state.trips, routeIds),
                      page: 1,
                    },
                    'replace',
                  )
                }
                loading={routesQuery.isPending}
                error={routesQuery.isError}
                onRetry={() => void routesQuery.refetch()}
                hasMore={routesQuery.hasNextPage}
                loadingMore={routesQuery.isFetchingNextPage}
                onLoadMore={loadMoreRoutes}
                emptyLabel="Tidak ada rute."
                errorLabel="Gagal memuat rute."
              />
              <MultiSelect
                label="Trip"
                placeholder="Semua trip pada rute terpilih"
                options={tripOptions}
                selectedIds={tripIds}
                disabled={state.routeIds.length === 0}
                disabledReason="Pilih rute terlebih dahulu."
                onChange={(ids) => {
                  const known = new Map<string, string>()
                  for (const trip of state.trips) known.set(trip.id, trip.routeId)
                  for (const trip of trips) {
                    if (trip.routeId) known.set(trip.id, trip.routeId)
                  }
                  const next: SelectedTrip[] = []
                  for (const id of ids) {
                    const routeId = known.get(id)
                    if (routeId) next.push({ id, routeId })
                  }
                  commit({ ...state, trips: next, page: 1 }, 'replace')
                }}
                loading={state.routeIds.length > 0 && tripsQuery.isPending}
                error={tripsQuery.isError}
                onRetry={() => void tripsQuery.refetch()}
                hasMore={tripsQuery.hasNextPage}
                loadingMore={tripsQuery.isFetchingNextPage}
                onLoadMore={loadMoreTrips}
                emptyLabel="Tidak ada trip untuk rute ini."
                errorLabel="Gagal memuat trip."
              />
            </div>
          </section>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {boardRefreshLabel({
                updatedAt: vehiclesQuery.dataUpdatedAt,
                now,
                fetching: refreshing,
                failed: refreshFailed,
              })}
            </p>
            <button
              type="button"
              className="cursor-pointer rounded bg-blue px-3 py-2 text-sm text-white disabled:bg-line disabled:text-muted"
              onClick={reload}
              disabled={vehiclesQuery.isFetching}
            >
              {refreshing ? 'Memuat…' : 'Muat ulang'}
            </button>
          </div>

          {initialLoading ? (
            <p role="status" className="text-navy">
              Memuat kendaraan…
            </p>
          ) : null}
          {boardError ? (
            <div role="alert" className="rounded-2xl border border-line bg-field p-4">
              <p>Gagal memuat kendaraan. Periksa koneksi, lalu coba lagi.</p>
              <button
                type="button"
                className="mt-3 cursor-pointer rounded bg-bar px-3 py-2 text-sm text-white"
                onClick={reload}
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          {!initialLoading && !boardError && vehicles.length === 0 ? (
            <p className="rounded-2xl border border-line bg-field p-4">
              Tidak ada kendaraan untuk filter ini.
            </p>
          ) : null}
          {vehicles.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle: Vehicle) => (
                <li key={vehicle.id}>
                  <VehicleCard vehicle={vehicle} onOpen={openVehicle} />
                </li>
              ))}
            </ul>
          ) : null}

          {!boardError ? (
            <Pagination
              page={state.page}
              pageSize={state.pageSize}
              offset={offset}
              countOnPage={showCurrentPage ? vehicles.length : 0}
              total={totalQuery.total}
              totalLoading={totalQuery.isLoading}
              totalError={totalQuery.isError}
              onRetryTotal={() => void totalQuery.refetch()}
              hasNext={showCurrentPage && pageData.nextOffset != null}
              onPageChange={(page) => commit({ ...state, page }, 'push')}
              onPageSizeChange={(pageSize: PageSize) =>
                commit({ ...state, pageSize, page: 1 }, 'replace')
              }
            />
          ) : null}
        </div>
      </main>
      <footer className="bg-blue text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-sm sm:px-6 sm:flex-row sm:justify-between">
          <p>Doni Prima Yukri · Sistem Manajemen Armada</p>
          <p className="text-white/80">Data posisi dari MBTA</p>
        </div>
      </footer>
      {state.vehicleId ? (
        <VehicleDialog
          vehicle={detailVehicle}
          loading={detailQuery.isPending && detailVehicle == null}
          error={detailQuery.isError && detailVehicle == null}
          onRetry={() => void detailQuery.refetch()}
          onClose={closeVehicle}
        />
      ) : null}
    </div>
  )
}
