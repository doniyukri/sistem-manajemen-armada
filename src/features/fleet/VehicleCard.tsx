import { formatBoston, formatCoordinate } from '../../domain/labels.ts'
import type { Vehicle } from '../../domain/types.ts'
import { RouteMark } from '../../components/RouteMark.tsx'
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
          <h2 className="text-4xl font-bold leading-none text-navy">{vehicle.label}</h2>
          {vehicle.route ? <RouteMark route={vehicle.route} /> : null}
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
