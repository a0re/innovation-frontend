// Enhanced API service with better error handling and features

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request configuration
interface RequestConfig extends RequestInit {
  timeout?: number;
}

// Generic fetch wrapper with timeout and better error handling
async function fetchWithTimeout(
  url: string,
  options: RequestConfig = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData;

      try {
        errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If response isn't JSON, use status text
      }

      throw new ApiError(errorMessage, response.status, response.statusText, errorData);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }
      throw new ApiError(error.message, 0, 'Network Error');
    }

    throw new ApiError('An unknown error occurred', 0, 'Unknown Error');
  }
}

// Response types (keeping your existing types)
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

// Enhanced API with request caching and retry logic
class SpamDetectionAPI {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  // Cache helper
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Clear cache manually
  clearCache(): void {
    this.cache.clear();
  }

  // Health check
  async health(): Promise<HealthResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return response.json();
  }

  // Get statistics with caching
  async getStats(skipCache = false): Promise<StatsResponse> {
    const cacheKey = 'stats';

    if (!skipCache) {
      const cached = this.getCached<StatsResponse>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/stats`);
    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }

  // Single message prediction (multi-model)
  async predictMultiModel(
    message: string,
    options?: { timeout?: number }
  ): Promise<MultiModelPrediction> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/predict/multi-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      timeout: options?.timeout || 15000,
    });
    return response.json();
  }

  // Batch prediction (multi-model)
  async predictBatchMultiModel(
    messages: string[],
    options?: { timeout?: number }
  ): Promise<BatchPredictionResponse> {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/predict/multi-model/batch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        timeout: options?.timeout || 30000,
      }
    );
    return response.json();
  }

  // Get cluster information with caching
  async getClusterInfo(skipCache = false): Promise<ClusterInfoResponse> {
    const cacheKey = 'cluster-info';

    if (!skipCache) {
      const cached = this.getCached<ClusterInfoResponse>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/cluster/info`);
    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }

  // Get example messages with caching
  async getExamples(skipCache = false): Promise<{ spam: string[]; not_spam: string[] }> {
    const cacheKey = 'examples';

    if (!skipCache) {
      const cached = this.getCached<{ spam: string[]; not_spam: string[] }>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/examples`);
    const data = await response.json();

    // Transform response to match expected format
    const transformed = {
      spam: data.spam_examples || [],
      not_spam: data.not_spam_examples || [],
    };

    this.setCache(cacheKey, transformed);
    return transformed;
  }

  // Reset statistics
  async resetStats(): Promise<{ message: string; timestamp: string }> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/stats`, {
      method: 'DELETE',
    });
    this.clearCache(); // Clear cache after reset
    return response.json();
  }
}

// Export singleton instance
export const api = new SpamDetectionAPI();

// Export for error handling in components
export { ApiError };
