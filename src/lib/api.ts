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

export type HistoricalPredictionsResponse = {
  predictions: MultiModelPrediction[];
  total_count: number;
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

  // Get historical predictions (if backend supports it)
  async getHistoricalPredictions(): Promise<HistoricalPredictionsResponse> {
    const response = await fetch(`${API_BASE_URL}/predictions/history`);
    if (!response.ok) {
      // If endpoint doesn't exist, return mock data for demonstration
      return this.getMockHistoricalData();
    }
    return response.json();
  },

  // Mock data for demonstration when backend doesn't have historical data
  getMockHistoricalData(): HistoricalPredictionsResponse {
    const spamTypes = [
      { id: 0, terms: ['prize', 'winner', 'claim', 'free'] },
      { id: 1, terms: ['urgent', 'account', 'verify', 'suspend'] },
      { id: 2, terms: ['loan', 'cash', 'offer', 'limited'] },
      { id: 3, terms: ['click', 'link', 'download', 'here'] },
    ];

    const predictions: MultiModelPrediction[] = [];
    const now = new Date();

    // Generate 6 months of data
    for (let month = 5; month >= 0; month--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);

      // Generate 20-50 predictions per month
      const numPredictions = Math.floor(Math.random() * 30) + 20;

      for (let i = 0; i < numPredictions; i++) {
        const dayOffset = Math.floor(Math.random() * 28);
        const timestamp = new Date(monthDate);
        timestamp.setDate(timestamp.getDate() + dayOffset);

        // Randomly select a spam type (cluster)
        const spamType = spamTypes[Math.floor(Math.random() * spamTypes.length)];

        predictions.push({
          message: `Sample spam message ${i}`,
          processed_message: `processed spam ${i}`,
          multinomial_nb: {
            prediction: 'spam',
            confidence: 0.85 + Math.random() * 0.15,
            is_spam: true,
          },
          logistic_regression: {
            prediction: 'spam',
            confidence: 0.80 + Math.random() * 0.20,
            is_spam: true,
          },
          linear_svc: {
            prediction: 'spam',
            confidence: 0.88 + Math.random() * 0.12,
            is_spam: true,
          },
          ensemble: {
            prediction: 'spam',
            confidence: 0.87 + Math.random() * 0.13,
            is_spam: true,
            spam_votes: 3,
            total_votes: 3,
          },
          cluster: {
            cluster_id: spamType.id,
            confidence: 0.75 + Math.random() * 0.25,
            total_clusters: spamTypes.length,
            top_terms: spamType.terms.map((term, idx) => ({
              term,
              score: 0.9 - idx * 0.1,
            })),
          },
          timestamp: timestamp.toISOString(),
        });
      }
    }

    return {
      predictions,
      total_count: predictions.length,
    };
  },
};
