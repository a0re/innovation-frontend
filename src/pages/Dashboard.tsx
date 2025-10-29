import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  LineChart as LineChartIcon
} from "lucide-react"
import { api } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { aggregateMonthlySpamTypes, type MonthlySpamType } from "@/lib/monthlySpamAggregation"

export function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [clusterInfo, setClusterInfo] = useState<any>(null)
  const [examples, setExamples] = useState<any>(null)
  const [monthlySpamData, setMonthlySpamData] = useState<MonthlySpamType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, clusterData, examplesData, historicalData] = await Promise.all([
          api.getStats(),
          api.getClusterInfo(),
          api.getExamples(),
          api.getHistoricalPredictions()
        ])
        setStats(statsData)
        setClusterInfo(clusterData)
        setExamples(examplesData)

        // Aggregate monthly spam type data
        const monthlyData = aggregateMonthlySpamTypes(historicalData.predictions)
        setMonthlySpamData(monthlyData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const spamRate = stats ? (stats.spam_detected / stats.total_predictions) * 100 : 0
  const notSpamRate = stats ? (stats.not_spam_detected / stats.total_predictions) * 100 : 0

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Real-time spam detection analytics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_predictions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time messages analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spam Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.spam_detected || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {spamRate.toFixed(1)}% of total messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Spam</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {stats?.not_spam_detected || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {notSpamRate.toFixed(1)}% of total messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.average_confidence ? (stats.average_confidence * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Model certainty score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Spam Distribution Chart */}
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
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Spam Messages</span>
                  <span className="text-muted-foreground">{stats?.spam_detected || 0}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all"
                    style={{ width: `${spamRate}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Not Spam Messages</span>
                  <span className="text-muted-foreground">{stats?.not_spam_detected || 0}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${notSpamRate}%` }}
                  />
                </div>
              </div>
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

        {/* Cluster Analysis */}
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
                  <div className="text-2xl font-bold">{clusterInfo?.total_clusters || 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Silhouette Score</div>
                  <div className="text-2xl font-bold">
                    {clusterInfo?.silhouette_score ? clusterInfo.silhouette_score.toFixed(3) : "N/A"}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-3">Cluster Distribution</div>
                <div className="space-y-2">
                  {clusterInfo?.clusters?.map((cluster: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-md bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Cluster {cluster.cluster_id}</span>
                        <Badge variant="outline" className="text-xs">
                          {cluster.num_terms} terms
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.top_terms.slice(0, 4).map((term: any, termIdx: number) => (
                          <Badge key={termIdx} variant="secondary" className="text-xs">
                            {term.term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spam Type Frequency Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" />
            Most Frequent Spam Type - Monthly Trend
          </CardTitle>
          <CardDescription>Track the most common spam type detected each month</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySpamData.length > 0 ? (
            <>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySpamData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <YAxis
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as MonthlySpamType
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                              <div className="font-medium mb-2">{data.month}</div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Most Frequent:</span>
                                  <span className="font-medium">Type {data.mostFrequentType}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Frequency:</span>
                                  <span className="font-medium">{data.frequency}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Total Spam:</span>
                                  <span className="font-medium">{data.totalSpam}</span>
                                </div>
                                <div className="pt-2 border-t mt-2">
                                  <div className="text-muted-foreground mb-1">Top terms:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {data.topTerms.map((term, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {term}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="frequency"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium mb-2">Monthly Breakdown</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {monthlySpamData.map((data, idx) => (
                    <div key={idx} className="p-2 rounded-md bg-muted text-xs">
                      <div className="font-medium">{data.month}</div>
                      <div className="text-muted-foreground mt-1">
                        Type {data.mostFrequentType} ({data.frequency})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No historical data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Examples Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spam Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Spam Examples
            </CardTitle>
            <CardDescription>Sample messages classified as spam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {examples?.spam?.slice(0, 8).map((message: string, idx: number) => (
                <div key={idx} className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm line-clamp-2">{message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Not Spam Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Not Spam Examples
            </CardTitle>
            <CardDescription>Sample messages classified as legitimate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {examples?.not_spam?.slice(0, 8).map((message: string, idx: number) => (
                <div key={idx} className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                  <p className="text-sm line-clamp-2">{message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Info Footer */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Model Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Ensemble Approach</h4>
              <p className="text-sm text-muted-foreground">
                Uses voting from 3 machine learning models for robust predictions
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Models Used</h4>
              <div className="space-y-1">
                <Badge variant="outline" className="mr-1">Multinomial NB</Badge>
                <Badge variant="outline" className="mr-1">Logistic Regression</Badge>
                <Badge variant="outline">Linear SVC</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <p className="text-sm text-muted-foreground">
                TF-IDF vectorization with 22+ custom text features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
