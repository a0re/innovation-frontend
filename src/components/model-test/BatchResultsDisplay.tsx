import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Clock3, ShieldAlert, ShieldCheck } from "lucide-react"
import type { BatchPredictionResponse } from "@/types"

/**
 * Batch results display component
 */
export function BatchResultsDisplay({
  result,
  onExport,
}: {
  result: BatchPredictionResponse
  onExport: () => void
}) {
  const normalizedPredictions = useMemo(() => {
    return result.predictions.map((pred) => {
      const numericConfidence =
        typeof pred.confidence === "number" && Number.isFinite(pred.confidence)
          ? pred.confidence
          : Number((pred as unknown as { confidence: unknown }).confidence)
      const derivedConfidence =
        typeof numericConfidence === "number" && Number.isFinite(numericConfidence)
          ? numericConfidence
          : null
      const derivedIsSpam = Boolean(pred.is_spam || pred.prediction === "spam")

      return {
        original: pred,
        isSpam: derivedIsSpam,
        confidence: derivedConfidence,
        cluster: pred.cluster ?? null,
      }
    })
  }, [result.predictions])

  const summary = useMemo(() => {
    const total = Number(result.total) || normalizedPredictions.length
    const spamCount = Number(result.spam)
    const hamCount = Number(result.ham)

    const derivedSpam = Number.isFinite(spamCount) && spamCount >= 0 ? spamCount : normalizedPredictions.filter((p) => p.isSpam).length
    const derivedHam = Number.isFinite(hamCount) && hamCount >= 0 ? hamCount : total - derivedSpam

    const confidences = normalizedPredictions
      .filter((pred) => pred.confidence !== null)
      .map((pred) => pred.confidence as number)

    const avgConfidence = confidences.length
      ? (confidences.reduce((acc, value) => acc + value, 0) / confidences.length) * 100
      : null

    const spamRate = total ? (derivedSpam / total) * 100 : 0

    return {
      total,
      spam: derivedSpam,
      ham: derivedHam,
      spamRate,
      avgConfidence,
    }
  }, [result.total, result.spam, result.ham, normalizedPredictions])

  const renderConfidence = (confidence: number | null) => {
    if (confidence === null) {
      return "Unknown confidence"
    }
    return `${(confidence * 100).toFixed(1)}% confidence`
  }

  const renderTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) {
      return "Unknown time"
    }
    return date.toLocaleString()
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card border">
          <div className="text-sm text-muted-foreground mb-1">Total Analyzed</div>
          <div className="text-3xl font-bold">{summary.total}</div>
        </div>
        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="text-sm text-muted-foreground mb-1">Spam Detected</div>
          <div className="text-3xl font-bold text-destructive">{summary.spam}</div>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <div className="text-sm text-muted-foreground mb-1">Safe Messages</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {summary.ham}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-destructive" />
          <div>
            <div className="text-sm text-muted-foreground">Spam Rate</div>
            <div className="text-lg font-semibold">{summary.spamRate.toFixed(1)}%</div>
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-500" />
          <div>
            <div className="text-sm text-muted-foreground">Average Confidence</div>
            <div className="text-lg font-semibold">
              {summary.avgConfidence !== null ? `${summary.avgConfidence.toFixed(1)}%` : "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={onExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Results as CSV
        </Button>
      </div>

      {/* Results List */}
      <div className="p-4 rounded-lg border bg-card">
        <h4 className="font-semibold mb-4">Detailed Results</h4>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {normalizedPredictions.map(({ original, isSpam, confidence, cluster }, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-colors ${
                isSpam
                  ? "bg-destructive/5 border-destructive/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm flex-1 line-clamp-2">{original.message}</p>
                <Badge
                  variant={isSpam ? "destructive" : "outline"}
                  className={`shrink-0 ${
                    !isSpam && "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isSpam ? "SPAM" : "SAFE"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {renderConfidence(confidence)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 className="h-3 w-3" />
                  {renderTimestamp(original.timestamp)}
                </span>
              </div>
              {isSpam && cluster && (
                <div className="mt-2 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  {cluster.icon && <span className="text-base leading-none">{cluster.icon}</span>}
                  <span className="font-medium text-foreground">
                    {cluster.short_name || cluster.name || `Cluster ${cluster.cluster_id}`}
                  </span>
                  <span>
                    {(cluster.confidence * 100).toFixed(1)}% match
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

