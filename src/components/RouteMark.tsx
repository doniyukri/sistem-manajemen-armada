import { routeShort, routeTitle } from '../domain/labels.ts'
import type { Route } from '../domain/types.ts'

export function RouteMark({
  route,
  size = 'card',
}: {
  route: Route
  size?: 'card' | 'menu'
}) {
  const box = size === 'card' ? 'h-14 w-14 text-sm' : 'h-10 w-10 text-xs'
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold ${box}`}
      style={{ backgroundColor: route.color, color: route.textColor }}
      title={routeTitle(route)}
    >
      {routeShort(route).slice(0, 3)}
    </span>
  )
}
