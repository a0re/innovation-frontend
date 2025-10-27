import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Cell,
  ComposedChart,
  Bar,
  Line,
  Area,
  Legend,
  PieChart,
  Pie,
  Sector,
  FunnelChart,
  Funnel,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Rectangle,
} from 'recharts';
import type { MultiModelPrediction, StatsResponse } from '../lib/api';
import { FlaskConical, Network, Layers, Target } from 'lucide-react';
import { useState } from 'react';

interface ExperimentalChartsProps {
  stats: StatsResponse | null;
  predictions: MultiModelPrediction[];
}

export function ExperimentalCharts({ stats, predictions }: ExperimentalChartsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate Sankey data for model decision flow
  const sankeyData = generateSankeyData(predictions);

  // Generate scatter plot data with clustering
  const scatterData = generateScatterData(predictions);

  // Generate funnel data
  const funnelData = generateFunnelData(predictions);

  // Generate composed chart data
  const composedData = generateComposedData(predictions);

  // Generate 3D-like data
  const bubbleData = generate3DBubbleData(predictions);

  // Generate stacked area data
  const stackedData = generateStackedAreaData(predictions);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FlaskConical className="w-6 h-6" />
          Experimental Visualizations
        </h2>
        <p className="text-muted-foreground">
          Advanced and creative chart experiments with complex data relationships
        </p>
      </div>

      <Tabs defaultValue="sankey" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sankey">Sankey Flow</TabsTrigger>
          <TabsTrigger value="scatter">3D Scatter</TabsTrigger>
          <TabsTrigger value="composed">Multi-Chart</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Sankey Diagram Tab */}
        <TabsContent value="sankey" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                <CardTitle>Sankey Flow Diagram</CardTitle>
              </div>
              <CardDescription>
                Visualizes how predictions flow from individual models to ensemble decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sankeyData.nodes.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <Sankey
                      data={sankeyData}
                      nodeWidth={10}
                      nodePadding={60}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      link={{ stroke: '#8884d8' }}
                    >
                      <Tooltip content={<CustomSankeyTooltip />} />
                    </Sankey>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Total Flow</div>
                      <div className="text-2xl font-bold">{predictions.length}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Agreement Rate</div>
                      <div className="text-2xl font-bold">
                        {calculateAgreementRate(predictions)}%
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Split Decisions</div>
                      <div className="text-2xl font-bold">{countSplitDecisions(predictions)}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Unanimous</div>
                      <div className="text-2xl font-bold">{countUnanimous(predictions)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState message="Make predictions to see decision flow" />
              )}
            </CardContent>
          </Card>

          {/* Funnel Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Classification Pipeline Funnel</CardTitle>
              <CardDescription>Shows the prediction filtering stages</CardDescription>
            </CardHeader>
            <CardContent>
              {funnelData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see funnel" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3D Scatter Tab */}
        <TabsContent value="scatter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>3D Bubble Chart - Model Confidence Scatter</CardTitle>
              <CardDescription>
                X=Confidence, Y=Model Agreement, Size=Message Length, Color=Spam/Not Spam
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bubbleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="confidence"
                      name="Confidence"
                      unit="%"
                      domain={[0, 100]}
                      label={{ value: 'Confidence %', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="agreement"
                      name="Model Agreement"
                      unit=" models"
                      domain={[0, 3]}
                      label={{ value: 'Models Agreeing', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis type="number" dataKey="size" range={[50, 400]} name="Message Length" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<Custom3DTooltip />} />
                    <Legend />
                    <Scatter name="Spam Messages" data={bubbleData.filter(d => d.isSpam)} fill="#ef4444">
                      {bubbleData.filter(d => d.isSpam).map((entry, index) => (
                        <Cell key={`spam-${index}`} fill="#ef4444" fillOpacity={0.6} />
                      ))}
                    </Scatter>
                    <Scatter name="Not Spam Messages" data={bubbleData.filter(d => !d.isSpam)} fill="#22c55e">
                      {bubbleData.filter(d => !d.isSpam).map((entry, index) => (
                        <Cell key={`notspam-${index}`} fill="#22c55e" fillOpacity={0.6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see 3D scatter plot" />
              )}
            </CardContent>
          </Card>

          {/* Cluster Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence vs Agreement Scatter</CardTitle>
              <CardDescription>See patterns in model predictions</CardDescription>
            </CardHeader>
            <CardContent>
              {scatterData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Confidence" unit="%" domain={[0, 100]} />
                    <YAxis type="number" dataKey="y" name="Agreement" domain={[0, 3]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Predictions" data={scatterData} fill="#8884d8">
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see scatter plot" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Composed Chart Tab */}
        <TabsContent value="composed" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <CardTitle>Multi-Layer Composed Chart</CardTitle>
              </div>
              <CardDescription>
                Combines bars, lines, and areas to show multiple metrics simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              {composedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart data={composedData}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="index" label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }} />
                    <YAxis yAxisId="left" label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Models', angle: 90, position: 'insideRight' }} />
                    <Tooltip content={<CustomComposedTooltip />} />
                    <Legend />

                    {/* Area for confidence range */}
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="confidence"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      stroke="#3b82f6"
                      strokeWidth={0}
                      name="Confidence Range"
                    />

                    {/* Bars for model votes */}
                    <Bar yAxisId="right" dataKey="spamVotes" fill="#ef4444" name="Spam Votes" barSize={20}>
                      {composedData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.spamVotes > 1.5 ? '#ef4444' : '#22c55e'} />
                      ))}
                    </Bar>

                    {/* Line for actual confidence */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="confidence"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Confidence"
                    />

                    {/* Line for moving average */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="movingAvg"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Moving Avg"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see composed chart" />
              )}
            </CardContent>
          </Card>

          {/* Stacked Area */}
          <Card>
            <CardHeader>
              <CardTitle>Stacked Model Confidence</CardTitle>
              <CardDescription>Shows contribution of each model over time</CardDescription>
            </CardHeader>
            <CardContent>
              {stackedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={stackedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="mnb"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="Multinomial NB"
                    />
                    <Area
                      type="monotone"
                      dataKey="lr"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Logistic Reg"
                    />
                    <Area
                      type="monotone"
                      dataKey="svc"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      name="Linear SVC"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see stacked chart" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          {/* Interactive Pie with Active Sector */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Active Shape Pie</CardTitle>
              <CardDescription>Hover over segments to see details</CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={generateModelVotePieData(predictions)}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see interactive pie" />
              )}
            </CardContent>
          </Card>

          {/* Radar Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Dimensional Model Radar</CardTitle>
              <CardDescription>Compare models across multiple metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={generateRadarData(predictions)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Multinomial NB"
                      dataKey="A"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Logistic Reg"
                      dataKey="B"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Linear SVC"
                      dataKey="C"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see radar chart" />
              )}
            </CardContent>
          </Card>

          {/* Animated Bar Race */}
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>Average confidence by model with variance</CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={generateModelComparisonData(predictions)}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgConfidence" fill="#3b82f6" name="Avg Confidence" radius={[0, 10, 10, 0]}>
                      {generateModelComparisonData(predictions).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="variance" fill="#f59e0b" name="Variance" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Make predictions to see comparison" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>{message}</p>
      </div>
    </div>
  );
}

