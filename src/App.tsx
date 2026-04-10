import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import AuthGuard from '@/components/auth/AuthGuard'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import PrivacyPolicy from '@/pages/PrivacyPolicy'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

// Placeholder pages — will be replaced in later epics
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-muted-foreground">{name} — à implémenter</p>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<AuthGuard><Placeholder name="Dashboard" /></AuthGuard>} />
          <Route path="/dossiers" element={<AuthGuard><Placeholder name="Dossiers" /></AuthGuard>} />
          <Route path="/dossiers/:id" element={<AuthGuard><Placeholder name="Dossier Detail" /></AuthGuard>} />
          <Route path="/signalements" element={<AuthGuard><Placeholder name="Signalements" /></AuthGuard>} />
          <Route path="/signaler-incident" element={<AuthGuard><Placeholder name="Signaler Incident" /></AuthGuard>} />
          <Route path="/assistant" element={<AuthGuard><Placeholder name="Assistant IA" /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Placeholder name="Settings" /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  )
}

export default App
