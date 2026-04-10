import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Camera, Sparkles, Loader2, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const LOCATIONS = [
  'Parking', 'Hall', 'Ascenseur', 'Escalier', 'Façade',
  'Toiture', 'Parties communes', 'Cave', 'Extérieur', 'Autre',
]

const SignalerIncident = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    if (f.size > 10 * 1024 * 1024) {
      toast.error('Le fichier dépasse la limite de 10 MB.')
      return
    }

    setFile(f)
    if (f.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(f))
    } else {
      setFilePreview(null)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAnalyzeIA = async () => {
    if (!file || !profile?.copro_id) return

    setAnalyzing(true)
    try {
      // Upload file first
      const filePath = `${profile.copro_id}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('copro-documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('copro-documents')
        .getPublicUrl(filePath)

      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          document_url: urlData.publicUrl,
          mime_type: file.type,
          text: '',
        },
      })

      if (error || !data?.success) throw new Error('Analysis failed')

      const analysis = data.data
      // Pre-fill form fields (user can modify)
      if (analysis.name && !title) setTitle(analysis.name)
      if (analysis.location) setLocation(analysis.location)
      if (analysis.summary && !description) setDescription(analysis.summary)

      toast.success('Champs pré-remplis par l\'IA. Vous pouvez les modifier.')
    } catch {
      toast.error('L\'analyse IA a échoué. Remplissez les champs manuellement.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !profile?.copro_id) return

    setSubmitting(true)
    try {
      let documentUrl: string | null = null

      // Upload file if present and not already uploaded by IA analysis
      if (file) {
        const filePath = `${profile.copro_id}/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('copro-documents')
          .upload(filePath, file)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('copro-documents')
            .getPublicUrl(filePath)
          documentUrl = urlData.publicUrl
        }
      }

      const { error } = await supabase.from('signalements').insert({
        copro_id: profile.copro_id,
        name: title,
        urgency: 'normal',
        location: location,
        summary: description || null,
        next_step: 'À qualifier par le conseil syndical',
        document_url: documentUrl,
        status: 'nouveau',
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => navigate('/signalements', { replace: true }), 1500)
    } catch {
      toast.error('Erreur lors de la création du signalement.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-foreground">Signalement créé !</p>
        <p className="text-sm text-muted-foreground mt-1">Redirection en cours...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Signaler un incident</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 max-w-lg mx-auto space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="sig-title">Titre <span className="text-destructive">*</span></Label>
          <Input
            id="sig-title"
            placeholder="Ex : Fuite au parking B2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Location chips */}
        <div className="space-y-2">
          <Label>Localisation</Label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(location === loc ? null : loc)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm border transition-colors',
                  location === loc
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border'
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="sig-desc">Description <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
          <Textarea
            id="sig-desc"
            placeholder="Décrivez le problème..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <Label>Pièce jointe</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground transition-colors active:bg-muted"
            >
              <Camera className="size-6" />
              <span className="text-sm">Photo ou document</span>
            </button>
          ) : (
            <div className="rounded-xl border border-border p-3 space-y-3">
              <div className="flex items-center gap-3">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    PDF
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={handleRemoveFile}>
                  <X className="size-4" />
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAnalyzeIA}
                disabled={analyzing}
              >
                {analyzing ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="size-4 mr-2 text-amber-500" />
                )}
                {analyzing ? 'Analyse en cours...' : 'Analyser avec l\'IA'}
              </Button>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base"
          disabled={submitting || !title}
        >
          {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
          Envoyer
        </Button>
      </form>
    </div>
  )
}

export default SignalerIncident
