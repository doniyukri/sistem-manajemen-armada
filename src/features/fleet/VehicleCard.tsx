import { formatCoordinate, formatUpdatedAgo } from '../../domain/labels.ts'
import type { Vehicle } from '../../domain/types.ts'
import { RouteMark } from '../../components/RouteMark.tsx'
import { StatusChip } from '../../components/StatusChip.tsx'

export function VehicleCard({
  vehicle,
  now,
  onOpen,
}: {
  vehicle: Vehicle
  now: number
  onOpen: (id: string, opener: HTMLElement) => void
}) {
  return (
    <article className="fleet-card flex h-full flex-col rounded-lg bg-white shadow-lift">
      <button
        type="button"
        className="flex h-full w-full cursor-pointer flex-col items-start gap-3 px-4 py-4 text-left"
        onClick={(event) => onOpen(vehicle.id, event.currentTarget)}
      >
        <div className="flex w-full items-start justify-between gap-3">
          <h2 className="text-4xl font-bold leading-none text-navy">{vehicle.label}</h2>
          {vehicle.route ? <RouteMark route={vehicle.route} /> : null}
        </div>
        <StatusChip status={vehicle.status} />
        <p className="text-sm text-navy">
          {formatCoordinate(vehicle.latitude)}, {formatCoordinate(vehicle.longitude)}
        </p>
        <p className="mt-auto text-sm text-muted">
          {formatUpdatedAgo(vehicle.updatedAt, now)}
        </p>
      </button>
    </article>
  )
}
