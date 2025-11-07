import { API_BASE_URL, API_ENDPOINTS } from "@/constants"
import type {
  MultiModelPrediction,
  BatchPredictionResponse,
  StatsResponse,
  ClusterInfoResponse,
  HealthResponse,
  HistoricalPredictionsResponse,
} from "@/types"

/**
 * API error class for better error handling
 */
export class APIError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "APIError"
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new APIError(response.status, `API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new Error(error instanceof Error ? error.message : "Network error")
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

  // Single message prediction
  predictMultiModel(message: string): Promise<MultiModelPrediction> {
    return apiCall(API_ENDPOINTS.PREDICT_MULTI_MODEL, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  },

  // Batch prediction
  predictBatchMultiModel(messages: string[]): Promise<BatchPredictionResponse> {
    return apiCall(API_ENDPOINTS.PREDICT_BATCH, {
      method: "POST",
      body: JSON.stringify({ messages }),
    })
  },

  // Cluster information
  getClusterInfo(): Promise<ClusterInfoResponse> {
    return apiCall(API_ENDPOINTS.CLUSTER_INFO)
  },

  // Example messages
  getExamples(): Promise<{ spam: string[]; not_spam: string[] }> {
    return apiCall(API_ENDPOINTS.EXAMPLES)
  },

  // Historical predictions
  getHistoricalPredictions(): Promise<HistoricalPredictionsResponse> {
    return apiCall<HistoricalPredictionsResponse>(API_ENDPOINTS.PREDICTIONS_HISTORY).catch(() => {
      // Return mock data if endpoint doesn't exist
      return getMockHistoricalData()
    })
  },
}

/**
 * Mock data generator for development/testing
 */
function getMockHistoricalData(): HistoricalPredictionsResponse {
  const predictions: MultiModelPrediction[] = []
  const spamMessages = [
    "Congratulations! You won a FREE prize! Click here to claim now",
    "URGENT: Verify your account immediately to avoid suspension",
    "Get instant CASH loans approved in minutes - No credit check",
    "You have been selected for an exclusive offer - Limited time only",
    "Click this link to download your free gift card",
  ]

  const notSpamMessages = [
    "Hey, did you see the latest blog post?",
    "Meeting scheduled for tomorrow at 2 PM",
    "Thanks for reaching out, I appreciate your help",
    "The project is on track for completion",
    "Just wanted to check in and see how you are doing",
  ]

  // Create mock predictions
  ;[...spamMessages, ...notSpamMessages].forEach((message, index) => {
    const isSpam = index < spamMessages.length
    predictions.push({
      message,
      processed_message: message.toLowerCase(),
      multinomial_nb: {
        prediction: isSpam ? "spam" : "not_spam",
        confidence: Math.random() * 0.4 + (isSpam ? 0.5 : 0),
        is_spam: isSpam,
      },
      logistic_regression: {
        prediction: isSpam ? "spam" : "not_spam",
        confidence: Math.random() * 0.4 + (isSpam ? 0.5 : 0),
        is_spam: isSpam,
      },
      linear_svc: {
        prediction: isSpam ? "spam" : "not_spam",
        confidence: Math.random() * 0.4 + (isSpam ? 0.5 : 0),
        is_spam: isSpam,
      },
      ensemble: {
        prediction: isSpam ? "spam" : "not_spam",
        confidence: Math.random() * 0.3 + (isSpam ? 0.7 : 0.2),
        is_spam: isSpam,
        spam_votes: isSpam ? Math.floor(Math.random() * 2) + 2 : 0,
        total_votes: 3,
      },
      cluster: {
        cluster_id: Math.floor(Math.random() * 8),
        confidence: Math.random() * 0.5 + 0.3,
        total_clusters: 8,
        top_terms: [
          { term: "free", score: 0.8 },
          { term: "click", score: 0.7 },
          { term: "winner", score: 0.6 },
        ],
      },
      timestamp: new Date().toISOString(),
    })
  })

  return {
    predictions,
    total_count: predictions.length,
  }
}
