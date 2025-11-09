import { StatCard } from "@/components/common/StatCard"
import type { StatCardProps, StatsResponse, TrendPoint } from "@/types"
import { computeDeltaPercentage } from "@/lib/analytics"

interface DashboardHighlightsProps {
  stats?: StatsResponse | null
  trend?: TrendPoint[]
  isLoading?: boolean
}

function formatPercentage(value: number | null, digits = 1) {
  if (value === null || Number.isNaN(value)) {
    return "–"
  }
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(digits)}%`
}

function formatRate(value: number | null, digits = 1) {
  if (value === null || Number.isNaN(value)) {
    return "0%"
  }
  return `${(value * 100).toFixed(digits)}%`
}

export function DashboardHighlights({ stats, trend, isLoading = false }: DashboardHighlightsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  const totals = trend && trend.length > 0 ? trend[trend.length - 1] : undefined
  const previous = trend && trend.length > 1 ? trend[trend.length - 2] : undefined

  const totalDelta = totals && previous ? computeDeltaPercentage(totals.total, previous.total) : null
  const spamRateDelta = totals && previous ? computeDeltaPercentage(totals.spam_rate, previous.spam_rate) : null
  const confidenceDelta = totals && previous ? computeDeltaPercentage(totals.avg_confidence, previous.avg_confidence) : null
  const currentAvgConfidence = totals?.avg_confidence ?? stats?.avg_confidence ?? 0

  type HighlightCardConfig = Pick<StatCardProps, "title" | "value" | "description" | "variant">

  const highlightCards: HighlightCardConfig[] = [
    {
      title: "Total Predictions",
      value: stats ? stats.total_predictions.toLocaleString() : "0",
      description: `vs last period ${formatPercentage(totalDelta)}`,
      variant: totalDelta === null ? "default" : totalDelta >= 0 ? "success" : "danger",
    },
    {
      title: "Spam Rate",
      value: formatRate(stats ? stats.spam_rate : null),
      description: `vs last period ${formatPercentage(spamRateDelta)}`,
      variant: spamRateDelta === null ? "default" : spamRateDelta < 0 ? "success" : "danger",
    },
    {
      title: "Average Confidence",
      value: `${(currentAvgConfidence * 100).toFixed(1)}%`,
      description: `vs last period ${formatPercentage(confidenceDelta)}`,
      variant: confidenceDelta === null ? "default" : confidenceDelta > 0 ? "success" : "danger",
    },
    {
      title: "Cluster Coverage",
      value: trend && totals?.clusters ? totals.clusters.length : 0,
      description: trend && totals?.clusters ? "Active spam clusters" : "No cluster signals",
      variant: trend && totals?.clusters && totals.clusters.length === 0 ? "danger" : "default",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {highlightCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          variant={card.variant}
        />
      ))}
    </div>
  )
}
