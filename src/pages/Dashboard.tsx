import React from "react"
import { BarChart3, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader, EmptyState } from "@/components/common"
import { useFetch } from "@/hooks"
import { api } from "@/lib/api-service"
import type { StatsResponse, ClusterInfoResponse, HistoricalPredictionsResponse } from "@/types"
import { aggregateMonthlySpamTypes } from "@/lib/monthlySpamAggregation"
import { Button } from "@/components/ui/button"
import { TimeSeriesChart, aggregateByMonth } from "@/components/charts"
import { StatisticsSection } from "@/components/dashboard/StatisticsSection"
import { SpamDistributionCard } from "@/components/dashboard/SpamDistributionCard"
import { ClusterAnalysisCard } from "@/components/dashboard/ClusterAnalysisCard"
import { MonthlyTrendCard } from "@/components/dashboard/MonthlyTrendCard"
import { ExamplesSection } from "@/components/dashboard/ExamplesSection"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"

/**
 * Dashboard page component - displays spam detection analytics and insights
 */
export function Dashboard() {
  // Fetch all dashboard data
  const { data: stats, loading, error, refetch } = useFetch<StatsResponse>(() => api.getStats())
  const { data: clusterInfo } = useFetch<ClusterInfoResponse>(() => api.getClusterInfo())
  const { data: examples } = useFetch<{ spam: string[]; not_spam: string[] }>(() =>
    api.getExamples()
  )
  const { data: historicalData } = useFetch<HistoricalPredictionsResponse>(() =>
    api.getHistoricalPredictions()
  )

  const monthlySpamData = React.useMemo(() => {
    if (!historicalData) return []
    return aggregateMonthlySpamTypes(historicalData.predictions)
  }, [historicalData])

  // Process time series data for the new chart
  const timeSeriesData = React.useMemo(() => {
    if (!historicalData?.predictions) return []
    return aggregateByMonth(historicalData.predictions)
  }, [historicalData])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    const isServiceUnavailable = error.includes("Service Unavailable") || error.includes("503")

    return (
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        <PageHeader title="Dashboard" description="Real-time spam detection analytics and insights" />
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {isServiceUnavailable ? "Backend Service Unavailable" : "Error Loading Dashboard"}
            </CardTitle>
            {isServiceUnavailable && (
              <p className="text-sm text-muted-foreground mt-2">The API server is not responding. Please ensure it's running.</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>

            {isServiceUnavailable && (
              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold">To fix this, try:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Open a terminal and run: <code className="bg-background px-2 py-1 rounded">./run-backend.sh</code></li>
                  <li>Wait for the message "Server running at: http://localhost:8000"</li>
                  <li>Then click "Retry" below</li>
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={refetch} variant="default">
                Retry
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasData = stats && stats.total_predictions > 0

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <PageHeader
        title="Dashboard"
        description="Real-time spam detection analytics and insights"
      />

      {!hasData && (
        <EmptyState
          icon={<BarChart3 className="h-16 w-16 text-muted-foreground" />}
          title="No Data Yet"
          description="Start testing messages to see analytics and insights appear here."
          action={
            <Button asChild>
              <a href="/model-test">Test Your First Message</a>
            </Button>
          }
        />
      )}

      {hasData && (
        <>
          {/* Statistics Cards */}
          <StatisticsSection stats={stats} />

          {/* Time Series Analysis */}
          {timeSeriesData.length > 0 && (
            <TimeSeriesChart
              data={timeSeriesData}
              title="Request Analysis Over Time"
              description="Track spam detection patterns, request frequency, and model confidence trends"
              showSummary={true}
              className="mb-6"
            />
          )}

          {/* Visualization Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <SpamDistributionCard stats={stats} />
            <ClusterAnalysisCard clusterInfo={clusterInfo} />
          </div>

          {/* Monthly Trend Chart */}
          {monthlySpamData.length > 0 && <MonthlyTrendCard data={monthlySpamData} />}

          {/* Examples Section */}
          {examples && <ExamplesSection examples={examples} />}
        </>
      )}
    </div>
  )
}