function CustomSankeyTooltip({ active, payload }: any) {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">Flow: {data.value} predictions</p>
      </div>
    );
  }
  return null;
}

function Custom3DTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{data.isSpam ? 'SPAM' : 'NOT SPAM'}</p>
        <p className="text-sm">Confidence: {data.confidence.toFixed(1)}%</p>
        <p className="text-sm">Agreement: {data.agreement} models</p>
        <p className="text-sm">Message Length: {data.size} chars</p>
      </div>
    );
  }
  return null;
}

function CustomComposedTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">Prediction #{payload[0].payload.index}</p>
        <p className="text-sm">Confidence: {payload[0].payload.confidence.toFixed(1)}%</p>
        <p className="text-sm">Spam Votes: {payload[0].payload.spamVotes}/3</p>
        <p className="text-sm">Moving Avg: {payload[0].payload.movingAvg.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
}

// Active Shape for Pie
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm">
        {value} votes
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

// Data Generation Functions
function generateSankeyData(predictions: MultiModelPrediction[]) {
  if (predictions.length === 0) return { nodes: [], links: [] };

  // Count flows
  let mnb_spam = 0, mnb_not = 0;
  let lr_spam = 0, lr_not = 0;
  let svc_spam = 0, svc_not = 0;
  let ens_spam = 0, ens_not = 0;

  predictions.forEach((pred) => {
    if (pred.multinomial_nb.is_spam) mnb_spam++; else mnb_not++;
    if (pred.logistic_regression.is_spam) lr_spam++; else lr_not++;
    if (pred.linear_svc.is_spam) svc_spam++; else svc_not++;
    if (pred.ensemble.is_spam) ens_spam++; else ens_not++;
  });

  return {
    nodes: [
      { name: 'MNB' },
      { name: 'LR' },
      { name: 'SVC' },
      { name: 'Spam Vote' },
      { name: 'Not Spam Vote' },
      { name: 'Ensemble: SPAM' },
      { name: 'Ensemble: NOT SPAM' },
    ],
    links: [
      { source: 0, target: 3, value: mnb_spam },
      { source: 0, target: 4, value: mnb_not },
      { source: 1, target: 3, value: lr_spam },
      { source: 1, target: 4, value: lr_not },
      { source: 2, target: 3, value: svc_spam },
      { source: 2, target: 4, value: svc_not },
      { source: 3, target: 5, value: ens_spam },
      { source: 4, target: 6, value: ens_not },
    ],
  };
}

