import { useMemo, useCallback } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type PieLabelRenderProps,
  type TooltipProps,
} from "recharts"
import type { ClusterDistributionItem, ClusterDetails } from "@/types"
import { InsightCard } from "@/components/dashboard/InsightCard"
import { Button } from "@/components/ui/button"
import { getClusterMetadata } from "@/constants/cluster-names"

type ChartDatum = {
  clusterId: number
  name: string
  value: number
  percentage: string
  color: string
  topTerms: { term: string; score?: number }[]
  icon?: string
}

interface ClusterDistributionChartProps {
  clusters: ClusterDistributionItem[]
  total: number
  clusterDetails?: ClusterDetails[]
  selectedCluster?: number | null
  onSelectCluster?: (clusterId: number | null) => void
  isLoading?: boolean
}

export function ClusterDistributionChart({
  clusters,
  total,
  clusterDetails,
  selectedCluster = null,
  onSelectCluster,
  isLoading = false,
}: ClusterDistributionChartProps) {
  const clusterMeta = useMemo(() => {
    if (!clusterDetails?.length) {
      return new Map<number, ClusterDetails>()
    }
    return new Map(clusterDetails.map((detail) => [detail.cluster_id, detail]))
  }, [clusterDetails])

  const chartData = useMemo<ChartDatum[]>(() => {
    const sorted = [...clusters].sort((a, b) => b.count - a.count)
    
    return sorted.map<ChartDatum>((item) => {
      const percentage = total > 0 ? (item.count / total) * 100 : 0
      const detail = clusterMeta.get(item.cluster_id)
      
      // Use cluster name from API response, fallback to local metadata, then generic label
      const localMeta = getClusterMetadata(item.cluster_id)
      const clusterName = item.name || item.short_name || localMeta?.short_name || `Cluster ${item.cluster_id}`
      const clusterColor = item.color || localMeta?.color || "#8884d8"
      const clusterIcon = item.icon || localMeta?.icon
      
      return {
        clusterId: item.cluster_id,
        name: clusterName,
        value: item.count,
        percentage: percentage.toFixed(1),
        color: clusterColor,
        topTerms: detail?.top_terms?.slice(0, 3) ?? [],
        icon: clusterIcon,
      }
    })
  }, [clusters, total, clusterMeta])

  // Position chart labels outside the slice so they stay visible regardless of slice size.
  const renderLabel = useCallback(
    ({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, payload }: PieLabelRenderProps & { payload?: ChartDatum }) => {
      if (!payload) return null

      const numericOuterRadius = typeof outerRadius === "number" ? outerRadius : Number(outerRadius) || 0
      const centerX = typeof cx === "number" ? cx : Number(cx) || 0
      const centerY = typeof cy === "number" ? cy : Number(cy) || 0
      const radius = numericOuterRadius + 18
      const RADIAN = Math.PI / 180
      const x = centerX + radius * Math.cos(-midAngle * RADIAN)
      const y = centerY + radius * Math.sin(-midAngle * RADIAN)

      return (
        <text
          x={x}
          y={y}
          fill="var(--foreground)"
          textAnchor={x > centerX ? "start" : "end"}
          dominantBaseline="central"
          className="text-xs"
        >
          {`${payload.name} ${payload.percentage}%`}
        </text>
      )
    },
    [],
  )

  const handleBarClick = useCallback(
    (clusterId: number) => {
      if (!onSelectCluster) return
      if (selectedCluster === clusterId) {
        onSelectCluster(null)
      } else {
        onSelectCluster(clusterId)
      }
    },
    [onSelectCluster, selectedCluster],
  )

  return (
    <InsightCard
      title="Spam Cluster Distribution"
      description="Share of spam traffic by detected cluster"
      className="min-h-[28rem]"
      contentClassName="pt-0"
      action={
        selectedCluster !== null && onSelectCluster ? (
          <Button size="sm" variant="outline" onClick={() => onSelectCluster(null)}>
            Clear Filter
          </Button>
        ) : null
      }
    >
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No cluster data captured yet.</div>
      ) : (
        <div className="space-y-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  paddingAngle={2}
                  labelLine
                  label={renderLabel}
                  outerRadius={112}
                  innerRadius={52}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(_, index) => {
                    const item = chartData[index]
                    if (!item) return
                    handleBarClick(item.clusterId)
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      fillOpacity={
                        selectedCluster === null || selectedCluster === entry.clusterId ? 1 : 0.3
                      }
                      stroke={selectedCluster === entry.clusterId ? entry.color : "none"}
                      strokeWidth={selectedCluster === entry.clusterId ? 3 : 0}
                      style={{ cursor: onSelectCluster ? "pointer" : "default" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ClusterTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Simple list below chart */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {chartData.slice(0, 5).map((item) => {
              const isSelected = selectedCluster === item.clusterId
              const cluster = clusters.find(c => c.cluster_id === item.clusterId)
              return (
                <div
                  key={item.clusterId}
                  onClick={() => handleBarClick(item.clusterId)}
                  className={`flex items-center justify-between rounded-md border p-2 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {cluster?.icon && <span className="text-base">{cluster.icon}</span>}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {item.value.toLocaleString()} ({item.percentage}%)
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </InsightCard>
  )
}

function ClusterTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const datum = payload[0]?.payload as ChartDatum | undefined
  if (!datum) {
    return null
  }

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <div className="font-semibold">{datum.name}</div>
      <div className="text-muted-foreground">
        {datum.value.toLocaleString()} messages ({datum.percentage}%)
      </div>
    </div>
  )
}
