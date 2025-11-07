import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Sparkles } from "lucide-react"
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
  return (
    <div className="mt-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card border">
          <div className="text-sm text-muted-foreground mb-1">Total Analyzed</div>
          <div className="text-3xl font-bold">{result.total_processed}</div>
        </div>
        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="text-sm text-muted-foreground mb-1">Spam Detected</div>
          <div className="text-3xl font-bold text-destructive">{result.spam_count}</div>
        </div>
        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <div className="text-sm text-muted-foreground mb-1">Safe Messages</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {result.total_processed - result.spam_count}
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
          {result.predictions.map((pred, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-colors ${
                pred.ensemble.is_spam
                  ? "bg-destructive/5 border-destructive/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm flex-1 line-clamp-2">{pred.message}</p>
                <Badge
                  variant={pred.ensemble.is_spam ? "destructive" : "outline"}
                  className={`shrink-0 ${
                    !pred.ensemble.is_spam && "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {pred.ensemble.is_spam ? "SPAM" : "SAFE"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {(pred.ensemble.confidence * 100).toFixed(1)}% confidence
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {pred.ensemble.spam_votes}/{pred.ensemble.total_votes} votes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

