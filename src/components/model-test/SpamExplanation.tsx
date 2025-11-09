import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Shield,
  DollarSign,
  Lock,
  Zap,
  Mail,
  Link as LinkIcon
} from "lucide-react"
import type { MultiModelPrediction } from "@/types"
import { useSettings } from "@/contexts/SettingsContext"

/**
 * Spam explanation component that highlights suspicious words and explains classification
 */
export function SpamExplanation({ prediction }: { prediction: MultiModelPrediction }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { settings } = useSettings()
  
  if (!prediction.ensemble.is_spam) {
    return null // Only show for spam messages
  }

  const message = prediction.message
  const indicators = analyzeSpamIndicators(message)
  
  // Calculate enabled models and which ones voted for spam
  const enabledModels = [
    { name: "Multinomial Naive Bayes", key: "multinomial_nb", enabled: settings.models.multinomial_nb, isSpam: prediction.multinomial_nb.is_spam },
    { name: "Logistic Regression", key: "logistic_regression", enabled: settings.models.logistic_regression, isSpam: prediction.logistic_regression.is_spam },
    { name: "Linear SVC", key: "linear_svc", enabled: settings.models.linear_svc, isSpam: prediction.linear_svc.is_spam },
  ].filter(model => model.enabled)
  
  const enabledSpamVotes = enabledModels.filter(model => model.isSpam).length
  const totalEnabledModels = enabledModels.length
  
  // If no indicators found, show a note that this might be a false positive
  if (indicators.length === 0) {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            No Clear Spam Indicators Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This message was classified as spam by {enabledSpamVotes} out of {totalEnabledModels} enabled model{totalEnabledModels !== 1 ? 's' : ''}, 
            but no obvious spam indicators were detected. This may be a false positive, especially if the message is a 
            legitimate question or contains unusual wording that the models haven't seen before.
          </p>
          {totalEnabledModels > 0 && (
            <div className="mt-3 pt-3 border-t border-yellow-500/20">
              <p className="text-xs font-medium text-muted-foreground mb-2">Models that flagged this as spam:</p>
              <div className="flex flex-wrap gap-2">
                {enabledModels
                  .filter(model => model.isSpam)
                  .map((model, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                      {model.name}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Highlight suspicious words in the message
  const highlightedMessage = highlightSuspiciousWords(message, indicators)

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Why This Was Classified as Spam
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Highlighted Message */}
          <div className="p-4 rounded-lg bg-background border">
            <p className="text-sm font-medium mb-2 text-muted-foreground">Message with highlighted indicators:</p>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {highlightedMessage}
            </div>
          </div>

          {/* Spam Indicators */}
          {indicators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Detected Spam Indicators ({indicators.length})
              </h4>
              
              <div className="grid gap-2">
                {indicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background border"
                  >
                    <div className="mt-0.5">
                      {getIndicatorIcon(indicator.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {indicator.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {indicator.matches.length} match{indicator.matches.length !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{indicator.explanation}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {indicator.matches.slice(0, 5).map((match, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs font-mono bg-destructive/10 text-destructive border-destructive/20"
                          >
                            {match}
                          </Badge>
                        ))}
                        {indicator.matches.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{indicator.matches.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Agreement */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>{enabledSpamVotes} out of {totalEnabledModels}</strong> enabled model{totalEnabledModels !== 1 ? 's' : ''} 
              {" "}agreed this is spam with <strong>{(prediction.ensemble.confidence * 100).toFixed(1)}%</strong> confidence.
            </p>
            {totalEnabledModels > 0 && (
              <div className="mt-2 pt-2 border-t border-muted">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Model votes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {enabledModels.map((model, idx) => (
                    <Badge
                      key={idx}
                      variant={model.isSpam ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {model.name}: {model.isSpam ? "SPAM" : "SAFE"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

/**
 * Analyze message for spam indicators
 */
function analyzeSpamIndicators(message: string): SpamIndicator[] {
  const indicators: SpamIndicator[] = []

  // Phishing keywords
  const phishingPattern = /\b(verify|suspended|compromised|security|account|bank|paypal|amazon|microsoft|apple|update|confirm)\b/gi
  const phishingMatches = [...message.matchAll(phishingPattern)].map(m => m[0])
  if (phishingMatches.length > 0) {
    indicators.push({
      category: "Phishing",
      explanation: "Contains words commonly used in phishing attempts to trick users into revealing personal information.",
      matches: [...new Set(phishingMatches)],
    })
  }

  // Scam keywords
  const scamPattern = /\b(prince|nigerian|inheritance|lottery|prize|million|transfer|help|urgent|immediately|congratulations|winner|selected)\b/gi
  const scamMatches = [...message.matchAll(scamPattern)].map(m => m[0])
  if (scamMatches.length > 0) {
    indicators.push({
      category: "Scam",
      explanation: "Contains words associated with common scams like lottery, inheritance, or advance fee fraud.",
      matches: [...new Set(scamMatches)],
    })
  }

  // Money mentions
  const moneyPattern = /\b(\$[\d,]+|£[\d,]+|€[\d,]+|dollar|pound|euro|million|thousand|cash|money|fund|transfer|deposit|refund|reward)\b/gi
  const moneyMatches = [...message.matchAll(moneyPattern)].map(m => m[0])
  if (moneyMatches.length > 0) {
    indicators.push({
      category: "Financial",
      explanation: "Contains financial terms or currency symbols, which are often used in spam to create urgency.",
      matches: [...new Set(moneyMatches)],
    })
  }

  // Personal info requests
  const personalInfoPattern = /\b(password|pin|ssn|social security|bank account|credit card|personal|details|information|verify your identity)\b/gi
  const personalInfoMatches = [...message.matchAll(personalInfoPattern)].map(m => m[0])
  if (personalInfoMatches.length > 0) {
    indicators.push({
      category: "Identity Theft",
      explanation: "Requests personal or financial information, which is a red flag for identity theft attempts.",
      matches: [...new Set(personalInfoMatches)],
    })
  }

  // Urgency/Time pressure
  const urgencyPattern = /\b(urgent|immediately|now|asap|limited time|expires|act now|click here|verify now|today only)\b/gi
  const urgencyMatches = [...message.matchAll(urgencyPattern)].map(m => m[0])
  if (urgencyMatches.length > 0) {
    indicators.push({
      category: "Urgency",
      explanation: "Uses urgent language to pressure quick action, a common spam tactic.",
      matches: [...new Set(urgencyMatches)],
    })
  }

  // URLs
  const urlPattern = /https?:\/\/[^\s]+/gi
  const urlMatches = [...message.matchAll(urlPattern)].map(m => m[0])
  if (urlMatches.length > 0) {
    indicators.push({
      category: "Links",
      explanation: "Contains URLs, which are often used in spam to direct users to malicious websites.",
      matches: urlMatches,
    })
  }

  // Email addresses
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi
  const emailMatches = [...message.matchAll(emailPattern)].map(m => m[0])
  if (emailMatches.length > 0) {
    indicators.push({
      category: "Email Addresses",
      explanation: "Contains email addresses, which may be used for phishing or spam distribution.",
      matches: emailMatches,
    })
  }

  // Excessive capitalization
  const capsWords = message.match(/\b[A-Z]{3,}\b/g) || []
  if (capsWords.length > 2) {
    indicators.push({
      category: "Formatting",
      explanation: "Contains excessive capitalization, which is a common spam characteristic.",
      matches: capsWords.slice(0, 5),
    })
  }

  // Excessive punctuation
  const exclamationCount = (message.match(/!/g) || []).length
  const questionCount = (message.match(/\?/g) || []).length
  if (exclamationCount > 2 || questionCount > 3) {
    indicators.push({
      category: "Formatting",
      explanation: "Contains excessive punctuation marks, which is often used in spam to create emphasis.",
      matches: exclamationCount > 2 ? [`${exclamationCount} exclamation marks`] : [`${questionCount} question marks`],
    })
  }

  return indicators
}

/**
 * Highlight suspicious words in the message
 */
function highlightSuspiciousWords(message: string, indicators: SpamIndicator[]): React.ReactNode {
  if (indicators.length === 0) {
    return message
  }

  // Collect all exact matches to highlight (preserve case)
  const matchesToHighlight = new Set<string>()
  indicators.forEach(indicator => {
    indicator.matches.forEach(match => {
      matchesToHighlight.add(match)
    })
  })

  // Create regex pattern from all matches, escaping special characters
  const pattern = Array.from(matchesToHighlight)
    .map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length) // Sort by length (longest first) to match longer phrases first
    .join('|')

  if (!pattern) {
    return message
  }

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let keyCounter = 0

  let match
  while ((match = regex.exec(message)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index))
    }
    
    // Add highlighted match
    parts.push(
      <mark
        key={`highlight-${keyCounter++}`}
        className="bg-destructive/20 text-destructive font-semibold px-1 rounded"
      >
        {match[0]}
      </mark>
    )
    
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex))
  }

  return parts.length > 0 ? <>{parts}</> : message
}

/**
 * Get icon for indicator category
 */
function getIndicatorIcon(category: string) {
  const iconClass = "h-4 w-4 text-destructive"
  switch (category) {
    case "Phishing":
      return <Shield className={iconClass} />
    case "Scam":
      return <AlertTriangle className={iconClass} />
    case "Financial":
      return <DollarSign className={iconClass} />
    case "Identity Theft":
      return <Lock className={iconClass} />
    case "Urgency":
      return <Zap className={iconClass} />
    case "Links":
      return <LinkIcon className={iconClass} />
    case "Email Addresses":
      return <Mail className={iconClass} />
    default:
      return <Info className={iconClass} />
  }
}

interface SpamIndicator {
  category: string
  explanation: string
  matches: string[]
}

