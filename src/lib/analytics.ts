import { format, parseISO } from "date-fns"
import type { MultiModelPrediction } from "@/types"

export type AggregationGranularity = "day" | "week" | "month"

export interface RequestAggregationPoint {
  key: string
  label: string
  start: string
  total_requests: number
  spam_count: number
  ham_count: number
  average_confidence: number
  spam_rate: number
}

export interface ControlChartPoint extends RequestAggregationPoint {
  rolling_mean: number | null
  upper_bound: number | null
  lower_bound: number | null
  is_anomaly: boolean
}

const GRANULARITY_ORDER: AggregationGranularity[] = ["day", "week", "month"]

function getPeriodKey(date: Date, granularity: AggregationGranularity): { key: string; label: string } {
  switch (granularity) {
    case "day": {
      const key = format(date, "yyyy-MM-dd")
      return { key, label: format(date, "MMM d") }
    }
    case "week": {
      const key = `${format(date, "yyyy")}-W${format(date, "II")}`
      const startOfWeek = new Date(date)
      const diff = (startOfWeek.getDay() + 6) % 7
      startOfWeek.setDate(startOfWeek.getDate() - diff)
      return { key, label: `${format(startOfWeek, "MMM d")} • W${format(date, "II")}` }
    }
    case "month":
    default:
      return { key: format(date, "yyyy-MM"), label: format(date, "MMM yyyy") }
  }
}

export function aggregateRequests(
  predictions: MultiModelPrediction[],
  granularity: AggregationGranularity,
): RequestAggregationPoint[] {
  const buckets = new Map<string, RequestAggregationPoint>()

  predictions.forEach((prediction) => {
    const date = parseISO(prediction.timestamp)
    const { key, label } = getPeriodKey(date, granularity)

    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label,
        start: format(date, "yyyy-MM-dd"),
        total_requests: 0,
        spam_count: 0,
        ham_count: 0,
        average_confidence: 0,
        spam_rate: 0,
      })
    }

    const bucket = buckets.get(key)!
    bucket.total_requests += 1
    bucket.average_confidence += prediction.ensemble.confidence

    if (prediction.ensemble.is_spam) {
      bucket.spam_count += 1
    } else {
      bucket.ham_count += 1
    }
  })

  const result = Array.from(buckets.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((bucket) => {
      const avgConfidence = bucket.total_requests > 0 ? bucket.average_confidence / bucket.total_requests : 0
      const spamRate = bucket.total_requests > 0 ? bucket.spam_count / bucket.total_requests : 0
      return {
        ...bucket,
        average_confidence: avgConfidence,
        spam_rate: spamRate,
      }
    })

  return result
}

export function aggregateRequestsByGranularity(
  predictions: MultiModelPrediction[],
): Record<AggregationGranularity, RequestAggregationPoint[]> {
  return GRANULARITY_ORDER.reduce((acc, granularity) => {
    acc[granularity] = aggregateRequests(predictions, granularity)
    return acc
  }, {} as Record<AggregationGranularity, RequestAggregationPoint[]> )
}

export function computeControlChart(
  data: RequestAggregationPoint[],
  window = 4,
  stdMultiplier = 2,
): ControlChartPoint[] {
  if (data.length === 0) return []

  const values: ControlChartPoint[] = data.map((point, index) => {
    const startIndex = Math.max(0, index - window + 1)
    const windowPoints = data.slice(startIndex, index + 1)

    const mean = windowPoints.reduce((sum, item) => sum + item.total_requests, 0) / windowPoints.length

    let variance = 0
    if (windowPoints.length > 1) {
      variance = windowPoints.reduce((sum, item) => {
        const diff = item.total_requests - mean
        return sum + diff * diff
      }, 0) / (windowPoints.length - 1)
    }

    const stdDev = Math.sqrt(variance)
    const upper = mean + stdMultiplier * stdDev
    const lower = Math.max(mean - stdMultiplier * stdDev, 0)
    const isAnomaly = windowPoints.length >= window && (point.total_requests > upper || point.total_requests < lower)

    return {
      ...point,
      rolling_mean: windowPoints.length >= 2 ? mean : null,
      upper_bound: windowPoints.length >= 2 ? upper : null,
      lower_bound: windowPoints.length >= 2 ? lower : null,
      is_anomaly: isAnomaly,
    }
  })

  return values
}

export function computeDeltaPercentage(current: number, previous: number | null): number | null {
  if (previous === null || previous === 0) {
    return null
  }
  return ((current - previous) / previous) * 100
}

export function summariseRecentWindow(
  data: RequestAggregationPoint[],
): { current?: RequestAggregationPoint; previous?: RequestAggregationPoint } {
  if (data.length === 0) return {}
  if (data.length === 1) return { current: data[0] }
  return { current: data[data.length - 1], previous: data[data.length - 2] }
}