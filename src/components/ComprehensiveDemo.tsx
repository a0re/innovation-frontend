import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { api } from '../lib/api';
import type { MultiModelPrediction, StatsResponse, ClusterInfoResponse } from '../lib/api';
import { AlertCircle, CheckCircle2, Activity, BarChart3, Layers, Sparkles, TrendingUp, Zap, LineChart, FlaskConical, Database } from 'lucide-react';
import { EnhancedCharts } from './EnhancedCharts';
import { QuickWinsPage } from './QuickWinsPage';
import { ProfessionalAnalytics } from './ProfessionalAnalytics';
import { ExperimentalCharts } from './ExperimentalCharts';
import { generateSamplePredictions, generateSampleStats, generateSampleClusterInfo } from '../lib/sampleData';

export function ComprehensiveDemo() {
  const [message, setMessage] = useState('');
  const [prediction, setPrediction] = useState<MultiModelPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [clusterInfo, setClusterInfo] = useState<ClusterInfoResponse | null>(null);
  const [examples, setExamples] = useState<{ spam: string[]; not_spam: string[] } | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<MultiModelPrediction[]>([]);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadClusterInfo();
    loadExamples();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadClusterInfo = async () => {
    try {
      const data = await api.getClusterInfo();
      setClusterInfo(data);
    } catch (err) {
      console.error('Failed to load cluster info:', err);
    }
  };

  const loadExamples = async () => {
    try {
      const data = await api.getExamples();
      setExamples(data);
    } catch (err) {
      console.error('Failed to load examples:', err);
    }
  };

  const handlePredict = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await api.predictMultiModel(message);
      setPrediction(result);
      setPredictionHistory(prev => [...prev, result]); // Add to history
      await loadStats(); // Refresh stats after prediction
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const useExample = (exampleMessage: string) => {
    setMessage(exampleMessage);
    setPrediction(null);
  };

  const clearAll = () => {
    setMessage('');
    setPrediction(null);
    setError(null);
  };

  const loadSampleData = () => {
    // Generate 30 sample predictions
    const samplePreds = generateSamplePredictions(30);
    setPredictionHistory(samplePreds);

    // Load sample stats
    const sampleStats = generateSampleStats();
    setStats(sampleStats);

    // Load sample cluster info
    const sampleClusterInfo = generateSampleClusterInfo();
    setClusterInfo(sampleClusterInfo);

    // Set the latest prediction as current
    setPrediction(samplePreds[samplePreds.length - 1]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Spam Detection API Demo</h1>
            <p className="text-muted-foreground">
              Test multi-model predictions, clustering analysis, and view real-time statistics
            </p>
          </div>
          <Button
            onClick={loadSampleData}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Database className="w-5 h-5" />
            Load Sample Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        {stats && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_predictions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Spam Detected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.spam_detected}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.total_predictions > 0
                    ? `${((stats.spam_detected / stats.total_predictions) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.average_confidence * 100).toFixed(1)}%</div>
                <Progress value={stats.average_confidence * 100} className="mt-2" />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="predict" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="predict">
            <Sparkles className="w-4 h-4 mr-2" />
            Predict
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Zap className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <LineChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="experimental">
            <FlaskConical className="w-4 h-4 mr-2" />
            Experimental
          </TabsTrigger>
          <TabsTrigger value="charts">
            <TrendingUp className="w-4 h-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="models">
            <Layers className="w-4 h-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="clusters">
            <BarChart3 className="w-4 h-4 mr-2" />
            Clusters
          </TabsTrigger>
          <TabsTrigger value="examples">
            <Activity className="w-4 h-4 mr-2" />
            Examples
          </TabsTrigger>
        </TabsList>

        {/* Prediction Tab */}
        <TabsContent value="predict">
          <Card>
            <CardHeader>
              <CardTitle>Test Message Classification</CardTitle>
              <CardDescription>
                Enter a message to analyze it with all three ML models and get spam subtype clustering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter message to classify..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handlePredict} disabled={loading || !message.trim()}>
                  {loading ? 'Analyzing...' : 'Classify Message'}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {prediction && (
                <div className="space-y-4 mt-6">
                  {/* Ensemble Result */}
                  <Alert variant={prediction.ensemble.is_spam ? 'destructive' : 'default'}>
                    {prediction.ensemble.is_spam ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {prediction.ensemble.is_spam ? 'SPAM DETECTED' : 'NOT SPAM'}
                    </AlertTitle>
                    <AlertDescription>
                      Ensemble confidence: {(prediction.ensemble.confidence * 100).toFixed(2)}%
                      <br />
                      Votes: {prediction.ensemble.spam_votes}/{prediction.ensemble.total_votes} models agree
                    </AlertDescription>
                  </Alert>

                  {/* Processed Message */}
                  <div>
                    <p className="text-sm font-medium mb-1">Processed Message:</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      {prediction.processed_message}
                    </code>
                  </div>

                  {/* Individual Model Results */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ModelResultCard
                      name="Multinomial NB"
                      result={prediction.multinomial_nb}
                    />
                    <ModelResultCard
                      name="Logistic Regression"
                      result={prediction.logistic_regression}
                    />
                    <ModelResultCard
                      name="Linear SVC"
                      result={prediction.linear_svc}
                    />
                  </div>

                  {/* Cluster Information */}
                  {prediction.cluster && (
                    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Spam Subtype Analysis</CardTitle>
                        <CardDescription>
                          This spam belongs to cluster {prediction.cluster.cluster_id} of{' '}
                          {prediction.cluster.total_clusters} identified spam types
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Cluster Confidence:</p>
                            <Progress value={prediction.cluster.confidence * 100} />
                            <p className="text-sm text-muted-foreground mt-1">
                              {(prediction.cluster.confidence * 100).toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Characteristic Terms (Top 5):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {prediction.cluster.top_terms.slice(0, 5).map((term, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {term.term} ({(term.score * 100).toFixed(1)}%)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Insights Tab (Option A) */}
        <TabsContent value="insights">
          <QuickWinsPage stats={stats} predictions={predictionHistory} />
        </TabsContent>

        {/* Professional Analytics Tab (Option B) */}
        <TabsContent value="analytics">
          <ProfessionalAnalytics
            stats={stats}
            predictions={predictionHistory}
            clusterInfo={clusterInfo}
          />
        </TabsContent>

        {/* Experimental Charts Tab */}
        <TabsContent value="experimental">
          <ExperimentalCharts stats={stats} predictions={predictionHistory} />
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts">
          <EnhancedCharts stats={stats} predictions={predictionHistory} />
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>
                Three different ML algorithms working together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prediction ? (
                <div className="space-y-4">
                  <ComparisonChart prediction={prediction} />
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Agreement Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      {prediction.ensemble.spam_votes === 3 || prediction.ensemble.spam_votes === 0
                        ? 'All models agree on this classification.'
                        : `Models disagree: ${prediction.ensemble.spam_votes} predict spam, ${
                            3 - prediction.ensemble.spam_votes
                          } predict not spam.`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Make a prediction to see model comparison
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clusters Tab */}
        <TabsContent value="clusters">
          <Card>
            <CardHeader>
              <CardTitle>Spam Subtype Clusters</CardTitle>
              <CardDescription>
                {clusterInfo
                  ? `${clusterInfo.total_clusters} spam subtypes identified with silhouette score: ${clusterInfo.silhouette_score.toFixed(3)}`
                  : 'Loading cluster information...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clusterInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusterInfo.clusters.map((cluster) => (
                    <Card key={cluster.cluster_id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Cluster {cluster.cluster_id}
                        </CardTitle>
                        <CardDescription>
                          {cluster.num_terms} characteristic terms
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {cluster.top_terms.slice(0, 8).map((term, idx) => (
                            <Badge key={idx} variant="outline">
                              {term.term}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Loading cluster information...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Spam Examples</CardTitle>
                <CardDescription>Click to test</CardDescription>
              </CardHeader>
              <CardContent>
                {examples && examples.spam ? (
                  <div className="space-y-2">
                    {examples.spam.slice(0, 5).map((example, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => useExample(example)}
                      >
                        <span className="truncate">{example}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading examples...</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-500">Not Spam Examples</CardTitle>
                <CardDescription>Click to test</CardDescription>
              </CardHeader>
              <CardContent>
                {examples && examples.not_spam ? (
                  <div className="space-y-2">
                    {examples.not_spam.slice(0, 5).map((example, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => useExample(example)}
                      >
                        <span className="truncate">{example}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading examples...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function ModelResultCard({ name, result }: { name: string; result: any }) {
  return (
    <Card className={result.is_spam ? 'border-red-200' : 'border-green-200'}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant={result.is_spam ? 'destructive' : 'default'}>
            {result.prediction}
          </Badge>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <Progress value={result.confidence * 100} />
            <p className="text-xs text-muted-foreground mt-1">
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonChart({ prediction }: { prediction: MultiModelPrediction }) {
  const models = [
    { name: 'Multinomial NB', data: prediction.multinomial_nb },
    { name: 'Logistic Reg.', data: prediction.logistic_regression },
    { name: 'Linear SVC', data: prediction.linear_svc },
  ];

  const maxConfidence = Math.max(...models.map(m => m.data.confidence));

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Confidence Comparison</h3>
      {models.map((model, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{model.name}</span>
            <span className="font-medium">{(model.data.confidence * 100).toFixed(2)}%</span>
          </div>
          <div className="flex gap-2 items-center">
            <Progress value={model.data.confidence * 100} className="flex-1" />
            <Badge variant={model.data.is_spam ? 'destructive' : 'default'} className="text-xs">
              {model.data.prediction}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
