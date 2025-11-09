import { InsightCard } from "@/components/dashboard/InsightCard"
import { Badge } from "@/components/ui/badge"
import type { RecentPrediction } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { getClusterShortName, getClusterIcon } from "@/constants/cluster-names"

interface RecentPredictionsTableProps {
  predictions: RecentPrediction[]
  isLoading?: boolean
  limit?: number
  activeCluster?: {
    id: number
    label?: string
  } | null
}

function truncateMessage(message: string, length = 96) {
  if (message.length <= length) {
    return message
  }
  return `${message.slice(0, length - 1)}…`
}

export function RecentPredictionsTable({
  predictions,
  isLoading = false,
  limit = 8,
  activeCluster = null,
}: RecentPredictionsTableProps) {
  const rows = predictions.slice(0, limit)
  const clusterSummary = activeCluster
    ? `Cluster ${activeCluster.id}${activeCluster.label ? ` • ${activeCluster.label}` : ""}`
    : "All clusters"

  return (
    <InsightCard
      title="Recent Predictions"
      description={`Latest classified messages • ${clusterSummary}`}
      contentClassName="pt-0"
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, idx) => (
            <div key={idx} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          {activeCluster
            ? `No predictions recorded for cluster ${activeCluster.id}.`
            : "No predictions recorded yet."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Message</th>
                <th className="py-3 pr-4 font-medium">Prediction</th>
                <th className="py-3 pr-4 font-medium">Confidence</th>
                <th className="py-3 pr-4 font-medium">Cluster</th>
                <th className="py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((prediction) => (
                <tr
                  key={`${prediction.timestamp}-${prediction.message.slice(0, 8)}`}
                  className="border-b last:border-none"
                >
                  <td className="py-3 pr-4 align-top font-medium text-foreground">
                    <span title={prediction.message}>{truncateMessage(prediction.message)}</span>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <Badge variant={prediction.is_spam ? "destructive" : "secondary"}>
                      {prediction.is_spam ? "Spam" : "Not Spam"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 pr-4 align-top">
                    {typeof prediction.cluster_id === "number" ? (
                      <Badge
                        variant={
                          activeCluster && prediction.cluster_id === activeCluster.id
                            ? "default"
                            : "outline"
                        }
                        className="gap-1"
                      >
                        <span>{getClusterIcon(prediction.cluster_id)}</span>
                        {getClusterShortName(prediction.cluster_id)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 align-top text-muted-foreground">
                    {formatDistanceToNow(new Date(prediction.timestamp), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InsightCard>
  )
}
