import { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT } from "@/constants"
import type {
  MultiModelPrediction,
  BatchPredictionResponse,
  BatchPrediction,
  StatsResponse,
  HealthResponse,
  TrendResponse,
  ClusterDistributionResponse,
  RecentPredictionsResponse,
  RecentPrediction,
  ClusterInfoResponse,
  PredictionResult,
  ClusterInfo,
} from "@/types"

type RawModelPrediction = {
  model: string
  prediction: string
  confidence: number
  is_spam: boolean
}

type RawMultiModelResponse = {
  message: string
  models: RawModelPrediction[]
  ensemble: {
    prediction: string
    confidence: number
    is_spam: boolean
    votes?: number
    spam_votes?: number
    total_models?: number
    total_votes?: number
  }
  processed_message?: string
  timestamp: string
  cluster?: ClusterInfo | null
}

type RawBatchPrediction = {
  message?: string
  prediction?: string
  confidence?: number | string | null
  is_spam?: boolean | string | null
  processed_message?: string | null
  timestamp?: string | null
  cluster?: ClusterInfo | Record<string, unknown> | null
}

type RawBatchPredictionResponse = {
  predictions?: RawBatchPrediction[] | null
  total?: number | string | null
  spam?: number | string | null
  ham?: number | string | null
  spam_rate?: number | string | null
}

type RawRecentPrediction = {
  id?: number | string | null
  message?: string | null
  prediction?: string | null
  confidence?: number | string | null
  is_spam?: boolean | string | null
  cluster_id?: number | string | null
  timestamp?: string | null
  user_feedback?: string | null
}

type RawRecentPredictionsResponse = {
  predictions?: RawRecentPrediction[] | null
  count?: number | string | null
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function normalizeBatchPrediction(raw: RawBatchPrediction): BatchPrediction {
  const predictionLabel = raw.prediction ?? "not_spam"
  const rawConfidence = toNumber(raw.confidence)
  const isSpamFlag =
    typeof raw.is_spam === "boolean"
      ? raw.is_spam
      : typeof raw.is_spam === "string"
        ? raw.is_spam.toLowerCase() === "spam" || raw.is_spam.toLowerCase() === "true"
        : predictionLabel === "spam"

  const rawCluster = (raw as unknown as { cluster?: ClusterInfo | Record<string, unknown> | null }).cluster ?? null
  let cluster: ClusterInfo | null = null
  if (rawCluster && typeof rawCluster === "object") {
    const asAny = rawCluster as unknown as Record<string, unknown>
    const clusterId = toNumber(asAny.cluster_id as number | string | null | undefined)
    const totalClusters = toNumber(asAny.total_clusters as number | string | null | undefined)
    const clusterConfidence = toNumber(asAny.confidence as number | string | null | undefined)

    const topTermsSource = Array.isArray(asAny.top_terms) ? (asAny.top_terms as unknown[]) : []
    const topTerms = topTermsSource
      .map((item) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>
          return {
            term: String(record.term ?? ""),
            score:
              toNumber(record.score as number | string | null | undefined) ?? 0,
          }
        }
        if (Array.isArray(item) && item.length > 0) {
          return {
            term: String(item[0] ?? ""),
            score: toNumber(item[1] as number | string | null | undefined) ?? 0,
          }
        }
        return null
      })
      .filter((entry): entry is { term: string; score: number } => Boolean(entry))

    cluster = {
      cluster_id: clusterId ?? 0,
      name: String(asAny.name ?? ""),
      short_name: String(asAny.short_name ?? asAny.name ?? ""),
      description: String(asAny.description ?? ""),
      icon: String(asAny.icon ?? ""),
      color: String(asAny.color ?? ""),
      confidence: clusterConfidence ?? 0,
      total_clusters: totalClusters ?? (topTerms.length || 0),
      top_terms: topTerms,
    }
  }

  return {
    message: raw.message ?? "",
    prediction: predictionLabel,
    confidence: rawConfidence,
    is_spam: isSpamFlag,
    processed_message: raw.processed_message ?? raw.message ?? "",
    timestamp: raw.timestamp ?? new Date().toISOString(),
    cluster,
  }
}

function normalizeBatchResponse(raw: RawBatchPredictionResponse): BatchPredictionResponse {
  const predictions = (raw.predictions ?? []).map(normalizeBatchPrediction)

  const rawTotal = toNumber(raw.total)
  const rawSpam = toNumber(raw.spam)
  const rawHam = toNumber(raw.ham)
  const rawRate = toNumber(raw.spam_rate)

  const derivedTotal = rawTotal !== null ? rawTotal : predictions.length
  const derivedSpam =
    rawSpam !== null
      ? rawSpam
      : predictions.filter((prediction) => prediction.is_spam).length
  const derivedHam = rawHam !== null ? rawHam : Math.max(derivedTotal - derivedSpam, 0)
  const derivedRate =
    derivedTotal > 0
      ? rawRate !== null
        ? rawRate
        : Number((derivedSpam / derivedTotal).toFixed(4))
      : 0

  return {
    predictions,
    total: derivedTotal,
    spam: derivedSpam,
    ham: derivedHam,
    spam_rate: derivedRate,
  }
}

