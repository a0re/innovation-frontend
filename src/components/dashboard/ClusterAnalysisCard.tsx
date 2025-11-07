import { Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { ClusterInfoResponse } from "@/types"

/**
 * Cluster analysis card
 */
interface ClusterAnalysisCardProps {
  clusterInfo: ClusterInfoResponse | null
}

export function ClusterAnalysisCard({ clusterInfo }: ClusterAnalysisCardProps) {
  if (!clusterInfo) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Cluster Analysis
        </CardTitle>
        <CardDescription>K-means clustering insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Clusters</div>
              <div className="text-2xl font-bold">{clusterInfo.total_clusters}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Silhouette Score</div>
              <div className="text-2xl font-bold">
                {clusterInfo.silhouette_score.toFixed(3)}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm font-medium mb-3">Cluster Distribution</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clusterInfo.clusters?.map((cluster) => (
                <div key={cluster.cluster_id} className="p-3 rounded-md bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cluster {cluster.cluster_id}</span>
                    <span className="text-xs text-muted-foreground">{cluster.num_terms} terms</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {cluster.top_terms.slice(0, 3).map((term) => (
                      <span key={term.term} className="text-xs bg-background px-2 py-1 rounded">
                        {term.term}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
