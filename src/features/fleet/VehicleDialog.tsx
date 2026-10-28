import { lazy, Suspense, useEffect, useRef } from 'react'
import {
  directionLabel,
  formatBoston,
  formatCoordinate,
  occupancyLabel,
  routeTitle,
  tripTitle,
} from '../../domain/labels.ts'
import type { Vehicle } from '../../domain/types.ts'
import { RouteMark } from '../../components/RouteMark.tsx'
import { StatusChip } from '../../components/StatusChip.tsx'

const VehicleMap = lazy(() =>
  import('./VehicleMap.tsx').then((module) => ({ default: module.VehicleMap })),
)

type Props = {
  vehicle: Vehicle | null
  loading: boolean
  error: boolean
  onRetry: () => void
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white px-4 py-2.5">
      <dt className="text-xs text-quiet">{label}</dt>
      <dd className="mt-1 text-sm leading-snug font-bold break-words text-navy">
        {value}
      </dd>
    </div>
  )
}

export function VehicleDialog(props: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closingRef = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (!dialog.open) return
      // close() clears `open` now, but the close event is delivered later.
      // The flag stays set until that event is handled. Resetting it here
      // lets Strict Mode's cleanup dismiss a dialog that was just opened.
      closingRef.current = true
      dialog.close()
    }
  }, [])

  const vehicle = props.vehicle
  const direction = vehicle ? directionLabel(vehicle.directionId, vehicle.route) : null
  const occupancy = vehicle ? occupancyLabel(vehicle.occupancyStatus) : null
  const canMap = vehicle?.latitude != null && vehicle.longitude != null

  return (
    <dialog
      ref={dialogRef}
      className="vehicle-dialog"
      aria-labelledby="vehicle-dialog-title"
      onClose={() => {
        if (closingRef.current) {
          closingRef.current = false
          return
        }
        props.onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) props.onClose()
      }}
    >
      <div className="flex max-h-[inherit] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex items-center gap-4">
            {vehicle?.route ? <RouteMark route={vehicle.route} /> : null}
            <h2
              id="vehicle-dialog-title"
              className="text-[1.75rem] font-bold leading-none text-navy"
            >
              {vehicle?.label ?? 'Armada'}
            </h2>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-quiet hover:bg-field hover:text-navy"
            aria-label="Tutup"
            onClick={props.onClose}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M4 4 L12 12 M12 4 L4 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">
          {props.loading ? <p>Memuat detail armada…</p> : null}
          {props.error ? (
            <div role="alert" className="flex flex-col items-start gap-3">
              <p>Gagal memuat detail armada. Periksa koneksi, lalu coba lagi.</p>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-navy px-3 py-2 text-sm text-white hover:bg-blue"
                onClick={props.onRetry}
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          {vehicle ? (
            <div className="flex flex-col gap-4">
              <div className="flex">
                <StatusChip status={vehicle.status} />
              </div>
              {canMap ? (
                <Suspense fallback={<p className="text-sm">Memuat peta…</p>}>
                  <VehicleMap
                    latitude={vehicle.latitude ?? 0}
                    longitude={vehicle.longitude ?? 0}
                    bearing={vehicle.bearing}
                    moving={vehicle.status === 'IN_TRANSIT_TO'}
                    updatedAt={vehicle.updatedAt}
                    label={vehicle.label}
                    color={vehicle.route?.color ?? '#174DA1'}
                    shapeId={vehicle.shapeId}
                    shape={vehicle.shape}
                  />
                </Suspense>
              ) : (
                <p className="text-sm text-muted">Koordinat tidak tersedia.</p>
              )}
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                <Field label="Label" value={vehicle.label} />
                <Field label="ID armada" value={vehicle.id} />
                <Field
                  label="Latitude dan longitude"
                  value={`${formatCoordinate(vehicle.latitude)}, ${formatCoordinate(vehicle.longitude)}`}
                />
                <Field
                  label="Waktu update terakhir"
                  value={`${formatBoston(vehicle.updatedAt)} waktu Boston`}
                />
                <Field
                  label="Rute"
                  value={
                    vehicle.route ? routeTitle(vehicle.route) : 'Tidak ada data rute'
                  }
                />
                <Field
                  label="Trip"
                  value={
                    vehicle.trip
                      ? tripTitle(
                          vehicle.trip,
                          vehicle.route?.shortName || vehicle.route?.id,
                        )
                      : 'Tidak ada data trip'
                  }
                />
                <Field
                  label="Perhentian saat ini"
                  value={vehicle.stop?.name ?? 'Tidak ada data perhentian'}
                />
                <Field label="Arah" value={direction ?? 'Tidak ada data arah'} />
                <Field
                  label="Okupansi"
                  value={
                    occupancy
                      ? `${occupancy} / ${vehicle.occupancyStatus}`
                      : 'Tidak ada data okupansi'
                  }
                />
                <Field
                  label="Arah kompas"
                  value={
                    vehicle.bearing == null
                      ? 'Tidak ada data'
                      : `${Math.round(vehicle.bearing)}°`
                  }
                />
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  )
}
