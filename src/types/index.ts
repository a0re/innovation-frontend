/**
 * Core application types and interfaces
 */

// API Response Types
export interface PredictionResult {
  prediction: string
  confidence: number
  is_spam: boolean
}

export interface ClusterInfo {
  cluster_id: number
  confidence: number
  total_clusters: number
  top_terms: Array<{
    term: string
    score: number
  }>
}

export interface TopTerm {
  term: string
  score: number
}

export interface ClusterDetails {
  cluster_id: number
  num_terms: number
  top_terms: TopTerm[]
}

export interface MultiModelPrediction {
  message: string
  processed_message: string
  multinomial_nb: PredictionResult
  logistic_regression: PredictionResult
  linear_svc: PredictionResult
  ensemble: PredictionResult & {
    spam_votes: number
    total_votes: number
  }
  cluster: ClusterInfo | null
  timestamp: string
}

export interface BatchPredictionResponse {
  predictions: MultiModelPrediction[]
  total_processed: number
  spam_count: number
  not_spam_count: number
}

export interface StatsResponse {
  total_predictions: number
  spam_detected: number
  not_spam_detected: number
  average_confidence: number
}

export interface ClusterInfoResponse {
  total_clusters: number
  silhouette_score: number
  description: string
  clusters: ClusterDetails[]
}

export interface HealthResponse {
  status: string
  model_loaded: boolean
  timestamp: string
}

export interface HistoricalPredictionsResponse {
  predictions: MultiModelPrediction[]
  total_count: number
}

// UI Component Types
export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  variant?: "default" | "success" | "danger" | "warning"
}

export interface ErrorState {
  message: string
  retry?: () => void
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PageHeaderProps {
  title: string
  description?: string
}

// Data Analysis Types
export interface MonthlySpamType {
  month: string
  [key: string]: string | number
}
