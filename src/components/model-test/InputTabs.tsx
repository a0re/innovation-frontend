import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Mail, FileText, Sparkles, FileUp } from "lucide-react"
import { api } from "@/lib/api-service"
import { MESSAGES, EXPORT_CONFIG } from "@/constants"
import type { MultiModelPrediction } from "@/types"
import { PredictionResult } from "./PredictionResult"
import { ErrorMessage } from "./ErrorMessage"
import { BatchResultsDisplay } from "./BatchResultsDisplay"
import type { BatchPredictionResponse } from "@/types"

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
  const [fileType, setFileType] = useState<"text" | "csv" | null>(null)
  const [csvMessages, setCsvMessages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MultiModelPrediction | null>(null)
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit")
      return
    }

    setFileName(file.name)
    setError(null)
    setResult(null)
    setBatchResult(null)
    
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      
      if (file.name.endsWith('.csv')) {
        // Parse CSV file
        setFileType("csv")
        try {
          const lines = content.split('\n').filter(line => line.trim())
          if (lines.length === 0) {
            setError("CSV file is empty")
            return
          }
          
          // Try to detect if first line is header
          const firstLine = lines[0].toLowerCase()
          const hasHeader = firstLine.includes('message') || firstLine.includes('text') || firstLine.includes('content')
          
          const messages: string[] = []
          const startIndex = hasHeader ? 1 : 0
          
          for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue
            
            // Parse CSV line (handle quoted values)
            const parsed = parseCSVLine(line)
            // Try to find message column (look for longest text field)
            let messageText = parsed.find(field => field.length > 20) || parsed[0] || line
            
            // Remove quotes if present
            messageText = messageText.replace(/^"|"$/g, '').trim()
            if (messageText) {
              messages.push(messageText)
            }
          }
          
          if (messages.length === 0) {
            setError("No messages found in CSV file")
            return
          }
          
          setCsvMessages(messages)
          setMessage("") // Clear single message
        } catch (err) {
          setError(`Failed to parse CSV: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      } else {
        // Plain text file
        setFileType("text")
        setMessage(content)
        setCsvMessages([])
      }
    }

    reader.onerror = () => {
      setError(MESSAGES.ERRORS.FILE_READ_FAILED)
    }

    reader.readAsText(file)
  }

  // Helper function to parse CSV line (handles quoted fields)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"'
          i++
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }
    result.push(current) // Add last field
    return result
  }

  const handleTest = async () => {
    setLoading(true)
    setResult(null)
    setBatchResult(null)
    setError(null)
    
    try {
      if (fileType === "csv" && csvMessages.length > 0) {
        // Batch analysis for CSV
  const data = await api.predictBatch(csvMessages)
        setBatchResult(data)
      } else if (message.trim()) {
        // Single message analysis for text files
        const data = await api.predictMultiModel(message)
        setResult(data)
      } else {
        setError("No content to analyze")
      }
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
            <p className="text-sm text-muted-foreground mb-6">
              Upload a file - Support for .txt and .csv files up to 10MB
            </p>
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <Button asChild size="lg" variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </label>
            </Button>
            {fileName && (
              <div className="p-3 rounded-lg bg-muted inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {(message || csvMessages.length > 0) && (
        <>
          {fileType === "csv" && csvMessages.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium mb-2">
                Found {csvMessages.length} message{csvMessages.length !== 1 ? 's' : ''} in CSV file
              </p>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-xs text-muted-foreground font-mono">
                  {csvMessages.slice(0, 3).map((msg, idx) => (
                    <span key={idx} className="block mb-1 truncate">
                      {idx + 1}. {msg.substring(0, 100)}{msg.length > 100 ? '...' : ''}
                    </span>
                  ))}
                  {csvMessages.length > 3 && (
                    <span className="text-muted-foreground">
                      ... and {csvMessages.length - 3} more
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          {fileType === "text" && message && (
            <div className="p-4 rounded-lg bg-muted/50 max-h-48 overflow-y-auto border">
              <p className="text-sm font-mono whitespace-pre-wrap">{message}</p>
            </div>
          )}
          <Button onClick={handleTest} disabled={loading || (!message && csvMessages.length === 0)} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {fileType === "csv" ? `Analyzing ${csvMessages.length} messages...` : "Analyzing..."}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {fileType === "csv" ? `Analyze ${csvMessages.length} Messages` : "Analyze File Content"}
              </>
            )}
          </Button>
          {result && <PredictionResult prediction={result} />}
          {batchResult && (
            <BatchResultsDisplay 
              result={batchResult} 
              onExport={() => {
                const csvContent = [
                  EXPORT_CONFIG.CSV_HEADERS.join(","),
                  ...batchResult.predictions.map((pred) =>
                    [
                      `"${pred.message.replace(/"/g, '""')}"`,
                      pred.is_spam ? "SPAM" : "NOT SPAM",
                      pred.confidence != null ? `${(pred.confidence * 100).toFixed(1)}%` : "",
                      pred.timestamp ?? "",
                    ].join(",")
                  ),
                ].join("\n")

                const blob = new Blob([csvContent], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `spam_detection_results_${fileName.replace(/\.[^/.]+$/, "")}.csv`
                a.click()
                URL.revokeObjectURL(url)
              }}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </>
      )}
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
    if (!body.trim() && !subject.trim()) {
      setError("Email subject or body is required")
      return
    }
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      // Format email for better spam detection
      // The model's preprocessing removes headers like "Subject:" and "From:"
      // So we include the subject content directly in the text, and format it
      // to match how the model was trained (headers removed, content preserved)
      
      const parts: string[] = []
      
      // Include subject content (not as a header, since preprocessing removes headers)
      // Many spam emails have telltale subjects, so this is important
      if (subject.trim()) {
        parts.push(subject.trim())
      }
      
      // Add body content
      if (body.trim()) {
        if (parts.length > 0) {
          // Add separator between subject and body if both exist
          parts.push("")
        }
        parts.push(body.trim())
      }
      
      // Note: We don't include "From:" header because:
      // 1. The preprocessing removes it anyway
      // 2. Email addresses get replaced with <EMAIL> placeholder
      // 3. The sender info is less useful for spam detection than subject/body
      
      const fullEmail = parts.join("\n")
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

