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
    <div className="border-b border-line py-2">
      <dt className="text-xs font-bold text-muted">{label}</dt>
      <dd className="text-sm text-navy">{value}</dd>
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
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex items-center gap-4">
            {vehicle?.route ? <RouteMark route={vehicle.route} /> : null}
            <h2
              id="vehicle-dialog-title"
              className="text-[1.75rem] font-bold leading-none text-navy"
            >
              {vehicle?.label ?? 'Kendaraan'}
            </h2>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-navy px-3 py-2 text-sm text-white"
            onClick={props.onClose}
          >
            Tutup
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">
          {props.loading ? <p>Memuat detail kendaraan…</p> : null}
          {props.error ? (
            <div role="alert" className="flex flex-col items-start gap-3">
              <p>Gagal memuat detail kendaraan. Periksa koneksi, lalu coba lagi.</p>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-navy px-3 py-2 text-sm text-white"
                onClick={props.onRetry}
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          {vehicle ? (
            <>
              <div className="mb-3">
                <StatusChip status={vehicle.status} />
              </div>
              <dl>
                <Field label="Label" value={vehicle.label} />
                <Field label="ID kendaraan" value={vehicle.id} />
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
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-navy">Posisi di peta</p>
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
              </div>
            </>
          ) : null}
        </div>
      </div>
    </dialog>
  )
}
