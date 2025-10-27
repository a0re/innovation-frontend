import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from 'recharts';
import type { StatsResponse, MultiModelPrediction } from '../lib/api';

interface EnhancedChartsProps {
  stats: StatsResponse | null;
  predictions: MultiModelPrediction[];
}

export function EnhancedCharts({ stats, predictions }: EnhancedChartsProps) {
  // Colors
  const COLORS = {
    spam: '#ef4444',
    notSpam: '#22c55e',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
  };

  // Pie chart data for spam distribution
  const spamDistributionData = stats
    ? [
        { name: 'Spam', value: stats.spam_detected, color: COLORS.spam },
        { name: 'Not Spam', value: stats.not_spam_detected, color: COLORS.notSpam },
      ]
    : [];

  // Model comparison data from predictions
  const modelComparisonData = predictions.length > 0
    ? [
        {
          name: 'Multinomial NB',
          accuracy: calculateModelAccuracy(predictions, 'multinomial_nb'),
          avgConfidence: calculateAvgConfidence(predictions, 'multinomial_nb'),
        },
        {
          name: 'Logistic Reg',
          accuracy: calculateModelAccuracy(predictions, 'logistic_regression'),
          avgConfidence: calculateAvgConfidence(predictions, 'logistic_regression'),
        },
        {
          name: 'Linear SVC',
          accuracy: calculateModelAccuracy(predictions, 'linear_svc'),
          avgConfidence: calculateAvgConfidence(predictions, 'linear_svc'),
        },
        {
          name: 'Ensemble',
          accuracy: calculateModelAccuracy(predictions, 'ensemble'),
          avgConfidence: calculateAvgConfidence(predictions, 'ensemble'),
        },
      ]
    : [];

  // Radar chart data for model performance
  const radarData = predictions.length > 0
    ? [
        {
          metric: 'Accuracy',
          'Multinomial NB': calculateModelAccuracy(predictions, 'multinomial_nb'),
          'Logistic Reg': calculateModelAccuracy(predictions, 'logistic_regression'),
          'Linear SVC': calculateModelAccuracy(predictions, 'linear_svc'),
        },
        {
          metric: 'Confidence',
          'Multinomial NB': calculateAvgConfidence(predictions, 'multinomial_nb'),
          'Logistic Reg': calculateAvgConfidence(predictions, 'logistic_regression'),
          'Linear SVC': calculateAvgConfidence(predictions, 'linear_svc'),
        },
        {
          metric: 'Agreement',
          'Multinomial NB': calculateAgreement(predictions, 'multinomial_nb'),
          'Logistic Reg': calculateAgreement(predictions, 'logistic_regression'),
          'Linear SVC': calculateAgreement(predictions, 'linear_svc'),
        },
      ]
    : [];

  // Confidence distribution data
  const confidenceDistribution = predictions.length > 0
    ? generateConfidenceDistribution(predictions)
    : [];

  // Prediction timeline
  const timelineData = predictions.length > 0
    ? predictions.slice(-20).map((pred, idx) => ({
        index: idx + 1,
        confidence: pred.ensemble.confidence * 100,
        isSpam: pred.ensemble.is_spam ? 1 : 0,
        label: pred.ensemble.is_spam ? 'Spam' : 'Not Spam',
      }))
    : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Model Comparison</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spam Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spam Distribution</CardTitle>
                <CardDescription>Total predictions breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {spamDistributionData.length > 0 && spamDistributionData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spamDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {spamDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No predictions yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics Summary</CardTitle>
                <CardDescription>Overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Predictions</span>
                        <span className="text-2xl font-bold">{stats.total_predictions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Spam Detected</span>
                        <span className="text-2xl font-bold text-red-500">
                          {stats.spam_detected}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Not Spam</span>
                        <span className="text-2xl font-bold text-green-500">
                          {stats.not_spam_detected}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Spam Rate</span>
                        <span className="text-2xl font-bold">
                          {stats.total_predictions > 0
                            ? ((stats.spam_detected / stats.total_predictions) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avg Confidence</span>
                        <span className="text-2xl font-bold">
                          {(stats.average_confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">Loading statistics...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Model Comparison Tab */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart - Model Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Average confidence by model</CardDescription>
              </CardHeader>
              <CardContent>
                {modelComparisonData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={modelComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgConfidence" fill={COLORS.primary} name="Avg Confidence %" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Make predictions to see model comparison
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Radar Chart - Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Model Analysis</CardTitle>
                <CardDescription>Multi-dimensional comparison</CardDescription>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Multinomial NB"
                        dataKey="Multinomial NB"
                        stroke={COLORS.spam}
                        fill={COLORS.spam}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Logistic Reg"
                        dataKey="Logistic Reg"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Linear SVC"
                        dataKey="Linear SVC"
                        stroke={COLORS.secondary}
                        fill={COLORS.secondary}
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Make predictions to see model analysis
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Confidence Tab */}
        <TabsContent value="confidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Distribution</CardTitle>
              <CardDescription>How confident the models are in their predictions</CardDescription>
            </CardHeader>
            <CardContent>
              {confidenceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={confidenceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={COLORS.primary} name="Number of Predictions" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Make predictions to see confidence distribution
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Timeline</CardTitle>
              <CardDescription>Last 20 predictions over time</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }} />
                    <YAxis domain={[0, 100]} label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.label}</p>
                              <p className="text-sm">Confidence: {data.confidence.toFixed(2)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Make predictions to see timeline
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function calculateModelAccuracy(
  predictions: MultiModelPrediction[],
  modelKey: 'multinomial_nb' | 'logistic_regression' | 'linear_svc' | 'ensemble'
): number {
  if (predictions.length === 0) return 0;
  // For demo purposes, we'll use confidence as a proxy for accuracy
  const totalConfidence = predictions.reduce((sum, pred) => {
    return sum + (pred[modelKey] as any).confidence * 100;
  }, 0);
  return totalConfidence / predictions.length;
}

function calculateAvgConfidence(
  predictions: MultiModelPrediction[],
  modelKey: 'multinomial_nb' | 'logistic_regression' | 'linear_svc' | 'ensemble'
): number {
  if (predictions.length === 0) return 0;
  const totalConfidence = predictions.reduce((sum, pred) => {
    return sum + (pred[modelKey] as any).confidence * 100;
  }, 0);
  return totalConfidence / predictions.length;
}

function calculateAgreement(
  predictions: MultiModelPrediction[],
  modelKey: 'multinomial_nb' | 'logistic_regression' | 'linear_svc'
): number {
  if (predictions.length === 0) return 0;
  const agreements = predictions.filter((pred) => {
    const modelPrediction = (pred[modelKey] as any).is_spam;
    const ensemblePrediction = pred.ensemble.is_spam;
    return modelPrediction === ensemblePrediction;
  }).length;
  return (agreements / predictions.length) * 100;
}

function generateConfidenceDistribution(predictions: MultiModelPrediction[]) {
  const ranges = [
    { range: '0-20%', min: 0, max: 0.2, count: 0 },
    { range: '20-40%', min: 0.2, max: 0.4, count: 0 },
    { range: '40-60%', min: 0.4, max: 0.6, count: 0 },
    { range: '60-80%', min: 0.6, max: 0.8, count: 0 },
    { range: '80-100%', min: 0.8, max: 1.0, count: 0 },
  ];

  predictions.forEach((pred) => {
    const confidence = pred.ensemble.confidence;
    const range = ranges.find((r) => confidence >= r.min && confidence <= r.max);
    if (range) range.count++;
  });

  return ranges;
}
