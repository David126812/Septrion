import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MapPin, FolderPlus, Link2, XCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import BottomNav from '@/components/layout/BottomNav'

interface Signalement {
  id: string
  name: string
  urgency: string
  location: string | null
  summary: string | null
  next_step: string | null
  document_url: string | null
  status: string
  created_at: string
  dossier_id: string | null
}

interface Dossier {
  id: string
  name: string
  status: string
}

const URGENCY_BADGE: Record<string, string> = {
  normal: 'bg-green-100 text-green-700',
  urgent: 'bg-amber-100 text-amber-700',
  critique: 'bg-red-100 text-red-700',
}

const Signalements = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [signalements, setSignalements] = useState<Signalement[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Signalement | null>(null)
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [showAttach, setShowAttach] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchSignalements = async () => {
    if (!profile?.copro_id) return
    const { data } = await supabase
      .from('signalements')
      .select('*')
      .eq('copro_id', profile.copro_id)
      .eq('status', 'nouveau')
      .order('created_at', { ascending: false })
    setSignalements(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchSignalements()
  }, [profile?.copro_id])

  // Realtime subscription
  useEffect(() => {
    if (!profile?.copro_id) return

    const channel = supabase
      .channel('signalements-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signalements',
          filter: `copro_id=eq.${profile.copro_id}`,
        },
        (payload) => {
          setSignalements((prev) => [payload.new as Signalement, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.copro_id])

  const handleCreateDossier = async () => {
    if (!selected || !profile?.copro_id) return
    setActionLoading(true)

    try {
      // Create dossier
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .insert({
          copro_id: profile.copro_id,
          name: selected.name,
          urgency: selected.urgency,
          status: 'en_cours',
          description: selected.summary,
          next_step: selected.next_step,
          last_action: 'Dossier créé depuis signalement',
          timeline: [{ label: 'Dossier créé', date: new Date().toISOString(), done: true }],
        })
        .select('id')
        .single()

      if (dossierError || !dossier) throw dossierError

      // Update signalement
      await supabase
        .from('signalements')
        .update({ status: 'qualifie', dossier_id: dossier.id })
        .eq('id', selected.id)

      setSignalements((prev) => prev.filter((s) => s.id !== selected.id))
      setSelected(null)
      toast.success('Dossier créé avec succès.')
    } catch {
      toast.error('Erreur lors de la création du dossier.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAttachToDossier = async (dossierId: string) => {
    if (!selected) return
    setActionLoading(true)

    try {
      // Update signalement
      await supabase
        .from('signalements')
        .update({ status: 'qualifie', dossier_id: dossierId })
        .eq('id', selected.id)

      // Add timeline event to dossier
      const { data: dossier } = await supabase
        .from('dossiers')
        .select('timeline')
        .eq('id', dossierId)
        .single()

      const timeline = [...(dossier?.timeline || []), {
        label: `Signalement "${selected.name}" rattaché`,
        date: new Date().toISOString(),
        done: true,
      }]

      await supabase
        .from('dossiers')
        .update({
          timeline,
          last_action: `Signalement "${selected.name}" rattaché`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dossierId)

      // Trigger AI summary regeneration
      try {
        await supabase.functions.invoke('analyze-document', {
          body: { text: `Régénère le résumé pour le dossier ${dossierId}` },
        })
      } catch {
        // Non-blocking — summary regeneration is best-effort
      }

      setSignalements((prev) => prev.filter((s) => s.id !== selected.id))
      setSelected(null)
      setShowAttach(false)
      toast.success('Signalement rattaché au dossier.')
    } catch {
      toast.error('Erreur lors du rattachement.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selected) return
    setActionLoading(true)

    try {
      await supabase
        .from('signalements')
        .update({ status: 'rejete' })
        .eq('id', selected.id)

      setSignalements((prev) => prev.filter((s) => s.id !== selected.id))
      setSelected(null)
      toast.success('Signalement rejeté.')
    } catch {
      toast.error('Erreur lors du rejet.')
    } finally {
      setActionLoading(false)
    }
  }

  const openAttachDialog = async () => {
    if (!profile?.copro_id) return
    const { data } = await supabase
      .from('dossiers')
      .select('id, name, status')
      .eq('copro_id', profile.copro_id)
      .neq('status', 'termine')
      .order('updated_at', { ascending: false })
    setDossiers(data || [])
    setShowAttach(true)
  }

  const nouveauCount = signalements.length

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          Signalements
          {nouveauCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">({nouveauCount})</span>
          )}
        </h1>
      </div>

      <div className="px-4 py-3 max-w-lg mx-auto space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : signalements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun signalement en attente.</p>
          </div>
        ) : (
          signalements.map((s) => (
            <Card
              key={s.id}
              className="p-4 cursor-pointer active:bg-muted/50 transition-colors"
              onClick={() => setSelected(s)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm leading-tight">{s.name}</h3>
                <Badge className={cn('shrink-0 text-xs', URGENCY_BADGE[s.urgency] || URGENCY_BADGE.normal)}>
                  {s.urgency}
                </Badge>
              </div>
              {s.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin className="size-3" />
                  {s.location}
                </div>
              )}
              {s.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2">{s.summary}</p>
              )}
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                {formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: fr })}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* Signalement detail dialog */}
      <Dialog open={!!selected && !showAttach} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <DialogContent className="max-w-sm mx-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selected.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs', URGENCY_BADGE[selected.urgency])}>
                    {selected.urgency}
                  </Badge>
                  {selected.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" /> {selected.location}
                    </span>
                  )}
                </div>

                {selected.summary && (
                  <p className="text-sm text-foreground leading-relaxed">{selected.summary}</p>
                )}

                {selected.document_url && (
                  <a
                    href={selected.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    Voir le document
                  </a>
                )}

                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full h-11"
                    onClick={handleCreateDossier}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <FolderPlus className="size-4 mr-2" />}
                    Créer un dossier
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11"
                    onClick={openAttachDialog}
                    disabled={actionLoading}
                  >
                    <Link2 className="size-4 mr-2" />
                    Rattacher à un dossier
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-11 text-destructive"
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    <XCircle className="size-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Attach to dossier dialog */}
      <Dialog open={showAttach} onOpenChange={setShowAttach}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Rattacher à un dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2 max-h-[50vh] overflow-y-auto">
            {dossiers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucun dossier actif.</p>
            ) : (
              dossiers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleAttachToDossier(d.id)}
                  disabled={actionLoading}
                  className="w-full text-left p-3 rounded-lg border border-border transition-colors active:bg-muted flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{d.name}</span>
                  {actionLoading ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <CheckCircle2 className="size-4 text-muted-foreground/40" />
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav signalementCount={nouveauCount} />
    </div>
  )
}

export default Signalements
