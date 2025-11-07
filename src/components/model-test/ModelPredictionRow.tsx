import { Badge } from "@/components/ui/badge"

/**
 * Model prediction row component
 */
export function ModelPredictionRow({
  name,
  isSpam,
  confidence,
}: {
  name: string
  isSpam: boolean
  confidence: number
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${isSpam ? "bg-destructive" : "bg-emerald-500"}`} />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{(confidence * 100).toFixed(1)}%</span>
        <Badge
          variant={isSpam ? "destructive" : "outline"}
          className={`text-xs ${
            !isSpam && "border-emerald-500 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isSpam ? "SPAM" : "SAFE"}
        </Badge>
      </div>
    </div>
  )
}

