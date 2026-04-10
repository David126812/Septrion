import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Upload, Sparkles, Compass, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const StepPremierDoc = () => {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'analyzing' | 'success'>('idle')

  const completeOnboarding = async () => {
    if (!user) return
    await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id)
    await refreshProfile()
  }

  const handleUpload = async (file: File) => {
    if (!user || !profile?.copro_id) {
      toast.error('Profil incomplet. Revenez à l\'étape précédente.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Le fichier dépasse la limite de 10 MB.')
      return
    }

    setState('uploading')

    // Upload to Supabase Storage
    const filePath = `${profile.copro_id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('copro-documents')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Erreur lors de l\'upload du fichier.')
      setState('idle')
      return
    }

    const { data: urlData } = supabase.storage
      .from('copro-documents')
      .getPublicUrl(filePath)

    setState('analyzing')

    // Call analyze-document Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          document_url: urlData.publicUrl,
          mime_type: file.type,
          text: '',
        },
      })

      if (error || !data?.success) throw new Error('Analysis failed')

      const analysis = data.data

      await supabase.from('signalements').insert({
        copro_id: profile.copro_id,
        name: analysis.name,
        urgency: analysis.urgency,
        location: analysis.location,
        summary: analysis.summary,
        next_step: analysis.nextStep,
        document_url: urlData.publicUrl,
        raw_analysis: analysis,
        status: 'nouveau',
      })

      setState('success')
      await completeOnboarding()
      setTimeout(() => navigate('/signalements', { replace: true }), 1500)
    } catch {
      // Fallback: create signalement without IA
      await supabase.from('signalements').insert({
        copro_id: profile.copro_id,
        name: file.name.replace(/\.[^.]+$/, ''),
        urgency: 'normal',
        summary: 'Document uploadé — analyse IA non disponible.',
        document_url: urlData.publicUrl,
        status: 'nouveau',
      })
      setState('success')
      await completeOnboarding()
      setTimeout(() => navigate('/signalements', { replace: true }), 1500)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleExampleDoc = async () => {
    if (!user || !profile?.copro_id) {
      toast.error('Profil incomplet. Revenez à l\'étape précédente.')
      return
    }

    setState('analyzing')

    // Try Edge Function first, fallback to local example
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          text: 'Procès-verbal AG du 15 mars 2026 — Résidence Les Lilas. Point 3 : La toiture du bâtiment B présente des infiltrations signalées par Mme Dupont (apt 302). Devis de réfection demandé au syndic. Urgence modérée. Point 5 : Ascenseur bâtiment C en panne depuis le 2 mars. Intervention prévue semaine prochaine. Locataires âgés impactés.',
        },
      })

      if (error || !data?.success) throw new Error()

      const analysis = data.data

      await supabase.from('signalements').insert({
        copro_id: profile.copro_id,
        name: analysis.name,
        urgency: analysis.urgency,
        location: analysis.location,
        summary: analysis.summary,
        next_step: analysis.nextStep,
        raw_analysis: analysis,
        status: 'nouveau',
      })
    } catch {
      // Fallback: create example signalement locally
      await supabase.from('signalements').insert({
        copro_id: profile.copro_id,
        name: 'Infiltrations toiture Bâtiment B',
        urgency: 'urgent',
        location: 'Toiture',
        summary: 'Des infiltrations ont été signalées par Mme Dupont (apt 302). Devis de réfection demandé au syndic. Ascenseur bâtiment C en panne depuis le 2 mars, intervention prévue semaine prochaine.',
        next_step: 'Relancer le syndic pour le devis de réfection toiture',
        status: 'nouveau',
      })
    }

    setState('success')
    await completeOnboarding()
    setTimeout(() => navigate('/signalements', { replace: true }), 1500)
  }

  const handleExplore = async () => {
    await completeOnboarding()
    navigate('/dashboard', { replace: true })
  }

  if (state === 'uploading' || state === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-12 pb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
        <p className="text-base font-semibold text-foreground">
          {state === 'uploading' ? 'Upload en cours...' : 'Analyse en cours...'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          L'IA analyse votre document
        </p>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-12 pb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <p className="text-base font-semibold text-foreground">
          Votre premier signalement est prêt !
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Redirection en cours...
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 pt-4 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-2 text-center">
        Votre premier document
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Créez votre premier signalement pour voir la magie opérer.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      <div className="space-y-3">
        <Button
          onClick={handleFileSelect}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base justify-start px-4"
        >
          <Upload className="size-5 mr-3" />
          Uploader un document
        </Button>

        <Button
          onClick={handleExampleDoc}
          variant="outline"
          className="w-full h-14 text-base justify-start px-4"
        >
          <Sparkles className="size-5 mr-3 text-amber-500" />
          Utiliser un document exemple
        </Button>

        <Button
          onClick={handleExplore}
          variant="ghost"
          className="w-full h-14 text-base justify-start px-4 text-muted-foreground"
        >
          <Compass className="size-5 mr-3" />
          Explorer d'abord
        </Button>
      </div>
    </div>
  )
}

export default StepPremierDoc
