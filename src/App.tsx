import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FleetBoard } from './features/fleet/FleetBoard.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FleetBoard />
    </QueryClientProvider>
  )
}
