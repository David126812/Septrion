import { useLocation, useNavigate } from 'react-router-dom'
import { Home, FolderOpen, Plus, Inbox, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  path: string
  icon: React.ReactNode
  label: string
  isCenter?: boolean
}

const BottomNav = ({ signalementCount }: { signalementCount?: number }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const items: NavItem[] = [
    { path: '/dashboard', icon: <Home className="size-5" />, label: 'Accueil' },
    { path: '/dossiers', icon: <FolderOpen className="size-5" />, label: 'Dossiers' },
    { path: '/signaler-incident', icon: <Plus className="size-6" />, label: '', isCenter: true },
    { path: '/signalements', icon: <Inbox className="size-5" />, label: 'Inbox' },
    { path: '/assistant', icon: <MessageCircle className="size-5" />, label: 'Assistant' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center w-14 h-14 -mt-5 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
              >
                {item.icon}
              </button>
            )
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                {item.icon}
                {item.path === '/signalements' && signalementCount && signalementCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {signalementCount > 99 ? '99+' : signalementCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
