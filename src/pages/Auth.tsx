import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Convert phone to email format for Supabase Auth (phone auth requires SMS provider)
  const phoneToEmail = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '').replace(/^\+/, '')
    return `${cleaned}@septrion.phone`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(phone),
      password,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Identifiants incorrects. Vérifiez votre numéro et mot de passe.'
        : error.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) return
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: phoneToEmail(phone),
      password,
    })
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Ce numéro est déjà utilisé. Essayez de vous connecter.')
      } else {
        toast.error(error.message)
      }
      return
    }

    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Septrion</h1>
          <p className="text-sm text-muted-foreground mt-1">Votre copropriété, toujours à jour.</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Connectez-vous avec votre numéro de téléphone.'
                : 'Inscrivez-vous pour commencer.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? '' : '8 caractères minimum'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
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

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                disabled={loading || !phone || !password}
              >
                {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                {isLogin ? 'Se connecter' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary"
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth
