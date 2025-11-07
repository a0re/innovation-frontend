import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Brain } from "lucide-react"
import { api } from "@/lib/api-service"
import { EXPORT_CONFIG, MESSAGES } from "@/constants"
import type { BatchPredictionResponse } from "@/types"
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

  const handleTest = async () => {
    const parsedMessages = messages
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0)

    if (parsedMessages.length === 0) return

    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await api.predictBatchMultiModel(parsedMessages)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : MESSAGES.ERRORS.BATCH_PREDICTION_FAILED)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!result) return

    const csvContent = [
      EXPORT_CONFIG.CSV_HEADERS.join(","),
      ...result.predictions.map((pred) =>
        [
          `"${pred.message.replace(/"/g, '""')}"`,
          pred.ensemble.is_spam ? "SPAM" : "NOT SPAM",
          `${(pred.ensemble.confidence * 100).toFixed(1)}%`,
          pred.ensemble.spam_votes,
          pred.ensemble.total_votes,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = EXPORT_CONFIG.BATCH_RESULTS_FILENAME
    a.click()
    URL.revokeObjectURL(url)
  }

  const messageCount = messages.split("\n").filter((m) => m.trim()).length

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
      <Button onClick={handleTest} disabled={loading || messageCount === 0} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Testing {messageCount} Messages...
          </>
        ) : (
          <>
            <Brain className="mr-2 h-5 w-5" />
            Analyze Batch
          </>
        )}
      </Button>
      {error && <ErrorMessage message={error} />}
      {result && <BatchResultsDisplay result={result} onExport={handleExport} />}
    </>
  )
}

