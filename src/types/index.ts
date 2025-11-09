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
  name: string
  short_name: string
  description: string
  icon: string
  color: string
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
  name: string
  short_name: string
  description: string
  icon: string
  color: string
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

export interface BatchPrediction {
  message: string
  prediction: string
  confidence: number | null
  is_spam: boolean
  processed_message: string
  timestamp: string
  cluster: ClusterInfo | null
}

export interface BatchPredictionResponse {
  predictions: BatchPrediction[]
  total: number
  spam: number
  ham: number
  spam_rate: number
}

export interface StatsResponse {
  total_predictions: number
  spam_count: number
  ham_count: number
  spam_rate: number
  avg_confidence: number
  top_clusters?: Array<{
    cluster_id: number
    count: number
  }>
}

export interface TrendClusterBreakdown {
  cluster_id: number
  count: number
}

export interface TrendPoint {
  period: string
  total: number
  spam_count: number
  ham_count: number
  spam_rate: number
  avg_confidence: number
  clusters?: TrendClusterBreakdown[]
}

export interface TrendResponse {
  period: string
  data: TrendPoint[]
}

export interface ClusterDistributionItem {
  cluster_id: number
  name: string
  short_name: string
  icon: string
  color: string
  count: number
}

export interface ClusterDistributionResponse {
  total_spam_with_clusters: number
  clusters: ClusterDistributionItem[]
}

export interface ConfidenceBucket {
  bucket: string
  start: number
  end: number
  spam: number
  ham: number
  total: number
}

export interface ConfidenceDistributionSummary {
  total_predictions: number
  spam_mean_confidence: number
  ham_mean_confidence: number
  overall_mean_confidence: number
}

export interface ConfidenceDistributionResponse {
  buckets: ConfidenceBucket[]
  summary: ConfidenceDistributionSummary
}

export interface RecentPrediction {
  id?: number
  message: string
  prediction: string
  confidence: number
  is_spam: boolean
  cluster_id: number | null
  timestamp: string
  user_feedback?: string | null
}

export interface RecentPredictionsResponse {
  predictions: RecentPrediction[]
  count: number
}

export interface ClusterInfoResponse {
  total_clusters: number
  silhouette_score: number
  description: string
  clusters: ClusterDetails[]
}

export interface HealthResponse {
  status: string | null
  model: string | null
  models: string[]
  clusterer: boolean
  version: string
  timestamp: string
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
