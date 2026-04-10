import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { identifyUser } from '@/lib/posthog'
import type { User, Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  first_name: string
  copro_id: string | null
  whatsapp_phone: string
  email: string | null
  notification_consent: boolean
  onboarding_completed: boolean
}

export interface Copro {
  id: string
  name: string
  lots_count: number | null
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  copro: Copro | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function fetchProfileData(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  let copro: Copro | null = null
  if (profile?.copro_id) {
    const { data } = await supabase
      .from('coproprietes')
      .select('*')
      .eq('id', profile.copro_id)
      .single()
    copro = data
  }

  return { profile, copro }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'signOut' | 'refreshProfile'>>({
    user: null,
    session: null,
    profile: null,
    copro: null,
    loading: true,
  })

  const refreshProfile = useCallback(async () => {
    const currentUser = state.user
    if (!currentUser) {
      // Try getting session directly if state not yet updated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { profile, copro } = await fetchProfileData(session.user.id)
      setState(prev => ({ ...prev, user: session.user, session, profile, copro }))
      return
    }
    const { profile, copro } = await fetchProfileData(currentUser.id)
    setState(prev => ({ ...prev, profile, copro }))
  }, [state.user])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { profile, copro } = await fetchProfileData(session.user.id)
        if (profile) identifyUser(session.user.id, copro?.name)
        setState({ user: session.user, session, profile, copro, loading: false })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { profile, copro } = await fetchProfileData(session.user.id)
          setState({ user: session.user, session, profile, copro, loading: false })
        } else {
          setState({ user: null, session: null, profile: null, copro: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