function generateScatterData(predictions: MultiModelPrediction[]) {
  return predictions.map((pred) => ({
    x: pred.ensemble.confidence * 100,
    y: pred.ensemble.spam_votes,
    color: pred.ensemble.is_spam ? '#ef4444' : '#22c55e',
  }));
}

function generate3DBubbleData(predictions: MultiModelPrediction[]) {
  return predictions.map((pred) => ({
    confidence: pred.ensemble.confidence * 100,
    agreement: pred.ensemble.spam_votes,
    size: pred.message.length,
    isSpam: pred.ensemble.is_spam,
  }));
}

function generateComposedData(predictions: MultiModelPrediction[]) {
  return predictions.slice(-20).map((pred, idx) => {
    const start = Math.max(0, idx - 4);
    const recent = predictions.slice(start, idx + 1);
    const movingAvg = recent.reduce((sum, p) => sum + p.ensemble.confidence * 100, 0) / recent.length;

    return {
      index: idx + 1,
      confidence: pred.ensemble.confidence * 100,
      spamVotes: pred.ensemble.spam_votes,
      movingAvg: movingAvg,
    };
  });
}

function generateStackedAreaData(predictions: MultiModelPrediction[]) {
  return predictions.slice(-20).map((pred, idx) => ({
    index: idx + 1,
    mnb: pred.multinomial_nb.confidence * 100,
    lr: pred.logistic_regression.confidence * 100,
    svc: pred.linear_svc.confidence * 100,
  }));
}

function generateFunnelData(predictions: MultiModelPrediction[]) {
  const total = predictions.length;
  const highConfidence = predictions.filter(p => p.ensemble.confidence > 0.8).length;
  const spam = predictions.filter(p => p.ensemble.is_spam).length;
  const unanimous = predictions.filter(p => p.ensemble.spam_votes === 3 || p.ensemble.spam_votes === 0).length;

  return [
    { value: total, name: `All Messages (${total})`, fill: '#8884d8' },
    { value: highConfidence, name: `High Confidence (${highConfidence})`, fill: '#3b82f6' },
    { value: spam, name: `Spam Detected (${spam})`, fill: '#ef4444' },
    { value: unanimous, name: `Unanimous (${unanimous})`, fill: '#22c55e' },
  ];
}

function generateModelVotePieData(predictions: MultiModelPrediction[]) {
  const votes = [0, 0, 0, 0];
  predictions.forEach(pred => votes[pred.ensemble.spam_votes]++);

  return [
    { name: '0 Votes (All Not Spam)', value: votes[0], fill: '#22c55e' },
    { name: '1 Vote', value: votes[1], fill: '#f59e0b' },
    { name: '2 Votes', value: votes[2], fill: '#f97316' },
    { name: '3 Votes (All Spam)', value: votes[3], fill: '#ef4444' },
  ].filter(d => d.value > 0);
}

