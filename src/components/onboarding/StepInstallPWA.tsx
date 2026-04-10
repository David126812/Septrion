import { Button } from '@/components/ui/button'
import { Share, EllipsisVertical, Download, Check } from 'lucide-react'

interface Props {
  onNext: () => void
}

const StepInstallPWA = ({ onNext }: Props) => {
  return (
    <div className="px-6 pt-4 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-2 text-center">
        Installez Septrion
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Ajoutez l'app sur votre écran d'accueil pour un accès rapide.
      </p>

      <div className="space-y-4 mb-8">
        {/* iOS instructions */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold"></span>
            </div>
            <span className="text-sm font-semibold">iPhone / iPad</span>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Share className="size-4 text-primary shrink-0" />
              <span>Appuyez sur <strong className="text-foreground">Partager</strong> en bas du navigateur</span>
            </div>
            <div className="flex items-center gap-3">
              <Download className="size-4 text-primary shrink-0" />
              <span>Puis <strong className="text-foreground">"Sur l'écran d'accueil"</strong></span>
            </div>
          </div>
        </div>

        {/* Android instructions */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-semibold">Android</span>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <EllipsisVertical className="size-4 text-primary shrink-0" />
              <span>Appuyez sur <strong className="text-foreground">Menu</strong> (⋮) en haut à droite</span>
            </div>
            <div className="flex items-center gap-3">
              <Download className="size-4 text-primary shrink-0" />
              <span>Puis <strong className="text-foreground">"Installer l'application"</strong></span>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base"
      >
        <Check className="size-4 mr-2" />
        C'est fait
      </Button>
    </div>
  )
}

export default StepInstallPWA
