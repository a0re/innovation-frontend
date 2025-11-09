/**
 * Application constants
 * Note: Routes are configured in @/config/routes.ts
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const API_ENDPOINTS = {
  HEALTH: "/health",
  STATS: "/stats",
  PREDICT: "/predict",
  PREDICT_MULTI_MODEL: "/predict/multi-model",
  PREDICT_BATCH: "/predict/batch",
  PREDICTIONS_RECENT: "/predictions/recent",
  PREDICTIONS_DELETE: "/predictions",
  TRENDS: "/trends",
  ANALYTICS_CLUSTERS: "/analytics/clusters",
  CLUSTER_INFO: "/cluster/info",
} as const

// Request Configuration
export const REQUEST_TIMEOUT = 30000 // 30 seconds
export const RETRY_ATTEMPTS = 3
export const RETRY_DELAY = 1000 // 1 second

// UI Configuration
export const CONTAINER_MAX_WIDTH = "7xl"
export const MOBILE_BREAKPOINT = "md"

// Prediction Thresholds
export const SPAM_CONFIDENCE_THRESHOLD = 0.5
export const HIGH_CONFIDENCE_THRESHOLD = 0.85
export const LOW_CONFIDENCE_THRESHOLD = 0.15

// Messages and Copy
export const MESSAGES = {
  EMPTY_STATE: {
    TITLE: "No Data Yet",
    DESCRIPTION: "Start testing messages to see analytics and insights appear here.",
    ACTION: "Test Your First Message",
  },
  ERRORS: {
    HEALTH_CHECK_FAILED: "Health check failed",
    FETCH_STATS_FAILED: "Failed to fetch stats",
    PREDICTION_FAILED: "Prediction failed",
    BATCH_PREDICTION_FAILED: "Batch prediction failed",
    FETCH_CLUSTER_INFO_FAILED: "Failed to fetch cluster info",
    FETCH_EXAMPLES_FAILED: "Failed to fetch examples",
    FETCH_DATA_FAILED: "Failed to fetch data",
    FILE_READ_FAILED: "Failed to read file",
    ANALYSIS_FAILED: "Analysis failed",
  },
  LOADING: {
    FETCHING_DATA: "Fetching data...",
    ANALYZING: "Analyzing message...",
    PROCESSING_BATCH: "Processing batch...",
  },
  SUCCESS: {
    ANALYSIS_COMPLETE: "Analysis complete",
  },
} as const

// Cluster Configuration
export const CLUSTER_CONFIG = {
  DEFAULT_K: 8,
  MIN_CLUSTERS: 2,
  MAX_CLUSTERS: 10,
} as const

// Data Export Configuration
export const EXPORT_CONFIG = {
  BATCH_RESULTS_FILENAME: "spam_detection_results.csv",
  CSV_HEADERS: ["Message", "Prediction", "Confidence", "Cluster", "Timestamp"],
} as const

// Visualization
export const CHART_COLORS = {
  SPAM: "hsl(var(--destructive))",
  NOT_SPAM: "hsl(var(--primary))",
  NEUTRAL: "hsl(var(--muted))",
} as const

// Mock Data
export const MOCK_SPAM_TYPES = [
  { id: 0, terms: ["prize", "winner", "claim", "free"] },
  { id: 1, terms: ["urgent", "account", "verify", "suspend"] },
  { id: 2, terms: ["loan", "cash", "offer", "limited"] },
  { id: 3, terms: ["click", "link", "download", "here"] },
] as const
