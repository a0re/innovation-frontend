import { useCallback, useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { ErrorDisplay } from "@/components/common/ErrorDisplay"
import { DashboardHighlights } from "@/components/dashboard/DashboardHighlights"
import { RequestStreamChart } from "@/components/dashboard/RequestStreamChart"
import { ClusterDistributionChart } from "@/components/dashboard/ClusterDistributionChart"
import { RecentPredictionsTable } from "@/components/dashboard/RecentPredictionsTable"
import { MonthlySpamHeatmap } from "@/components/dashboard/MonthlySpamHeatmap"
import { api, APIError } from "@/lib/api-service"
import type {
  StatsResponse,
  TrendPoint,
  ClusterDistributionResponse,
  RecentPrediction,
  ClusterInfoResponse,
} from "@/types"

type TrendPeriod = "hour" | "day" | "week" | "month"

function resolveErrorMessage(error: unknown) {
  if (error instanceof APIError) {
    return `${error.endpoint}: ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Failed to load dashboard data"
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("day")
  const [trendData, setTrendData] = useState<TrendPoint[]>([])
  const [clusterDistribution, setClusterDistribution] = useState<ClusterDistributionResponse | null>(null)
  const [clusterInfo, setClusterInfo] = useState<ClusterInfoResponse | null>(null)
  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([])
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null)

  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [isTrendLoading, setIsTrendLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSummaryData = useCallback(async () => {
    setIsSummaryLoading(true)
    try {
      // Load core data first
      const [statsData, clusterData, recentData] = await Promise.all([
        api.getStats(),
        api.getClusterDistribution(),
        api.getRecentPredictions(2500),
      ])

      setStats(statsData)
      setClusterDistribution(clusterData)
      setRecentPredictions(recentData.predictions)
      
      // Try to load cluster info, but don't fail if it's not available
      try {
        const clusterInfoData = await api.getClusterInfo()
        setClusterInfo(clusterInfoData)
      } catch (clusterErr) {
        // Cluster info is optional - log but don't fail the whole page
        console.warn("Cluster info not available:", clusterErr)
        setClusterInfo(null)
      }
      
      setError(null)
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setIsSummaryLoading(false)
    }
  }, [])

  const loadTrendData = useCallback(async (nextPeriod: TrendPeriod) => {
    setIsTrendLoading(true)
    try {
      const limit = nextPeriod === "hour" ? 72 : 30
      const response = await api.getTrends(nextPeriod, limit)
      const ordered = response.data ? [...response.data].reverse() : []
      setTrendData(ordered)
      setTrendPeriod(nextPeriod)
      setError(null)
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setIsTrendLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummaryData()
    loadTrendData("day")
  }, [loadSummaryData, loadTrendData])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadSummaryData()
      loadTrendData(trendPeriod)
    }, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadSummaryData, loadTrendData, trendPeriod])

  useEffect(() => {
    if (selectedCluster === null) {
      return
    }
    const exists = clusterDistribution?.clusters?.some((cluster) => cluster.cluster_id === selectedCluster)
    if (!exists) {
      setSelectedCluster(null)
    }
  }, [clusterDistribution, selectedCluster])

  const handlePeriodChange = useCallback(
    (nextPeriod: TrendPeriod) => {
      if (nextPeriod === trendPeriod && trendData.length > 0) {
        return
      }
      loadTrendData(nextPeriod)
    },
    [trendPeriod, trendData.length, loadTrendData]
  )

  const clusterSeries = useMemo(() => clusterDistribution?.clusters ?? [], [clusterDistribution])
  const clusterTotal = clusterDistribution?.total_spam_with_clusters ?? 0
  const selectedClusterDetail = useMemo(
    () => clusterInfo?.clusters?.find((cluster) => cluster.cluster_id === selectedCluster) ?? null,
    [clusterInfo, selectedCluster],
  )
  const selectedClusterTopTerms = useMemo(
    () => selectedClusterDetail?.top_terms?.map((term) => term.term) ?? [],
    [selectedClusterDetail],
  )
  const selectedClusterLabel = useMemo(
    () => (selectedClusterTopTerms.length > 0 ? selectedClusterTopTerms.slice(0, 3).join(", ") : undefined),
    [selectedClusterTopTerms],
  )
  const filteredRecentPredictions = useMemo(() => {
    if (selectedCluster === null) {
      return recentPredictions
    }
    return recentPredictions.filter((prediction) => prediction.cluster_id === selectedCluster)
  }, [recentPredictions, selectedCluster])

  const handleRetry = useCallback(() => {
    loadSummaryData()
    loadTrendData(trendPeriod)
  }, [loadSummaryData, loadTrendData, trendPeriod])

  return (
    <main className="mx-auto w-full max-w-[100rem] space-y-12 px-4 pb-14 pt-8 sm:px-6 lg:px-12">
      <header className="space-y-4">
        <PageHeader
          title="Intelligence Dashboard"
          description="Monitor spam trends, model performance, and the health of your detection pipeline."
        />
        {error ? <ErrorDisplay message={error} onRetry={handleRetry} /> : null}
      </header>

      <section className="space-y-10">
        <DashboardHighlights
          stats={stats}
          trend={trendData}
          isLoading={isSummaryLoading || isTrendLoading}
        />

        <div className="grid gap-9 xl:grid-cols-[2fr_1fr] xl:items-start">
          <RequestStreamChart
            data={trendData}
            period={trendPeriod}
            onPeriodChange={handlePeriodChange}
            isLoading={isTrendLoading}
          />
          <ClusterDistributionChart
            clusters={clusterSeries}
            total={clusterTotal}
            clusterDetails={clusterInfo?.clusters}
            selectedCluster={selectedCluster}
            onSelectCluster={setSelectedCluster}
            isLoading={isSummaryLoading}
          />
        </div>

        <MonthlySpamHeatmap
          predictions={filteredRecentPredictions}
          isLoading={isSummaryLoading}
          activeCluster={
            selectedCluster !== null
              ? {
                  id: selectedCluster,
                  label: selectedClusterLabel,
                  topTerms: selectedClusterTopTerms,
                }
              : null
          }
        />

        <RecentPredictionsTable
          predictions={filteredRecentPredictions}
          isLoading={isSummaryLoading}
          activeCluster={
            selectedCluster !== null
              ? {
                  id: selectedCluster,
                  label: selectedClusterLabel,
                }
              : null
          }
        />
      </section>
    </main>
  )
}

export { DashboardPage as Dashboard }
