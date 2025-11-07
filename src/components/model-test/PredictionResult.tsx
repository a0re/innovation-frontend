import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Brain } from "lucide-react"
import type { MultiModelPrediction } from "@/types"
import { ModelPredictionRow } from "./ModelPredictionRow"

/**
 * Prediction result display component
 */
export function PredictionResult({ prediction }: { prediction: MultiModelPrediction }) {
  const isSpam = prediction.ensemble.is_spam
  const confidence = prediction.ensemble.confidence * 100

  return (
    <div className="mt-6 space-y-4">
      {/* Main Result Card */}
      <div
        className={`p-6 rounded-lg border-2 ${
          isSpam
            ? "bg-destructive/5 border-destructive/30"
            : "bg-emerald-500/5 border-emerald-500/30"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isSpam ? (
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {isSpam ? "Spam Detected" : "Message is Safe"}
              </h3>
              <p className="text-sm text-muted-foreground">Ensemble prediction from 3 models</p>
            </div>
          </div>
          <Badge
            variant={isSpam ? "destructive" : "default"}
            className={`text-lg px-4 py-1 ${!isSpam && "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500"}`}
          >
            {isSpam ? "SPAM" : "SAFE"}
          </Badge>
        </div>

        {/* Confidence Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-md bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Confidence</span>
            </div>
            <div className="text-2xl font-bold">{confidence.toFixed(1)}%</div>
          </div>
          <div className="p-3 rounded-md bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Model Votes</span>
            </div>
            <div className="text-2xl font-bold">
              {prediction.ensemble.spam_votes}/{prediction.ensemble.total_votes}
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Confidence Level</span>
            <span>{confidence >= 80 ? "High" : confidence >= 60 ? "Medium" : "Low"}</span>
          </div>
          <div className="h-2 rounded-full bg-background/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isSpam ? "bg-destructive" : "bg-emerald-600 dark:bg-emerald-500"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Individual Model Results */}
      <div className="p-5 rounded-lg border bg-card">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Individual Model Predictions
        </h4>
        <div className="space-y-3">
          <ModelPredictionRow
            name="Multinomial Naive Bayes"
            isSpam={prediction.multinomial_nb.is_spam}
            confidence={prediction.multinomial_nb.confidence}
          />
          <ModelPredictionRow
            name="Logistic Regression"
            isSpam={prediction.logistic_regression.is_spam}
            confidence={prediction.logistic_regression.confidence}
          />
          <ModelPredictionRow
            name="Linear SVC"
            isSpam={prediction.linear_svc.is_spam}
            confidence={prediction.linear_svc.confidence}
          />
        </div>
      </div>
    </div>
  )
}

