import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { identifyUser } from '@/lib/posthog'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  first_name: string
  copro_id: string | null
  whatsapp_phone: string
  email: string | null
  notification_consent: boolean
  onboarding_completed: boolean
}

interface Copro {
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
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    copro: null,
    loading: true,
  })

  const fetchProfile = useCallback(async (userId: string) => {
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
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!state.user) return
    const { profile, copro } = await fetchProfile(state.user.id)
    setState(prev => ({ ...prev, profile, copro }))
  }, [state.user, fetchProfile])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { profile, copro } = await fetchProfile(session.user.id)
        if (profile) identifyUser(session.user.id, copro?.name)
        setState({ user: session.user, session, profile, copro, loading: false })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { profile, copro } = await fetchProfile(session.user.id)
          setState({ user: session.user, session, profile, copro, loading: false })
        } else {
          setState({ user: null, session: null, profile: null, copro: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { ...state, signOut, refreshProfile }
}
