"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Users, Calendar, Award, MessageCircle, User, LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Matches", href: "/matches", icon: Users },
  { name: "Sessions", href: "/sessions", icon: Calendar },
  { name: "Badges", href: "/badges", icon: Award },
  { name: "Communities", href: "/communities", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            SS
          </div>
          <span className="text-xl font-bold text-pretty">SkillSwap</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {user && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.credits} credits</p>
            </div>
          </div>
          <div className="space-y-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back" className={className}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}
