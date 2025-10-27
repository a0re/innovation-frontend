import { useEffect, useState } from 'react';
import { StatsDashboard } from './StatsCharts';

interface StatsData {
  total_predictions: number;
  spam_detected: number;
  not_spam_detected: number;
  average_confidence: number;
}

export function StatsPage() {
  const [stats, setStats] = useState<StatsData>({
    total_predictions: 0,
    spam_detected: 0,
    not_spam_detected: 0,
    average_confidence: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Optional: Auto-refresh every 5 seconds
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Statistics</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spam Detection Statistics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics from your spam detection model
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </div>

      <StatsDashboard stats={stats} />

      {stats.total_predictions === 0 && (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            No predictions yet. Start making predictions to see statistics here.
          </p>
        </div>
      )}
    </div>
  );
}
