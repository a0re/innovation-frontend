import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { MultiModelPrediction, StatsResponse, ClusterInfoResponse } from '../lib/api';
import { TrendingUp, Target, Layers } from 'lucide-react';

interface ProfessionalAnalyticsProps {
  stats: StatsResponse | null;
  predictions: MultiModelPrediction[];
  clusterInfo: ClusterInfoResponse | null;
}

export function ProfessionalAnalytics({
  stats,
  predictions,
  clusterInfo,
}: ProfessionalAnalyticsProps) {
  // Generate confusion matrix data
  const confusionMatrix = generateConfusionMatrix(predictions);

  // Generate cluster treemap data
  const clusterTreemapData = generateClusterTreemap(predictions, clusterInfo);

  // Generate time series data (simulated with index)
  const timeSeriesData = generateTimeSeries(predictions);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Professional Analytics</h2>
        <p className="text-muted-foreground">
          Advanced metrics, confusion matrix, and cluster analysis
        </p>
      </div>

      {/* Confusion Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <CardTitle>Confusion Matrix</CardTitle>
          </div>
          <CardDescription>
            Model prediction accuracy visualization (simulated for demo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {predictions.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Header Row */}
                <div></div>
                <div className="text-center font-semibold">Predicted SPAM</div>
                <div className="text-center font-semibold">Predicted NOT SPAM</div>

                {/* Actual SPAM Row */}
                <div className="flex items-center justify-end font-semibold pr-4">
                  Actual SPAM
                </div>
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-white"
                  style={{ backgroundColor: getHeatColor(confusionMatrix.truePositive, 100) }}
                >
                  <div className="text-3xl font-bold">{confusionMatrix.truePositive}</div>
                  <div className="text-xs opacity-90">True Positive</div>
                </div>
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-white"
                  style={{ backgroundColor: getHeatColor(confusionMatrix.falseNegative, 100) }}
                >
                  <div className="text-3xl font-bold">{confusionMatrix.falseNegative}</div>
                  <div className="text-xs opacity-90">False Negative</div>
                </div>

                {/* Actual NOT SPAM Row */}
                <div className="flex items-center justify-end font-semibold pr-4">
                  Actual NOT SPAM
                </div>
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-white"
                  style={{ backgroundColor: getHeatColor(confusionMatrix.falsePositive, 100) }}
                >
                  <div className="text-3xl font-bold">{confusionMatrix.falsePositive}</div>
                  <div className="text-xs opacity-90">False Positive</div>
                </div>
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-white"
                  style={{ backgroundColor: getHeatColor(confusionMatrix.trueNegative, 100) }}
                >
                  <div className="text-3xl font-bold">{confusionMatrix.trueNegative}</div>
                  <div className="text-xs opacity-90">True Negative</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  label="Accuracy"
                  value={confusionMatrix.accuracy}
                  description="Overall correctness"
                />
                <MetricCard
                  label="Precision"
                  value={confusionMatrix.precision}
                  description="Spam detection accuracy"
                />
                <MetricCard
                  label="Recall"
                  value={confusionMatrix.recall}
                  description="Spam catch rate"
                />
                <MetricCard
                  label="F1 Score"
                  value={confusionMatrix.f1Score}
                  description="Balanced metric"
                />
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Note: This is simulated data based on model confidence for demonstration. In
                production, you'd track actual user feedback to calculate real accuracy.
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Make predictions to see confusion matrix
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cluster Treemap */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <CardTitle>Spam Cluster Distribution</CardTitle>
            </div>
            <CardDescription>Size represents spam messages per cluster</CardDescription>
          </CardHeader>
          <CardContent>
            {clusterTreemapData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <Treemap
                  data={clusterTreemapData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  fill="#8884d8"
                  content={<CustomTreemapContent />}
                >
                  <Tooltip content={<CustomTreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Classify spam messages to see cluster distribution
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confidence Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Confidence Trend</CardTitle>
            </div>
            <CardDescription>Model confidence over time</CardDescription>
          </CardHeader>
          <CardContent>
            {timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Confidence %"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgConfidence"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Moving Avg"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Make predictions to see confidence trend
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{(value * 100).toFixed(1)}%</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

// Custom Treemap Content
function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, size, colors } = props;

  if (width < 40 || height < 40) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors || '#8884d8',
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 10}
        textAnchor="middle"
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
      >
        {name}
      </text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#fff" fontSize={12}>
        {size} messages
      </text>
    </g>
  );
}

// Custom Treemap Tooltip
function CustomTreemapTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.size} spam messages</p>
      </div>
    );
  }
  return null;
}

// Helper Functions
function generateConfusionMatrix(predictions: MultiModelPrediction[]) {
  // For demo, simulate based on confidence
  // In production, you'd compare predictions to actual labels from user feedback
  let tp = 0,
    tn = 0,
    fp = 0,
    fn = 0;

  predictions.forEach((pred) => {
    const confidence = pred.ensemble.confidence;
    const isSpam = pred.ensemble.is_spam;

    // Simulate "ground truth" - high confidence is usually correct
    if (confidence > 0.85) {
      if (isSpam) tp++;
      else tn++;
    } else if (confidence > 0.6) {
      // Medium confidence - sometimes wrong
      if (Math.random() > 0.3) {
        if (isSpam) tp++;
        else tn++;
      } else {
        if (isSpam) fn++;
        else fp++;
      }
    } else {
      // Low confidence - often wrong
      if (Math.random() > 0.5) {
        if (isSpam) fn++;
        else fp++;
      } else {
        if (isSpam) tp++;
        else tn++;
      }
    }
  });

  const total = tp + tn + fp + fn || 1;
  const accuracy = (tp + tn) / total;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = (2 * precision * recall) / (precision + recall) || 0;

  return {
    truePositive: tp,
    trueNegative: tn,
    falsePositive: fp,
    falseNegative: fn,
    accuracy,
    precision,
    recall,
    f1Score,
  };
}

function generateClusterTreemap(
  predictions: MultiModelPrediction[],
  clusterInfo: ClusterInfoResponse | null
) {
  if (!clusterInfo) return [];

  // Count predictions per cluster
  const clusterCounts: Record<number, number> = {};

  predictions.forEach((pred) => {
    if (pred.cluster && pred.ensemble.is_spam) {
      clusterCounts[pred.cluster.cluster_id] = (clusterCounts[pred.cluster.cluster_id] || 0) + 1;
    }
  });

  // Generate colors
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  return Object.entries(clusterCounts).map(([clusterId, count], idx) => ({
    name: `Cluster ${clusterId}`,
    size: count,
    colors: colors[idx % colors.length],
  }));
}

function generateTimeSeries(predictions: MultiModelPrediction[]) {
  if (predictions.length === 0) return [];

  return predictions.slice(-30).map((pred, idx) => {
    // Calculate moving average (last 5 predictions)
    const start = Math.max(0, idx - 4);
    const recentPreds = predictions.slice(start, idx + 1);
    const avgConfidence =
      recentPreds.reduce((sum, p) => sum + p.ensemble.confidence * 100, 0) / recentPreds.length;

    return {
      index: idx + 1,
      confidence: pred.ensemble.confidence * 100,
      avgConfidence: avgConfidence,
    };
  });
}

function getHeatColor(value: number, max: number): string {
  const percentage = value / Math.max(max, 1);

  if (percentage > 0.7) return '#22c55e'; // Green - good
  if (percentage > 0.4) return '#f59e0b'; // Orange - medium
  if (percentage > 0.2) return '#ef4444'; // Red - low
  return '#94a3b8'; // Gray - very low
}
