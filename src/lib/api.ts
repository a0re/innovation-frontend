// API service for spam detection backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Response types
export type PredictionResult = {
  prediction: string;
  confidence: number;
  is_spam: boolean;
}

export type ClusterInfo = {
  cluster_id: number;
  confidence: number;
  total_clusters: number;
  top_terms: Array<{
    term: string;
    score: number;
  }>;
}

export type MultiModelPrediction = {
  message: string;
  processed_message: string;
  multinomial_nb: PredictionResult;
  logistic_regression: PredictionResult;
  linear_svc: PredictionResult;
  ensemble: PredictionResult & {
    spam_votes: number;
    total_votes: number;
  };
  cluster: ClusterInfo | null;
  timestamp: string;
}

export type BatchPredictionResponse = {
  predictions: MultiModelPrediction[];
  total_processed: number;
  spam_count: number;
  not_spam_count: number;
}

export type StatsResponse = {
  total_predictions: number;
  spam_detected: number;
  not_spam_detected: number;
  average_confidence: number;
}

export type ClusterDetails = {
  cluster_id: number;
  num_terms: number;
  top_terms: Array<{
    term: string;
    score: number;
  }>;
}

export type ClusterInfoResponse = {
  total_clusters: number;
  silhouette_score: number;
  description: string;
  clusters: ClusterDetails[];
}

export type HealthResponse = {
  status: string;
  model_loaded: boolean;
  timestamp: string;
}

// API functions
export const api = {
  // Health check
  async health(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },

  // Get statistics
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Single message prediction (multi-model)
  async predictMultiModel(message: string): Promise<MultiModelPrediction> {
    const response = await fetch(`${API_BASE_URL}/predict/multi-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Prediction failed');
    return response.json();
  },

  // Batch prediction (multi-model)
  async predictBatchMultiModel(messages: string[]): Promise<BatchPredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict/multi-model/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error('Batch prediction failed');
    return response.json();
  },

  // Get cluster information
  async getClusterInfo(): Promise<ClusterInfoResponse> {
    const response = await fetch(`${API_BASE_URL}/cluster/info`);
    if (!response.ok) throw new Error('Failed to fetch cluster info');
    return response.json();
  },

  // Get example messages
  async getExamples(): Promise<{ spam: string[]; not_spam: string[] }> {
    const response = await fetch(`${API_BASE_URL}/examples`);
    if (!response.ok) throw new Error('Failed to fetch examples');
    return response.json();
  },
};
