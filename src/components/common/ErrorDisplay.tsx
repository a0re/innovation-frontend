import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

