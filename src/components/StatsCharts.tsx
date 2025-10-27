import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StatsData {
  total_predictions: number;
  spam_detected: number;
  not_spam_detected: number;
  average_confidence: number;
}

// Pie Chart Component - Spam vs Not Spam
export function SpamDistributionPieChart({ stats }: { stats: StatsData }) {
  const data = [
    { name: 'Spam Detected', value: stats.spam_detected },
    { name: 'Not Spam', value: stats.not_spam_detected },
  ];

  const COLORS = ['#ef4444', '#22c55e']; // Red for spam, Green for not spam

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Spam Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Total Predictions: {stats.total_predictions}
      </div>
    </div>
  );
}

// Bar Chart Component - Overall Statistics
export function OverallStatsBarChart({ stats }: { stats: StatsData }) {
  const data = [
    { name: 'Total', value: stats.total_predictions, fill: '#3b82f6' },
    { name: 'Spam', value: stats.spam_detected, fill: '#ef4444' },
    { name: 'Not Spam', value: stats.not_spam_detected, fill: '#22c55e' },
  ];

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Prediction Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Confidence Gauge Component (using Bar as gauge)
export function ConfidenceGauge({ stats }: { stats: StatsData }) {
  const confidencePercent = (stats.average_confidence * 100).toFixed(1);

  // Create data for a horizontal bar gauge
  const data = [
    { name: 'Confidence', value: stats.average_confidence * 100 }
  ];

  const getConfidenceColor = (value: number) => {
    if (value >= 75) return '#22c55e'; // Green
    if (value >= 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Average Confidence</h3>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: getConfidenceColor(stats.average_confidence * 100) }}>
            {confidencePercent}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">Model Confidence</div>
        </div>

        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${confidencePercent}%`,
              backgroundColor: getConfidenceColor(stats.average_confidence * 100)
            }}
          />
        </div>

        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="value"
              fill={getConfidenceColor(stats.average_confidence * 100)}
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

// Combined Dashboard
export function StatsDashboard({ stats }: { stats: StatsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SpamDistributionPieChart stats={stats} />
      <OverallStatsBarChart stats={stats} />
      <ConfidenceGauge stats={stats} />
    </div>
  );
}