function generateRadarData(predictions: MultiModelPrediction[]) {
  const mnbAvg = predictions.reduce((s, p) => s + p.multinomial_nb.confidence, 0) / predictions.length * 100;
  const lrAvg = predictions.reduce((s, p) => s + p.logistic_regression.confidence, 0) / predictions.length * 100;
  const svcAvg = predictions.reduce((s, p) => s + p.linear_svc.confidence, 0) / predictions.length * 100;

  return [
    { subject: 'Avg Confidence', A: mnbAvg, B: lrAvg, C: svcAvg },
    { subject: 'Max Confidence', A: Math.max(...predictions.map(p => p.multinomial_nb.confidence)) * 100, B: Math.max(...predictions.map(p => p.logistic_regression.confidence)) * 100, C: Math.max(...predictions.map(p => p.linear_svc.confidence)) * 100 },
    { subject: 'Min Confidence', A: Math.min(...predictions.map(p => p.multinomial_nb.confidence)) * 100, B: Math.min(...predictions.map(p => p.logistic_regression.confidence)) * 100, C: Math.min(...predictions.map(p => p.linear_svc.confidence)) * 100 },
    { subject: 'Consistency', A: 100 - calculateVariance(predictions.map(p => p.multinomial_nb.confidence)), B: 100 - calculateVariance(predictions.map(p => p.logistic_regression.confidence)), C: 100 - calculateVariance(predictions.map(p => p.linear_svc.confidence)) },
    { subject: 'Agreement', A: calculateModelAgreement(predictions, 'multinomial_nb'), B: calculateModelAgreement(predictions, 'logistic_regression'), C: calculateModelAgreement(predictions, 'linear_svc') },
  ];
}

function generateModelComparisonData(predictions: MultiModelPrediction[]) {
  const mnbConf = predictions.map(p => p.multinomial_nb.confidence * 100);
  const lrConf = predictions.map(p => p.logistic_regression.confidence * 100);
  const svcConf = predictions.map(p => p.linear_svc.confidence * 100);

  return [
    {
      name: 'Multinomial NB',
      avgConfidence: mnbConf.reduce((a, b) => a + b, 0) / mnbConf.length,
      variance: calculateVariance(predictions.map(p => p.multinomial_nb.confidence)),
      color: '#ef4444',
    },
    {
      name: 'Logistic Reg',
      avgConfidence: lrConf.reduce((a, b) => a + b, 0) / lrConf.length,
      variance: calculateVariance(predictions.map(p => p.logistic_regression.confidence)),
      color: '#3b82f6',
    },
    {
      name: 'Linear SVC',
      avgConfidence: svcConf.reduce((a, b) => a + b, 0) / svcConf.length,
      variance: calculateVariance(predictions.map(p => p.linear_svc.confidence)),
      color: '#8b5cf6',
    },
  ];
}

function calculateAgreementRate(predictions: MultiModelPrediction[]): number {
  if (predictions.length === 0) return 0;
  const unanimous = predictions.filter(p => p.ensemble.spam_votes === 3 || p.ensemble.spam_votes === 0).length;
  return Math.round((unanimous / predictions.length) * 100);
}

function countSplitDecisions(predictions: MultiModelPrediction[]): number {
  return predictions.filter(p => p.ensemble.spam_votes === 1 || p.ensemble.spam_votes === 2).length;
}

function countUnanimous(predictions: MultiModelPrediction[]): number {
  return predictions.filter(p => p.ensemble.spam_votes === 3 || p.ensemble.spam_votes === 0).length;
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return variance * 100;
}

function calculateModelAgreement(predictions: MultiModelPrediction[], model: 'multinomial_nb' | 'logistic_regression' | 'linear_svc'): number {
  if (predictions.length === 0) return 0;
  const agreements = predictions.filter(pred => pred[model].is_spam === pred.ensemble.is_spam).length;
  return (agreements / predictions.length) * 100;
}
