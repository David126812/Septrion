import { cn } from '@/lib/utils'

interface StepperProps {
  currentStep: number
  totalSteps: number
}

const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i + 1 === currentStep
              ? 'w-8 bg-primary'
              : i + 1 < currentStep
                ? 'w-2 bg-primary/60'
                : 'w-2 bg-muted-foreground/20'
          )}
        />
      ))}
    </div>
  )
}

export default Stepper
