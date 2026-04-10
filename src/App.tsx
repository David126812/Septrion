import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/hooks/useAuth'
import AuthGuard from '@/components/auth/AuthGuard'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import SignalerIncident from '@/pages/SignalerIncident'
import Signalements from '@/pages/Signalements'
import DossiersList from '@/pages/DossiersList'
import DossierDetail from '@/pages/DossierDetail'
import Dashboard from '@/pages/Dashboard'
import Settings from '@/pages/Settings'
import AssistantIA from '@/pages/AssistantIA'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/dossiers" element={<AuthGuard><DossiersList /></AuthGuard>} />
          <Route path="/dossiers/:id" element={<AuthGuard><DossierDetail /></AuthGuard>} />
          <Route path="/signalements" element={<AuthGuard><Signalements /></AuthGuard>} />
          <Route path="/signaler-incident" element={<AuthGuard><SignalerIncident /></AuthGuard>} />
          <Route path="/assistant" element={<AuthGuard><AssistantIA /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  )
}

export default App
