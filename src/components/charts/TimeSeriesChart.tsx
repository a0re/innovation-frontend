import React from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { TooltipProps } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Calendar } from "lucide-react"

/**
 * Time series data point interface
 */
export interface TimeSeriesDataPoint {
  timestamp: string // ISO date string or formatted date
  date: string // Formatted display date (e.g., "Jan 2024")
  total_requests: number
  spam_count: number
  not_spam_count: number
  average_confidence: number
  spam_rate: number // percentage
}

/**
 * Component props
 */
interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  title?: string
  description?: string
  showSummary?: boolean
  className?: string
}

/**
 * Time Series Chart Component
 * Displays request frequency, spam detection rates, and confidence scores over time
 */
export function TimeSeriesChart({
  data,
  title = "Request Analysis Over Time",
  description = "Track spam detection patterns and model confidence trends",
  showSummary = true,
  className = "",
}: TimeSeriesChartProps) {
  // Calculate summary statistics
  const summary = React.useMemo(() => {
    if (!data || data.length === 0) return null

    const totalRequests = data.reduce((sum, d) => sum + d.total_requests, 0)
    const totalSpam = data.reduce((sum, d) => sum + d.spam_count, 0)
    const avgConfidence =
      data.reduce((sum, d) => sum + d.average_confidence, 0) / data.length

    const recentData = data.slice(-2)
    const trend =
      recentData.length === 2
        ? recentData[1].total_requests - recentData[0].total_requests
        : 0

    return {
      totalRequests,
      totalSpam,
      spamRate: totalRequests > 0 ? (totalSpam / totalRequests) * 100 : 0,
      avgConfidence,
      trend,
      trendPercentage:
        recentData[0]?.total_requests > 0
          ? ((trend / recentData[0].total_requests) * 100).toFixed(1)
          : "0",
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No time series data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Start making predictions to see trends over time</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {summary && showSummary && (
            <div className="flex items-center gap-2">
              {summary.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : summary.trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : null}
              <span className="text-sm text-muted-foreground">
                {summary.trend > 0 ? "+" : ""}
                {summary.trendPercentage}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        {summary && showSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <SummaryStat
              label="Total Requests"
              value={summary.totalRequests.toLocaleString()}
              icon={<Activity className="h-4 w-4" />}
            />
            <SummaryStat
              label="Spam Detected"
              value={summary.totalSpam.toLocaleString()}
              icon={<Activity className="h-4 w-4" />}
              variant="danger"
            />
            <SummaryStat
              label="Spam Rate"
              value={`${summary.spamRate.toFixed(1)}%`}
              icon={<Activity className="h-4 w-4" />}
            />
            <SummaryStat
              label="Avg Confidence"
              value={`${(summary.avgConfidence * 100).toFixed(1)}%`}
              icon={<Activity className="h-4 w-4" />}
              variant="success"
            />
          </div>
        )}

        {/* Chart Tabs */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Request Volume</TabsTrigger>
            <TabsTrigger value="detection">Spam Detection</TabsTrigger>
            <TabsTrigger value="confidence">Confidence Trends</TabsTrigger>
          </TabsList>

          {/* Request Volume Chart */}
          <TabsContent value="requests" className="mt-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "Requests", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_requests"
                  name="Total Requests"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Spam Detection Chart */}
          <TabsContent value="detection" className="mt-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "Count", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="spam_count"
                  name="Spam"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="not_spam_count"
                  name="Not Spam"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Confidence Trends Chart */}
          <TabsContent value="confidence" className="mt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  label={{ value: "Confidence", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip showConfidence />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average_confidence"
                  name="Avg Confidence"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="spam_rate"
                  name="Spam Rate (%)"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--destructive))", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {/* Data Points Info */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Showing data from {data.length} time periods
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Summary stat card component
 */
function SummaryStat({
  label,
  value,
  icon,
  variant = "default",
}: {
  label: string
  value: string
  icon?: React.ReactNode
  variant?: "default" | "success" | "danger"
}) {
  const variantStyles = {
    default: "bg-card border",
    success: "bg-emerald-500/5 border-emerald-500/20",
    danger: "bg-destructive/5 border-destructive/20",
  }

  return (
    <div className={`p-3 rounded-lg ${variantStyles[variant]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

/**
 * Custom tooltip for charts
 */
function CustomTooltip({
  active,
  payload,
  label,
  showConfidence = false,
}: TooltipProps<number, string> & { showConfidence?: boolean }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 space-y-2">
      <p className="font-semibold text-sm border-b pb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
          </div>
          <span className="font-medium">
            {showConfidence && entry.dataKey === "average_confidence"
              ? `${((entry.value as number) * 100).toFixed(1)}%`
              : typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Utility function to aggregate data by month
 */
export function aggregateByMonth(
  predictions: Array<{
    timestamp: string
    is_spam: boolean
    confidence: number
  }>
): TimeSeriesDataPoint[] {
  const monthlyData = new Map<string, TimeSeriesDataPoint>()

  predictions.forEach((pred) => {
    const date = new Date(pred.timestamp)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const displayDate = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        timestamp: monthKey,
        date: displayDate,
        total_requests: 0,
        spam_count: 0,
        not_spam_count: 0,
        average_confidence: 0,
        spam_rate: 0,
      })
    }

    const data = monthlyData.get(monthKey)!
    data.total_requests++
    if (pred.is_spam) {
      data.spam_count++
    } else {
      data.not_spam_count++
    }
    data.average_confidence += pred.confidence
  })

  // Calculate averages and percentages
  const result = Array.from(monthlyData.values()).map((data) => ({
    ...data,
    average_confidence: data.average_confidence / data.total_requests,
    spam_rate: (data.spam_count / data.total_requests) * 100,
  }))

  // Sort by timestamp
  return result.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

/**
 * Utility function to aggregate data by day
 */
export function aggregateByDay(
  predictions: Array<{
    timestamp: string
    is_spam: boolean
    confidence: number
  }>
): TimeSeriesDataPoint[] {
  const dailyData = new Map<string, TimeSeriesDataPoint>()

  predictions.forEach((pred) => {
    const date = new Date(pred.timestamp)
    const dayKey = date.toISOString().split("T")[0]
    const displayDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    if (!dailyData.has(dayKey)) {
      dailyData.set(dayKey, {
        timestamp: dayKey,
        date: displayDate,
        total_requests: 0,
        spam_count: 0,
        not_spam_count: 0,
        average_confidence: 0,
        spam_rate: 0,
      })
    }

    const data = dailyData.get(dayKey)!
    data.total_requests++
    if (pred.is_spam) {
      data.spam_count++
    } else {
      data.not_spam_count++
    }
    data.average_confidence += pred.confidence
  })

  // Calculate averages and percentages
  const result = Array.from(dailyData.values()).map((data) => ({
    ...data,
    average_confidence: data.average_confidence / data.total_requests,
    spam_rate: (data.spam_count / data.total_requests) * 100,
  }))

  // Sort by timestamp
  return result.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}
