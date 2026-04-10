import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Minus, Plus, LogOut, Shield, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import BottomNav from '@/components/layout/BottomNav'

const Settings = () => {
  const navigate = useNavigate()
  const { profile, copro, signOut, refreshProfile } = useAuth()
  const [notifEnabled, setNotifEnabled] = useState(profile?.notification_consent ?? false)
  const [lotsCount, setLotsCount] = useState(copro?.lots_count ?? 0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNotifEnabled(profile?.notification_consent ?? false)
    setLotsCount(copro?.lots_count ?? 0)
  }, [profile, copro])

  const handleToggleNotif = async () => {
    const newVal = !notifEnabled
    setNotifEnabled(newVal)
    if (!profile) return
    await supabase
      .from('profiles')
      .update({ notification_consent: newVal })
      .eq('id', profile.id)
    await refreshProfile()
  }

  const handleLotsChange = async (delta: number) => {
    const newCount = Math.max(0, lotsCount + delta)
    setLotsCount(newCount)
    if (!copro) return
    setSaving(true)
    await supabase
      .from('coproprietes')
      .update({ lots_count: newCount })
      .eq('id', copro.id)
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth', { replace: true })
    toast.success('Déconnexion réussie.')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Paramètres</h1>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile (read-only) */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">Profil</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prénom</span>
              <span className="font-medium">{profile?.first_name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Copropriété</span>
              <span className="font-medium">{copro?.name || '—'}</span>
            </div>
          </div>
        </Card>

        {/* Lots count */}
        <Card className="p-4 space-y-3">
          <Label>Nombre de lots</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleLotsChange(-1)}
              disabled={lotsCount <= 0 || saving}
            >
              <Minus className="size-4" />
            </Button>
            <span className="text-lg font-semibold w-12 text-center">{lotsCount}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleLotsChange(1)}
              disabled={saving}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </Card>

        {/* Notifications toggle */}
        <Card className="p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">Notifications (WhatsApp + email)</span>
            <button
              onClick={handleToggleNotif}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifEnabled ? 'bg-primary' : 'bg-muted-foreground/20'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>
        </Card>

        <Separator />

        {/* Links */}
        <button
          onClick={() => navigate('/privacy')}
          className="flex items-center gap-3 w-full p-3 text-sm text-foreground rounded-lg transition-colors active:bg-muted"
        >
          <Shield className="size-4 text-muted-foreground" />
          Politique de confidentialité
        </button>

        <div className="flex items-center gap-3 px-3 text-[11px] text-muted-foreground">
          <Sparkles className="size-3 shrink-0" />
          Les résumés de dossiers sont générés par IA (Claude par Anthropic).
        </div>

        <Separator />

        <Button
          variant="destructive"
          className="w-full h-11"
          onClick={handleSignOut}
        >
          <LogOut className="size-4 mr-2" />
          Se déconnecter
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}

export default Settings
