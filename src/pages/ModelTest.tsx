import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, Send, Settings, AlertTriangle } from "lucide-react"
import { api, type MultiModelPrediction, type BatchPredictionResponse } from "@/lib/api"

export function ModelTest() {
  const [message, setMessage] = useState("")
  const [batchMessages, setBatchMessages] = useState("")
  const [singleLoading, setSingleLoading] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)
  const [batchError, setBatchError] = useState<string | null>(null)

  // Model toggles
  const [enableMultinomialNB, setEnableMultinomialNB] = useState(true)
  const [enableLogisticRegression, setEnableLogisticRegression] = useState(true)
  const [enableLinearSVC, setEnableLinearSVC] = useState(true)

  const handleSingleTest = async () => {
    if (!message.trim()) return

    setSingleLoading(true)
    setResult(null)
    setSingleError(null)
    try {
      const data = await api.predictMultiModel(message)
      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Prediction failed"
      setSingleError(errorMessage)
    } finally {
      setSingleLoading(false)
    }
  }

  const handleBatchTest = async () => {
    const messages = batchMessages
      .split("\n")
      .map(m => m.trim())
      .filter(m => m.length > 0)

    if (messages.length === 0) return

    setBatchLoading(true)
    setBatchResult(null)
    setBatchError(null)
    try {
      const data = await api.predictBatchMultiModel(messages)
      setBatchResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Batch prediction failed"
      setBatchError(errorMessage)
    } finally {
      setBatchLoading(false)
    }
  }

  const enabledModelsCount = [enableMultinomialNB, enableLogisticRegression, enableLinearSVC].filter(Boolean).length

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Model Testing</h1>
        <p className="text-muted-foreground">Test spam detection models with custom messages</p>
      </div>

      {/* Model Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Model Configuration
          </CardTitle>
          <CardDescription>
            Enable or disable individual models (at least one must be selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multinomial-nb"
                checked={enableMultinomialNB}
                onCheckedChange={(checked) => setEnableMultinomialNB(!!checked)}
                disabled={enabledModelsCount === 1 && enableMultinomialNB}
              />
              <Label htmlFor="multinomial-nb" className="cursor-pointer">
                Multinomial Naive Bayes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="logistic-regression"
                checked={enableLogisticRegression}
                onCheckedChange={(checked) => setEnableLogisticRegression(!!checked)}
                disabled={enabledModelsCount === 1 && enableLogisticRegression}
              />
              <Label htmlFor="logistic-regression" className="cursor-pointer">
                Logistic Regression
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="linear-svc"
                checked={enableLinearSVC}
                onCheckedChange={(checked) => setEnableLinearSVC(!!checked)}
                disabled={enabledModelsCount === 1 && enableLinearSVC}
              />
              <Label htmlFor="linear-svc" className="cursor-pointer">
                Linear SVC
              </Label>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {enabledModelsCount === 3 && "Using ensemble voting with all 3 models"}
            {enabledModelsCount === 2 && "Using ensemble voting with 2 models"}
            {enabledModelsCount === 1 && "Using single model prediction"}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Single Message Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Single Message Test
            </CardTitle>
            <CardDescription>Test a single message against all models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {singleError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {singleError}
                </p>
              </div>
            )}
            <Label htmlFor="single-message">Message</Label>
            <Textarea
              id="single-message"
              placeholder="Enter a message to test..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button
              onClick={handleSingleTest}
              disabled={singleLoading || !message.trim()}
              className="w-full"
            >
              {singleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Test Message
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Ensemble Prediction:</span>
                  <Badge variant={result.ensemble.is_spam ? "destructive" : "default"}>
                    {result.ensemble.is_spam ? "SPAM" : "NOT SPAM"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: {(result.ensemble.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Votes: {result.ensemble.spam_votes} / {result.ensemble.total_votes}
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-medium text-sm">Individual Models:</h4>
                  {enableMultinomialNB && (
                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted">
                      <span className="font-mono text-xs">Multinomial NB</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{(result.multinomial_nb.confidence * 100).toFixed(1)}%</span>
                        <Badge variant={result.multinomial_nb.is_spam ? "destructive" : "outline"} className="text-xs">
                          {result.multinomial_nb.is_spam ? "SPAM" : "NOT SPAM"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {enableLogisticRegression && (
                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted">
                      <span className="font-mono text-xs">Logistic Regression</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{(result.logistic_regression.confidence * 100).toFixed(1)}%</span>
                        <Badge variant={result.logistic_regression.is_spam ? "destructive" : "outline"} className="text-xs">
                          {result.logistic_regression.is_spam ? "SPAM" : "NOT SPAM"}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {enableLinearSVC && (
                    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted">
                      <span className="font-mono text-xs">Linear SVC</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{(result.linear_svc.confidence * 100).toFixed(1)}%</span>
                        <Badge variant={result.linear_svc.is_spam ? "destructive" : "outline"} className="text-xs">
                          {result.linear_svc.is_spam ? "SPAM" : "NOT SPAM"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Batch Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Batch Test
            </CardTitle>
            <CardDescription>Test multiple messages (one per line)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batchError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {batchError}
                </p>
              </div>
            )}
            <Label htmlFor="batch-messages">Messages (one per line)</Label>
            <Textarea
              id="batch-messages"
              placeholder="Enter messages (one per line)..."
              value={batchMessages}
              onChange={(e) => setBatchMessages(e.target.value)}
              rows={6}
              className="resize-none font-mono text-sm"
            />
            <Button
              onClick={handleBatchTest}
              disabled={batchLoading || !batchMessages.trim()}
              className="w-full"
            >
              {batchLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Test Batch
                </>
              )}
            </Button>

            {batchResult && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-md bg-muted">
                    <div className="text-muted-foreground text-xs">Total</div>
                    <div className="font-bold">{batchResult.total_processed}</div>
                  </div>
                  <div className="p-2 rounded-md bg-destructive/10">
                    <div className="text-muted-foreground text-xs">Spam</div>
                    <div className="font-bold text-destructive">{batchResult.spam_count}</div>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {batchResult.predictions.map((pred, idx) => (
                    <div key={idx} className="text-sm p-2 rounded-md bg-muted space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground line-clamp-1 flex-1">
                          {pred.message}
                        </span>
                        <Badge variant={pred.ensemble.is_spam ? "destructive" : "outline"} className="text-xs shrink-0">
                          {pred.ensemble.is_spam ? "SPAM" : "OK"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(pred.ensemble.confidence * 100).toFixed(1)}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
