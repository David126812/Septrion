import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  ArrowLeft, ChevronDown, Share2, CheckCircle2, Circle,
  FileText, Loader2, Sparkles, Send, Users, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import BottomNav from '@/components/layout/BottomNav'
import { trackDossierViewed } from '@/lib/posthog'

interface TimelineEvent {
  label: string
  date: string
  done: boolean
}

interface DossierData {
  id: string
  name: string
  status: string
  urgency: string
  description: string | null
  next_step: string | null
  last_action: string | null
  timeline: TimelineEvent[]
  blocage_reason: string | null
  created_at: string
  updated_at: string
}

interface SignalementDoc {
  id: string
  name: string
  document_url: string | null
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

const TRANSITIONS: Record<string, { label: string; value: string }[]> = {
  en_cours: [
    { label: 'Marquer bloqué', value: 'bloque' },
    { label: 'Marquer terminé', value: 'termine' },
  ],
  bloque: [
    { label: 'Reprendre (en cours)', value: 'en_cours' },
  ],
  termine: [
    { label: 'Réouvrir (en cours)', value: 'en_cours' },
  ],
}

const DossierDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [dossier, setDossier] = useState<DossierData | null>(null)
  const [documents, setDocuments] = useState<SignalementDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareTarget, setShareTarget] = useState<'residents' | 'cs'>('residents')
  const [shareMessage, setShareMessage] = useState('')
  const [shareSending, setShareSending] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchDossier = async () => {
      const { data } = await supabase
        .from('dossiers')
        .select('*')
        .eq('id', id)
        .single()
      setDossier(data)
      if (data) trackDossierViewed(data.id)

      // Fetch attached documents from signalements
      const { data: sigs } = await supabase
        .from('signalements')
        .select('id, name, document_url')
        .eq('dossier_id', id)
      setDocuments((sigs || []).filter((s: SignalementDoc) => s.document_url))

      setLoading(false)
    }
    fetchDossier()
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!dossier) return
    setStatusLoading(true)

    const timelineEvent: TimelineEvent = {
      label: `Statut changé : ${STATUS_LABEL[dossier.status]} → ${STATUS_LABEL[newStatus]}`,
      date: new Date().toISOString(),
      done: true,
    }

    const { error } = await supabase
      .from('dossiers')
      .update({
        status: newStatus,
        timeline: [...(dossier.timeline || []), timelineEvent],
        last_action: timelineEvent.label,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dossier.id)

    if (error) {
      toast.error('Erreur lors du changement de statut.')
    } else {
      setDossier((prev) => prev ? {
        ...prev,
        status: newStatus,
        timeline: [...(prev.timeline || []), timelineEvent],
        last_action: timelineEvent.label,
      } : prev)
      toast.success(`Statut mis à jour : ${STATUS_LABEL[newStatus]}`)
    }
    setStatusLoading(false)
  }

  const openShareDialog = () => {
    if (!dossier) return
    setShareMessage(
      `Bonjour,\n\nVoici un point sur le dossier "${dossier.name}" :\n\n${dossier.description || ''}\n\nStatut : ${STATUS_LABEL[dossier.status]}\nProchaine action : ${dossier.next_step || 'À définir'}\n\nCordialement,\nLe Conseil Syndical`
    )
    setShowShare(true)
    setShareSuccess(false)
  }

  const handleSendShare = async () => {
    if (!profile?.copro_id || !dossier) return
    setShareSending(true)

    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          copro_id: profile.copro_id,
          title: `[${shareTarget === 'residents' ? 'Résidents' : 'CS'}] ${dossier.name}`,
          type: 'share',
        },
      })
      setShareSuccess(true)
    } catch {
      toast.error('Erreur lors de l\'envoi.')
    } finally {
      setShareSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!dossier) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Dossier introuvable.</p>
        <Button variant="outline" onClick={() => navigate('/dossiers')}>
          <ArrowLeft className="size-4 mr-2" />
          Retour aux dossiers
        </Button>
      </div>
    )
  }

  const transitions = TRANSITIONS[dossier.status] || []

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dossiers')}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold truncate flex-1">{dossier.name}</h1>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Hero — AI Summary */}
        <Card className="p-5 bg-blue-50/50 border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn('text-xs', URGENCY_BADGE[dossier.urgency])}>
              {dossier.urgency}
            </Badge>
            <Badge className={cn('text-xs', STATUS_BADGE[dossier.status])}>
              {STATUS_LABEL[dossier.status]}
            </Badge>
          </div>

          {dossier.description ? (
            <p className="text-sm text-foreground leading-relaxed mb-3">{dossier.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-3">Pas de résumé disponible.</p>
          )}

          {dossier.next_step && (
            <p className="text-sm">
              <span className="font-semibold">Prochaine action :</span>{' '}
              {dossier.next_step}
            </p>
          )}

          <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground">
            <Sparkles className="size-3" />
            Résumé généré par IA
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-2">
          {transitions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                disabled={statusLoading}
              >
                {statusLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <ChevronDown className="size-4 mr-2" />}
                Changer statut
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {transitions.map((t) => (
                  <DropdownMenuItem key={t.value} onClick={() => handleStatusChange(t.value)}>
                    {t.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" className="flex-1 h-10" onClick={openShareDialog}>
            <Share2 className="size-4 mr-2" />
            Partager
          </Button>
        </div>

        {/* Timeline */}
        {dossier.timeline && dossier.timeline.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Chronologie</h3>
            <div className="space-y-3">
              {dossier.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {event.done ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{event.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(event.date), 'd MMM yyyy, HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Documents ({documents.length})</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.document_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg border border-border transition-colors active:bg-muted"
                >
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{doc.name}</span>
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Share dialog (cosmetic — loop solo) */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-sm mx-auto">
          {shareSuccess ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="size-7 text-green-600" />
              </div>
              <p className="text-base font-semibold">Message envoyé</p>
              <p className="text-sm text-muted-foreground mt-1">Vous avez reçu la notification.</p>
              <Button className="mt-4" onClick={() => setShowShare(false)}>Fermer</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Partager ce dossier</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="flex gap-2">
                  <Button
                    variant={shareTarget === 'residents' ? 'default' : 'outline'}
                    className="flex-1 h-10"
                    onClick={() => setShareTarget('residents')}
                  >
                    <Users className="size-4 mr-2" />
                    Résidents
                  </Button>
                  <Button
                    variant={shareTarget === 'cs' ? 'default' : 'outline'}
                    className="flex-1 h-10"
                    onClick={() => setShareTarget('cs')}
                  >
                    <Shield className="size-4 mr-2" />
                    CS uniquement
                  </Button>
                </div>

                <Textarea
                  rows={6}
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                />

                <Button
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  onClick={handleSendShare}
                  disabled={shareSending}
                >
                  {shareSending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                  Envoyer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}

export default DossierDetail
