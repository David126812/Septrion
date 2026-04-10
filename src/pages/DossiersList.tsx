import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import BottomNav from '@/components/layout/BottomNav'

interface Dossier {
  id: string
  name: string
  status: string
  urgency: string
  updated_at: string
}

const STATUS_BADGE: Record<string, string> = {
  en_cours: 'bg-blue-50 text-blue-700',
  bloque: 'bg-red-50 text-red-700',
  termine: 'bg-gray-100 text-gray-500',
}

const STATUS_LABEL: Record<string, string> = {
  en_cours: 'En cours',
  bloque: 'Bloqué',
  termine: 'Terminé',
}

const URGENCY_BADGE: Record<string, string> = {
  normal: 'bg-green-100 text-green-700',
  urgent: 'bg-amber-100 text-amber-700',
  critique: 'bg-red-100 text-red-700',
}

const DossiersList = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.copro_id) {
      setLoading(false)
      return
    }
    supabase
      .from('dossiers')
      .select('id, name, status, urgency, updated_at')
      .eq('copro_id', profile.copro_id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setDossiers(data || [])
        setLoading(false)
      })
  }, [profile?.copro_id])

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">Dossiers</h1>
      </div>

      <div className="px-4 py-3 max-w-lg mx-auto space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : dossiers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun dossier pour le moment.</p>
          </div>
        ) : (
          dossiers.map((d) => (
            <Card
              key={d.id}
              className={cn(
                'p-4 cursor-pointer active:bg-muted/50 transition-colors',
                d.status === 'termine' && 'opacity-60',
                d.status === 'bloque' && 'border-red-200'
              )}
              onClick={() => navigate(`/dossiers/${d.id}`)}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-semibold text-sm leading-tight">{d.name}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge className={cn('text-xs', URGENCY_BADGE[d.urgency] || URGENCY_BADGE.normal)}>
                    {d.urgency}
                  </Badge>
                  <Badge className={cn('text-xs', STATUS_BADGE[d.status] || STATUS_BADGE.en_cours)}>
                    {STATUS_LABEL[d.status] || d.status}
                  </Badge>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                Mis à jour {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
              </p>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default DossiersList
