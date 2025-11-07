import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Link as LinkIcon, Mail, FileText, Sparkles, FileUp } from "lucide-react"
import { api } from "@/lib/api-service"
import { MESSAGES } from "@/constants"
import type { MultiModelPrediction } from "@/types"
import { PredictionResult } from "./PredictionResult"
import { ErrorMessage } from "./ErrorMessage"

/**
 * Text input tab component
 */
export function TextInputTab() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await api.predictMultiModel(message)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : MESSAGES.ERRORS.PREDICTION_FAILED)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="single-message" className="text-base font-medium">
          Message Content
        </Label>
        <Textarea
          id="single-message"
          placeholder="Paste your message here to check if it's spam..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={10}
          className="resize-none text-base"
        />
        <p className="text-sm text-muted-foreground">{message.length} characters</p>
      </div>
      <Button onClick={handleTest} disabled={loading || !message.trim()} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Message...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Analyze with AI
          </>
        )}
      </Button>
      {result && <PredictionResult prediction={result} />}
      {error && <ErrorMessage message={error} />}
    </>
  )
}

/**
 * File upload tab component
 */
export function FileUploadTab() {
  const [message, setMessage] = useState("")
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (e) => {
      setMessage(e.target?.result as string)
    }

    reader.onerror = () => {
      setError(MESSAGES.ERRORS.FILE_READ_FAILED)
    }

    reader.readAsText(file)
  }

  const handleTest = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await api.predictMultiModel(message)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : MESSAGES.ERRORS.PREDICTION_FAILED)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="border-2 border-dashed rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
        <div className="mx-auto max-w-md">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Upload a File</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Support for .txt and .csv files up to 10MB
            </p>
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button asChild size="lg" variant="outline" className="mb-3">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </label>
          </Button>
          {fileName && (
            <div className="mt-4 p-3 rounded-lg bg-muted inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
          )}
        </div>
      </div>
      {message && (
        <>
          <div className="p-4 rounded-lg bg-muted/50 max-h-48 overflow-y-auto border">
            <p className="text-sm font-mono whitespace-pre-wrap">{message}</p>
          </div>
          <Button onClick={handleTest} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze File Content
              </>
            )}
          </Button>
          {result && <PredictionResult prediction={result} />}
          {error && <ErrorMessage message={error} />}
        </>
      )}
    </>
  )
}

/**
 * URL input tab component
 */
export function URLInputTab() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await api.predictMultiModel(`URL content from: ${url}`)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="url-input" className="text-base font-medium">
          Website URL
        </Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-base"
        />
        <p className="text-sm text-muted-foreground">Enter a URL to fetch and analyze its content for spam</p>
      </div>
      <Button onClick={handleTest} disabled={loading || !url.trim()} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Fetching & Analyzing...
          </>
        ) : (
          <>
            <LinkIcon className="mr-2 h-5 w-5" />
            Analyze URL
          </>
        )}
      </Button>
      {result && <PredictionResult prediction={result} />}
      {error && <ErrorMessage message={error} />}
    </>
  )
}

/**
 * Email input tab component
 */
export function EmailInputTab() {
  const [subject, setSubject] = useState("")
  const [from, setFrom] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    if (!body.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const fullEmail = `Subject: ${subject}\nFrom: ${from}\n\n${body}`
      const data = await api.predictMultiModel(fullEmail)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email-subject" className="text-base font-medium">
              Subject
            </Label>
            <Input
              id="email-subject"
              placeholder="Email subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-from" className="text-base font-medium">
              From
            </Label>
            <Input
              id="email-from"
              type="email"
              placeholder="sender@example.com"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-base"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-body" className="text-base font-medium">
            Message Body
          </Label>
          <Textarea
            id="email-body"
            placeholder="Email content..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="resize-none text-base"
          />
        </div>
      </div>
      <Button onClick={handleTest} disabled={loading || !body.trim()} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Email...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Analyze Email
          </>
        )}
      </Button>
      {result && <PredictionResult prediction={result} />}
      {error && <ErrorMessage message={error} />}
    </>
  )
}

