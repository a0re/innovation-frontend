// Example of how to integrate the stats charts into your App.tsx

import { StatsPage } from './components/StatsPage';

// Option 1: Use the complete StatsPage component
function App() {
  return <StatsPage />;
}

// Option 2: Use individual chart components
import { useState, useEffect } from 'react';
import { SpamDistributionPieChart, OverallStatsBarChart, ConfidenceGauge } from './components/StatsCharts';

function AppWithIndividualCharts() {
  const [stats, setStats] = useState({
    total_predictions: 0,
    spam_detected: 0,
    not_spam_detected: 0,
    average_confidence: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('http://localhost:8080/stats');
      const data = await response.json();
      setStats(data);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Spam Detection Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpamDistributionPieChart stats={stats} />
        <ConfidenceGauge stats={stats} />
      </div>

      <div className="mt-6">
        <OverallStatsBarChart stats={stats} />
      </div>
    </div>
  );
}

export default App;
