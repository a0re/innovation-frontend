import { AlertTriangle } from "lucide-react"

/**
 * Error message display component
 */
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-destructive">Analysis Failed</p>
          <p className="text-sm text-destructive/80 mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}

