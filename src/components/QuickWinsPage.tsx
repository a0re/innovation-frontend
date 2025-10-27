import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type { MultiModelPrediction, StatsResponse } from '../lib/api';
import { AlertCircle, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

interface QuickWinsPageProps {
  stats: StatsResponse | null;
  predictions: MultiModelPrediction[];
}

export function QuickWinsPage({ stats, predictions }: QuickWinsPageProps) {
  // Get latest prediction for gauge
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null;

  // Extract common spam words from predictions
  const spamWords = extractSpamWords(predictions);

  // Prepare gauge data
  const gaugeData = latestPrediction
    ? [
        {
          name: 'Confidence',
          value: latestPrediction.ensemble.confidence * 100,
          fill: latestPrediction.ensemble.is_spam ? '#ef4444' : '#22c55e',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Quick Insights</h2>
        <p className="text-muted-foreground">
          Real-time activity, confidence meter, and spam word analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <CardTitle>Live Activity Feed</CardTitle>
            </div>
            <CardDescription>Recent predictions in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {predictions.length > 0 ? (
                <div className="space-y-3">
                  {[...predictions].reverse().slice(0, 20).map((pred, idx) => (
                    <ActivityItem key={idx} prediction={pred} />
                  ))}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No activity yet</p>
                    <p className="text-sm">Make predictions to see them here</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Confidence Gauge */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Confidence Meter</CardTitle>
            </div>
            <CardDescription>Latest prediction confidence level</CardDescription>
          </CardHeader>
          <CardContent>
            {latestPrediction ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={20}
                    data={gaugeData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {latestPrediction.ensemble.is_spam ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-2xl font-bold">
                      {(latestPrediction.ensemble.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Badge
                    variant={latestPrediction.ensemble.is_spam ? 'destructive' : 'default'}
                    className="text-sm"
                  >
                    {latestPrediction.ensemble.is_spam ? 'SPAM' : 'NOT SPAM'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    "{latestPrediction.message.substring(0, 60)}
                    {latestPrediction.message.length > 60 ? '...' : ''}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No predictions yet</p>
                  <p className="text-sm">Make a prediction to see confidence meter</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spam Word Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Common Spam Words</CardTitle>
          <CardDescription>Most frequent words in spam messages</CardDescription>
        </CardHeader>
        <CardContent>
          {spamWords.length > 0 ? (
            <div className="space-y-4">
              {spamWords.slice(0, 15).map((word, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{word.word}</span>
                    <span className="text-muted-foreground">{word.count} times</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(word.count / spamWords[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>No spam messages analyzed yet</p>
                <p className="text-sm">Classify some spam messages to see word patterns</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Activity Feed Item Component
function ActivityItem({ prediction }: { prediction: MultiModelPrediction }) {
  const isSpam = prediction.ensemble.is_spam;
  const confidence = (prediction.ensemble.confidence * 100).toFixed(1);

  // Calculate time ago (simplified - just say "just now" for demo)
  const timeAgo = 'just now';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        isSpam ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:bg-green-950/20'
      }`}
    >
      <div className="mt-1">
        {isSpam ? (
          <AlertCircle className="w-5 h-5 text-red-500" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant={isSpam ? 'destructive' : 'default'} className="text-xs">
            {isSpam ? 'SPAM' : 'NOT SPAM'}
          </Badge>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        <p className="text-sm line-clamp-2">{prediction.message}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Confidence: {confidence}%</span>
          <span>•</span>
          <span>
            {prediction.ensemble.spam_votes}/{prediction.ensemble.total_votes} models agree
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper function to extract spam words
function extractSpamWords(predictions: MultiModelPrediction[]) {
  const wordCount: Record<string, number> = {};

  // Only analyze spam messages
  const spamMessages = predictions.filter((p) => p.ensemble.is_spam);

  spamMessages.forEach((pred) => {
    // Split message into words and count
    const words = pred.processed_message
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3); // Only words longer than 3 chars

    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  // Convert to array and sort by frequency
  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
