import { Button } from '@/components/ui/button'
import { FileText, ArrowRight, FolderOpen } from 'lucide-react'

interface Props {
  onNext: () => void
}

const StepExplication = ({ onNext }: Props) => {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
      {/* Visual flow: Document → Septrion → Dossier structuré */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <FileText className="size-8 text-blue-600" />
          </div>
          <span className="text-xs text-muted-foreground">Document</span>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xs text-muted-foreground">Septrion</span>
        </div>

        <ArrowRight className="size-5 text-muted-foreground shrink-0" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
            <FolderOpen className="size-8 text-green-600" />
          </div>
          <span className="text-xs text-muted-foreground">Dossier</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        Vos documents deviennent des dossiers
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        Envoyez un PV, un devis ou un email via WhatsApp ou l'app.
        L'IA analyse et crée un dossier structuré automatiquement.
      </p>

      <Button
        onClick={onNext}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base"
      >
        Suivant
      </Button>
    </div>
  )
}

export default StepExplication
