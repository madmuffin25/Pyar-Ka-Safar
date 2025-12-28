import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Pages />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App 