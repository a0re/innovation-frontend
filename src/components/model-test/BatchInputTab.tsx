import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, RotateCcw } from "lucide-react"
import { api } from "@/lib/api-service"
import { EXPORT_CONFIG, MESSAGES } from "@/constants"
import type { BatchPrediction, BatchPredictionResponse } from "@/types"
import { ErrorMessage } from "./ErrorMessage"
import { BatchResultsDisplay } from "./BatchResultsDisplay"

/**
 * Batch input tab component
 */
export function BatchInputTab() {
  const [messages, setMessages] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BatchPredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messageList = useMemo(
    () =>
      messages
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    [messages]
  )

  const messageCount = messageList.length

  const handleTest = async () => {
    if (messageCount === 0) {
      setError("Please enter at least one message to analyze")
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await api.predictBatch(messageList)
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : MESSAGES.ERRORS.BATCH_PREDICTION_FAILED)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages("")
    setResult(null)
    setError(null)
  }

  const handleExport = () => {
    if (!result) return

    const toRow = (prediction: BatchPrediction) => {
      const safeMessage = prediction.message.replace(/"/g, '""')
      const numericConfidence = Number((prediction as unknown as { confidence: unknown }).confidence)
      const isSpam = Boolean(prediction.is_spam || prediction.prediction === "spam")
      const confidenceValue = Number.isFinite(numericConfidence)
        ? `${(numericConfidence * 100).toFixed(1)}%`
        : "Unknown"
      const clusterLabel = prediction.cluster?.short_name || prediction.cluster?.name || ""
      return [
        `"${safeMessage}"`,
        isSpam ? "SPAM" : "NOT SPAM",
        confidenceValue,
        clusterLabel,
        prediction.timestamp,
      ].join(",")
    }

    const csvContent = [
      EXPORT_CONFIG.CSV_HEADERS.join(","),
      ...result.predictions.map(toRow),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = EXPORT_CONFIG.BATCH_RESULTS_FILENAME
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="batch-messages" className="text-base font-medium">
          Bulk Messages
        </Label>
        <Textarea
          id="batch-messages"
          placeholder="Enter multiple messages, one per line..."
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          rows={10}
          className="resize-none font-mono text-sm"
        />
        <p className="text-sm text-muted-foreground">{messageCount} messages</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleTest} disabled={loading || messageCount === 0} size="lg" className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Testing {messageCount} {messageCount === 1 ? "Message" : "Messages"}...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-5 w-5" />
              Analyze Batch
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={loading && !result}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      {error && <ErrorMessage message={error} />}
      {result && <BatchResultsDisplay result={result} onExport={handleExport} />}
    </>
  )
}

