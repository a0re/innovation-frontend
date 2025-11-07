import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ProgressBar } from "@/components/common"
import type { StatsResponse } from "@/types"

/**
 * Spam distribution visualization card
 */
interface SpamDistributionCardProps {
  stats: StatsResponse
}

export function SpamDistributionCard({ stats }: SpamDistributionCardProps) {
  const spamRate = (stats.spam_detected / stats.total_predictions) * 100
  const notSpamRate = (stats.not_spam_detected / stats.total_predictions) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Spam Distribution
        </CardTitle>
        <CardDescription>Visual breakdown of message classification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProgressBar
            value={stats.spam_detected}
            max={stats.total_predictions}
            label="Spam Messages"
            variant="danger"
            showPercentage={false}
          />
          <ProgressBar
            value={stats.not_spam_detected}
            max={stats.total_predictions}
            label="Not Spam Messages"
            variant="success"
            showPercentage={false}
          />
        </div>

        {/* Pie Chart Visualization */}
        <div className="mt-6 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                className="text-muted"
              />
              {/* Spam arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={`${spamRate * 2.51} ${(100 - spamRate) * 2.51}`}
                className="text-destructive"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{spamRate.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Spam Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
