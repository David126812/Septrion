import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import AuthGuard from '@/components/auth/AuthGuard'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import SignalerIncident from '@/pages/SignalerIncident'
import Signalements from '@/pages/Signalements'
import DossiersList from '@/pages/DossiersList'
import DossierDetail from '@/pages/DossierDetail'

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
          <Route path="/dossiers" element={<AuthGuard><DossiersList /></AuthGuard>} />
          <Route path="/dossiers/:id" element={<AuthGuard><DossierDetail /></AuthGuard>} />
          <Route path="/signalements" element={<AuthGuard><Signalements /></AuthGuard>} />
          <Route path="/signaler-incident" element={<AuthGuard><SignalerIncident /></AuthGuard>} />
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
