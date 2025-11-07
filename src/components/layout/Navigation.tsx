import { Link, useLocation } from "react-router-dom"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { navItems } from "@/config/routes"

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SpamGuard AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

      </div>
    </nav>
  )
}
