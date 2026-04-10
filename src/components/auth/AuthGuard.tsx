import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default AuthGuard
