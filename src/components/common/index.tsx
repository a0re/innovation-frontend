import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatCardProps, PageHeaderProps } from "@/types"

/**
 * Reusable stat card component for displaying key metrics
 */
export const StatCard = React.memo<StatCardProps>(
  ({ title, value, description, icon, variant = "default" }) => {
    const variantClasses = {
      default: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      danger: "text-destructive",
      warning: "text-yellow-600 dark:text-yellow-400",
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${variantClasses[variant]}`}>{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardContent>
      </Card>
    )
  }
)

StatCard.displayName = "StatCard"

/**
 * Page header component with title and description
 */
export const PageHeader = React.memo<PageHeaderProps>(({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold mb-2">{title}</h1>
    {description && <p className="text-muted-foreground">{description}</p>}
  </div>
))

PageHeader.displayName = "PageHeader"

/**
 * Error state display component
 */
interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorDisplay = React.memo<ErrorDisplayProps>(
  ({ message, onRetry, retryLabel = "Retry" }) => {
    const AlertTriangle = React.lazy(() =>
      import("lucide-react").then((m) => ({ default: m.AlertTriangle }))
    )

    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <React.Suspense fallback={null}>
              <AlertTriangle className="h-5 w-5" />
            </React.Suspense>
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {retryLabel}
            </button>
          )}
        </CardContent>
      </Card>
    )
  }
)

ErrorDisplay.displayName = "ErrorDisplay"

/**
 * Loading skeleton for stat cards
 */
export const StatCardSkeleton = React.memo(() => (
  <Card>
    <CardHeader>
      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
    </CardContent>
  </Card>
))

StatCardSkeleton.displayName = "StatCardSkeleton"

/**
 * Empty state display component
 */
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export const EmptyState = React.memo<EmptyStateProps>(
  ({ icon, title, description, action }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon && <div className="h-16 w-16 text-muted-foreground mb-4">{icon}</div>}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  )
)

EmptyState.displayName = "EmptyState"

/**
 * Badge with value display
 */
interface ValueBadgeProps {
  label: string
  value: string | number
}

export const ValueBadge = React.memo<ValueBadgeProps>(
  ({ label, value }) => (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
)

ValueBadge.displayName = "ValueBadge"

/**
 * Section header with optional description
 */
interface SectionHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const SectionHeader = React.memo<SectionHeaderProps>(
  ({ title, description, icon, action }) => (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
)

SectionHeader.displayName = "SectionHeader"

/**
 * Progress bar display
 */
interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  variant?: "default" | "success" | "danger"
  showPercentage?: boolean
}

export const ProgressBar = React.memo<ProgressBarProps>(
  ({ value, max = 100, label, variant = "default", showPercentage = true }) => {
    const percentage = (value / max) * 100
    const variantColors = {
      default: "bg-primary",
      success: "bg-emerald-500 dark:bg-emerald-400",
      danger: "bg-destructive",
    }

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{label}</span>
            {showPercentage && <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>}
          </div>
        )}
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full ${variantColors[variant]} rounded-full transition-all`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"
