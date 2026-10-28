import { statusLabel } from '../domain/labels.ts'

const TONE: Record<string, string> = {
  IN_TRANSIT_TO: 'bg-bar text-white',
  STOPPED_AT: 'bg-muted text-white',
  INCOMING_AT: 'bg-arrive text-white',
}

export function StatusChip({ status }: { status: string }) {
  const tone = TONE[status] ?? 'bg-navy text-white'
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs whitespace-nowrap ${tone}`}
    >
      <span className="font-bold">{statusLabel(status)}</span>
      <span className="font-normal opacity-80">{status}</span>
    </span>
  )
}
