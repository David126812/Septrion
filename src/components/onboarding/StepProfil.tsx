import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  onNext: () => void
}

const StepProfil = ({ onNext }: Props) => {
  const { user, refreshProfile } = useAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [coproName, setCoproName] = useState('')
  const [notifConsent, setNotifConsent] = useState(true)
  const [loading, setLoading] = useState(false)

  const isAlreadySignedUp = !!user

  const phoneToEmail = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '').replace(/^\+/, '')
    return `${cleaned}@septrion.phone`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let userId = user?.id

      // Create account if not already signed up
      if (!isAlreadySignedUp) {
        if (!phone || !password) {
          toast.error('Numéro de téléphone et mot de passe requis.')
          setLoading(false)
          return
        }
        if (password.length < 8) {
          toast.error('Le mot de passe doit contenir au moins 8 caractères.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: phoneToEmail(phone),
          password,
        })
        if (error) {
          toast.error(error.message.includes('already registered')
            ? 'Ce numéro est déjà utilisé.'
            : error.message)
          setLoading(false)
          return
        }
        userId = data.user?.id
      }

      if (!userId || !firstName || !coproName) {
        toast.error('Prénom et nom de copropriété requis.')
        setLoading(false)
        return
      }

      // Create or find copropriete
      let coproId: string
      const { data: existingCopro } = await supabase
        .from('coproprietes')
        .select('id')
        .eq('name', coproName)
        .single()

      if (existingCopro) {
        coproId = existingCopro.id
      } else {
        const { data: newCopro, error: coproError } = await supabase
          .from('coproprietes')
          .insert({ name: coproName })
          .select('id')
          .single()
        if (coproError || !newCopro) {
          toast.error('Erreur lors de la création de la copropriété.')
          setLoading(false)
          return
        }
        coproId = newCopro.id
      }

      // Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName,
          copro_id: coproId,
          whatsapp_phone: phone || user?.email?.replace('@septrion.phone', '') || '',
          email: email || null,
          notification_consent: notifConsent,
        })

      if (profileError) {
        toast.error('Erreur lors de la sauvegarde du profil.')
        setLoading(false)
        return
      }

      await refreshProfile()
      onNext()
    } catch {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = isAlreadySignedUp
    ? firstName && coproName
    : phone && password && firstName && coproName

  return (
    <div className="px-6 pt-4 pb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account block — only if not already signed up */}
        {!isAlreadySignedUp && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Votre compte
            </h3>

            <div className="space-y-2">
              <Label htmlFor="onb-phone">Numéro de téléphone</Label>
              <Input
                id="onb-phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onb-password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="onb-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onb-email">Email <span className="text-muted-foreground">(optionnel)</span></Label>
              <Input
                id="onb-email"
                type="email"
                placeholder="louise@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Profile block */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Votre profil
          </h3>

          <div className="space-y-2">
            <Label htmlFor="onb-firstname">Prénom</Label>
            <Input
              id="onb-firstname"
              placeholder="Louise"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onb-copro">Nom de votre copropriété</Label>
            <Input
              id="onb-copro"
              placeholder="Résidence Les Lilas"
              value={coproName}
              onChange={(e) => setCoproName(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifConsent}
              onChange={(e) => setNotifConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground leading-snug">
              J'accepte de recevoir des notifications par WhatsApp et email
            </span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base"
          disabled={loading || !isValid}
        >
          {loading && <Loader2 className="size-4 animate-spin mr-2" />}
          {isAlreadySignedUp ? 'Enregistrer mon profil' : 'Créer mon compte'}
        </Button>
      </form>
    </div>
  )
}

export default StepProfil
