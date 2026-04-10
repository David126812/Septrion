import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, MessageCircle, ArrowRight } from 'lucide-react'

interface Props {
  onNext: () => void
}

const WHATSAPP_NUMBER = '+33 1 23 45 67 89'

const StepWhatsApp = ({ onNext }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_NUMBER.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className="px-6 pt-4 pb-6">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <MessageCircle className="size-8 text-green-600" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2 text-center">
        Connectez WhatsApp
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Envoyez vos documents directement via WhatsApp.
        L'IA les analyse et crée des dossiers automatiquement.
      </p>

      <div className="space-y-4 mb-8">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Comment faire :</p>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">1</span>
              <span>Ajoutez ce numéro à vos contacts WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">2</span>
              <span>Transférez un document (PV, devis, email) à ce contact</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">3</span>
              <span>Retrouvez le signalement dans l'app en quelques secondes</span>
            </li>
          </ol>
        </div>

        {/* Phone number + copy */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
          <span className="flex-1 text-sm font-mono font-medium text-foreground">{WHATSAPP_NUMBER}</span>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            <span className="ml-1">{copied ? 'Copié' : 'Copier'}</span>
          </Button>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base"
      >
        Suivant
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  )
}

export default StepWhatsApp
