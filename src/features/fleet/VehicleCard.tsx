import { formatBoston, formatCoordinate, routeTitle } from '../../domain/labels.ts'
import type { Vehicle } from '../../domain/types.ts'
import { StatusChip } from '../../components/StatusChip.tsx'

export function VehicleCard({
  vehicle,
  onOpen,
}: {
  vehicle: Vehicle
  onOpen: (id: string, opener: HTMLElement) => void
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="h-1 bg-bar" />
      <button
        type="button"
        className="flex h-full flex-col gap-3 px-4 py-4 text-left cursor-pointer"
        onClick={(event) => onOpen(vehicle.id, event.currentTarget)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-muted uppercase">
              Kendaraan
            </p>
            <h2 className="text-2xl font-bold text-navy">{vehicle.label}</h2>
          </div>
          {vehicle.route ? (
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: vehicle.route.color,
                color: vehicle.route.textColor,
              }}
              title={routeTitle(vehicle.route)}
            >
              {(
                vehicle.route.shortName ||
                vehicle.route.longName ||
                vehicle.route.id
              ).slice(0, 3)}
            </span>
          ) : null}
        </div>
        <StatusChip status={vehicle.status} />
        <p className="text-sm text-navy">
          {formatCoordinate(vehicle.latitude)}, {formatCoordinate(vehicle.longitude)}
        </p>
        <p className="mt-auto text-sm text-muted">
          Diperbarui {formatBoston(vehicle.updatedAt)} waktu Boston
        </p>
      </button>
    </article>
  )
}
