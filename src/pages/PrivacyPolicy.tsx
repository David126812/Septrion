import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Politique de confidentialité</h1>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold mb-2">1. Données collectées</h2>
          <p>
            Septrion collecte les données suivantes : numéro de téléphone, prénom,
            nom de la copropriété, adresse email (optionnel), et les documents que vous
            envoyez via l'application ou WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">2. Finalités du traitement</h2>
          <p>
            Vos données sont utilisées pour : gérer votre compte, analyser les documents
            envoyés afin de créer des dossiers structurés, envoyer des notifications
            (avec votre consentement), et améliorer le service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">3. Intelligence artificielle</h2>
          <p>
            Septrion utilise l'IA (Claude par Anthropic) pour analyser vos documents et
            générer des résumés. Les documents sont transmis via connexion chiffrée et
            ne sont pas conservés par le fournisseur IA après analyse (API stateless).
            Tous les résumés générés par l'IA sont clairement identifiés.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">4. Durée de conservation</h2>
          <p>
            Vos données sont conservées pendant la durée de votre utilisation du service.
            Vous pouvez demander la suppression de votre compte et de vos données à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">5. Vos droits (RGPD)</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
            de suppression, de portabilité et d'opposition au traitement de vos données.
            Pour exercer ces droits, contactez-nous à privacy@septrion.app.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">6. Sous-traitants</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supabase (hébergement, base de données, authentification)</li>
            <li>Anthropic (analyse IA des documents)</li>
            <li>Vercel (hébergement de l'application web)</li>
            <li>Resend (envoi d'emails)</li>
            <li>Meta (WhatsApp Business API)</li>
            <li>PostHog (analytics — hébergement EU)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-2">7. Sécurité</h2>
          <p>
            Toutes les communications sont chiffrées (HTTPS). L'accès aux données est
            isolé par copropriété grâce aux politiques de sécurité au niveau de la base
            de données (Row Level Security).
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