function normalizeRecentPrediction(raw: RawRecentPrediction): RecentPrediction {
  const id = toNumber(raw.id)
  const confidence = toNumber(raw.confidence)

  let clusterId = toNumber(raw.cluster_id)
  if (clusterId === null && typeof raw.cluster_id === "string") {
    const match = raw.cluster_id.match(/-?\d+/)
    if (match) {
      const parsed = Number(match[0])
      if (Number.isFinite(parsed)) {
        clusterId = parsed
      }
    }
  }

  const normalizedPrediction = (raw.prediction ?? "not_spam").toLowerCase()
  let isSpam = normalizedPrediction === "spam"

  if (typeof raw.is_spam === "boolean") {
    isSpam = raw.is_spam
  } else if (typeof raw.is_spam === "string") {
    const flag = raw.is_spam.trim().toLowerCase()
    isSpam = flag === "spam" || flag === "true" || flag === "1"
  }

  return {
    id: id ?? undefined,
    message: raw.message ?? "",
    prediction: isSpam ? "spam" : "not_spam",
    confidence: confidence ?? 0,
    is_spam: isSpam,
    cluster_id: clusterId,
    timestamp: raw.timestamp ?? new Date().toISOString(),
    user_feedback: raw.user_feedback ?? null,
  }
}

function normalizeRecentPredictionsResponse(raw: RawRecentPredictionsResponse): RecentPredictionsResponse {
  const predictions = (raw.predictions ?? []).map(normalizeRecentPrediction)
  const count = toNumber(raw.count)

  return {
    predictions,
    count: count ?? predictions.length,
  }
}

/**
 * API error class for better error handling
 */
export class APIError extends Error {
  status: number
  endpoint: string

  constructor(status: number, message: string, endpoint: string) {
    super(message)
    this.status = status
    this.endpoint = endpoint
    this.name = "APIError"
  }
}

/**
 * Generic fetch wrapper with error handling and timeout
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = response.statusText
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.error || errorMessage
      } catch {
        // Failed to parse error response, use statusText
      }
      throw new APIError(response.status, errorMessage, endpoint)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError(408, "Request timeout", endpoint)
    }

    throw new APIError(0, error instanceof Error ? error.message : "Network error", endpoint)
  }
}

/**
 * Main API service object with all endpoints
 */
export const api = {
  // Health check
  health(): Promise<HealthResponse> {
    return apiCall(API_ENDPOINTS.HEALTH)
  },

  // Statistics
  getStats(): Promise<StatsResponse> {
    return apiCall(API_ENDPOINTS.STATS)
  },

  // Single message prediction (multi-model)
  async predictMultiModel(message: string): Promise<MultiModelPrediction> {
    const response = await apiCall<RawMultiModelResponse>(API_ENDPOINTS.PREDICT_MULTI_MODEL, {
      method: "POST",
      body: JSON.stringify({ message }),
    })

    // Transform backend response to match frontend type
    const modelMap: Record<string, RawModelPrediction> = {}
    response.models.forEach((modelResult) => {
      modelMap[modelResult.model] = {
        model: modelResult.model,
        prediction: modelResult.prediction,
        confidence: modelResult.confidence,
        is_spam: modelResult.is_spam,
      }
    })

    const asPrediction = (result?: RawModelPrediction): PredictionResult => ({
      prediction: result?.prediction ?? "not_spam",
      confidence: result?.confidence ?? 0.5,
      is_spam: result?.is_spam ?? false,
    })

    // Get cluster info if available (mock for now)
    const cluster = response.cluster ?? null

    return {
      message: response.message,
      processed_message: response.processed_message ?? response.message,
      multinomial_nb: asPrediction(modelMap["multinomial_nb"]),
      logistic_regression: asPrediction(modelMap["logistic_regression"]),
      linear_svc: asPrediction(modelMap["linear_svc"]),
      ensemble: {
        prediction: response.ensemble.prediction,
        confidence: response.ensemble.confidence,
        is_spam: response.ensemble.is_spam,
        spam_votes: response.ensemble.votes || response.ensemble.spam_votes || 0,
        total_votes: response.ensemble.total_models || response.ensemble.total_votes || 0,
      },
      cluster,
      timestamp: response.timestamp,
    }
  },

  // Batch prediction
  async predictBatch(messages: string[]): Promise<BatchPredictionResponse> {
    const endpoint = API_ENDPOINTS.PREDICT_BATCH
    const rawResponse = await apiCall<RawBatchPredictionResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ messages }),
    })
    return normalizeBatchResponse(rawResponse)
  },

  // Get recent predictions
  async getRecentPredictions(limit = 100): Promise<RecentPredictionsResponse> {
    const raw = await apiCall<RawRecentPredictionsResponse>(
      `${API_ENDPOINTS.PREDICTIONS_RECENT}?limit=${limit}`,
    )
    return normalizeRecentPredictionsResponse(raw)
  },

  // Get trends data
  getTrends(period: "hour" | "day" | "week" | "month" = "day", limit = 30): Promise<TrendResponse> {
    return apiCall(`${API_ENDPOINTS.TRENDS}?period=${period}&limit=${limit}`)
  },

  // Analytics endpoints
  getClusterDistribution(): Promise<ClusterDistributionResponse> {
    return apiCall(API_ENDPOINTS.ANALYTICS_CLUSTERS)
  },

  async getClusterInfo(): Promise<ClusterInfoResponse> {
    try {
      return await apiCall(API_ENDPOINTS.CLUSTER_INFO)
    } catch {
      return {
        total_clusters: 0,
        silhouette_score: 0,
        description: "Cluster information unavailable",
        clusters: [],
      }
    }
  },

  // Delete all predictions
  deleteAllPredictions(): Promise<{ message: string; timestamp: string }> {
    return apiCall(API_ENDPOINTS.PREDICTIONS_DELETE, {
      method: "DELETE",
    })
  },
}
