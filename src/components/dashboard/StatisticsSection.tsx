import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/common"
import { formatNumber, formatConfidence } from "@/lib/utils.ts"
import type { StatsResponse } from "@/types"

/**
 * Statistics section component
 */
interface StatisticsSectionProps {
  stats: StatsResponse
}

export function StatisticsSection({ stats }: StatisticsSectionProps) {
  const spamRate = (stats.spam_detected / stats.total_predictions) * 100

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Total Predictions"
        value={formatNumber(stats.total_predictions)}
        description="All-time messages analyzed"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Spam Detected"
        value={stats.spam_detected}
        description={`${spamRate.toFixed(1)}% of total messages`}
        icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        variant="danger"
      />
      <StatCard
        title="Not Spam"
        value={stats.not_spam_detected}
        description={`${(100 - spamRate).toFixed(1)}% of total messages`}
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />}
        variant="success"
      />
      <StatCard
        title="Avg Confidence"
        value={stats.average_confidence ? formatConfidence(stats.average_confidence) : "0%"}
        description="Model certainty score"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}
