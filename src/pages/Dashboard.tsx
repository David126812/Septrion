import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Mic, ChevronRight, AlertTriangle, FolderOpen, Inbox,
  Calendar, Plus, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import BottomNav from '@/components/layout/BottomNav'

interface DossierEvent {
  id: string
  name: string
  last_action: string | null
  status: string
  updated_at: string
}

const STATUS_BADGE: Record<string, string> = {
  en_cours: 'bg-blue-50 text-blue-700',
  bloque: 'bg-red-50 text-red-700',
  termine: 'bg-gray-100 text-gray-500',
}

const DUMMY_EVENTS = [
  { id: 'dummy-1', title: 'AG ordinaire', date: '15 mai 2026', time: '19h00' },
  { id: 'dummy-2', title: 'Passage du jardinier', date: '22 mai 2026', time: '09h00' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { profile, copro } = useAuth()
  const [recentDossiers, setRecentDossiers] = useState<DossierEvent[]>([])
  const [signalementCount, setSignalementCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.copro_id) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const [dossiersRes, sigCountRes] = await Promise.all([
        supabase
          .from('dossiers')
          .select('id, name, last_action, status, updated_at')
          .eq('copro_id', profile.copro_id)
          .order('updated_at', { ascending: false })
          .limit(4),
        supabase
          .from('signalements')
          .select('id', { count: 'exact', head: true })
          .eq('copro_id', profile.copro_id)
          .eq('status', 'nouveau'),
      ])

      setRecentDossiers(dossiersRes.data || [])
      setSignalementCount(sigCountRes.count || 0)
      setLoading(false)
    }

    fetchData()
  }, [profile?.copro_id])

  const initials = profile?.first_name
    ? profile.first_name.charAt(0).toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            {copro && (
              <p className="text-xs text-muted-foreground mb-0.5">
                Résidence {copro.name}
              </p>
            )}
            <h1 className="text-2xl font-bold text-foreground">
              Bonjour {profile?.first_name || ''}
            </h1>
          </div>
          <Avatar
            className="cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-4">
        {/* Hero — Assistant IA */}
        <Card
          className="p-5 bg-gradient-to-r from-blue-600 to-blue-500 border-0 cursor-pointer active:opacity-90 transition-opacity"
          onClick={() => navigate('/assistant')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Mic className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-base">Parler à l'assistant</p>
              <p className="text-white/70 text-xs">Posez une question sur vos dossiers</p>
            </div>
            <ChevronRight className="size-5 text-white/60 shrink-0" />
          </div>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <Card
            className="p-3 flex flex-col items-center gap-2 cursor-pointer active:bg-muted/50 transition-colors"
            onClick={() => navigate('/signaler-incident')}
          >
            <AlertTriangle className="size-5 text-amber-500" />
            <span className="text-xs font-medium text-center leading-tight">Signaler incident</span>
          </Card>
          <Card
            className="p-3 flex flex-col items-center gap-2 cursor-pointer active:bg-muted/50 transition-colors"
            onClick={() => navigate('/dossiers')}
          >
            <FolderOpen className="size-5 text-blue-500" />
            <span className="text-xs font-medium text-center leading-tight">Dossiers</span>
          </Card>
          <Card
            className="p-3 flex flex-col items-center gap-2 cursor-pointer active:bg-muted/50 transition-colors relative"
            onClick={() => navigate('/signalements')}
          >
            <div className="relative">
              <Inbox className="size-5 text-purple-500" />
              {signalementCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                  {signalementCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-center leading-tight">Signalements</span>
          </Card>
        </div>

        {/* Prochains événements (dummy) */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Prochains événements</h2>
          <div className="space-y-2">
            {DUMMY_EVENTS.map((event) => (
              <Card key={event.id} className="p-3 flex items-center gap-3 opacity-70">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} · {event.time}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">Exemple</Badge>
              </Card>
            ))}
            <button
              disabled
              className="w-full p-3 rounded-xl border border-dashed border-border flex items-center justify-center gap-2 text-sm text-muted-foreground opacity-50"
            >
              <Plus className="size-4" />
              Créer un événement
              <Badge variant="outline" className="text-[10px]">Prochainement</Badge>
            </button>
          </div>
        </div>

        {/* Activité récente */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Activité récente</h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : recentDossiers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Pas encore d'activité. Créez votre premier signalement !
            </p>
          ) : (
            <div className="space-y-2">
              {recentDossiers.map((d) => (
                <Card
                  key={d.id}
                  className={cn(
                    'p-3 flex items-center gap-3 cursor-pointer active:bg-muted/50 transition-colors',
                    d.status === 'termine' && 'opacity-60'
                  )}
                  onClick={() => navigate(`/dossiers/${d.id}`)}
                >
                  <Clock className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {d.last_action || 'Aucune action'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge className={cn('text-[10px]', STATUS_BADGE[d.status])}>
                      {d.status === 'en_cours' ? 'En cours' : d.status === 'bloque' ? 'Bloqué' : 'Terminé'}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground/60">
                      {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* AI mention */}
        <p className="text-[10px] text-muted-foreground/60 text-center pb-2">
          Les résumés de dossiers sont générés par IA (Claude par Anthropic).
        </p>
      </div>

      <BottomNav signalementCount={signalementCount} />
    </div>
  )
}

export default Dashboard
