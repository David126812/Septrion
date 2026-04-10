import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Stepper from '@/components/onboarding/Stepper'
import StepExplication from '@/components/onboarding/StepExplication'
import StepProfil from '@/components/onboarding/StepProfil'
import StepInstallPWA from '@/components/onboarding/StepInstallPWA'
import StepWhatsApp from '@/components/onboarding/StepWhatsApp'
import StepPremierDoc from '@/components/onboarding/StepPremierDoc'

const TOTAL_STEPS = 5

const Onboarding = () => {
  const { profile, loading } = useAuth()
  const [step, setStep] = useState(1)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Already completed onboarding
  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />
  }

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto">
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && <StepExplication onNext={next} />}
        {step === 2 && <StepProfil onNext={next} />}
        {step === 3 && <StepInstallPWA onNext={next} />}
        {step === 4 && <StepWhatsApp onNext={next} />}
        {step === 5 && <StepPremierDoc />}
      </div>
    </div>
  )
}

export default Onboarding
