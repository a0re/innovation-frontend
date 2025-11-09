import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Brain, Layers } from "lucide-react"
import type { MultiModelPrediction } from "@/types"
import { ModelPredictionRow } from "./ModelPredictionRow"
import { SpamExplanation } from "./SpamExplanation"
import { useSettings } from "@/contexts/SettingsContext"

/**
 * Prediction result display component
 */
export function PredictionResult({ prediction }: { prediction: MultiModelPrediction }) {
  const { settings } = useSettings()
  const isSpam = prediction.ensemble.is_spam
  const confidence = prediction.ensemble.confidence * 100
  const meetsThreshold = confidence >= settings.confidenceThreshold

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
              <p className="text-sm text-muted-foreground">
                Ensemble prediction from{" "}
                {Object.values(settings.models).filter(Boolean).length} model
                {Object.values(settings.models).filter(Boolean).length !== 1 ? "s" : ""}
              </p>
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
          <div
            className={`p-3 rounded-md ${
              isSpam
                ? "bg-destructive/5 dark:bg-destructive/10"
                : "bg-card shadow-sm dark:border dark:border-emerald-500/25 dark:bg-emerald-500/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Confidence</span>
            </div>
            <div className="text-2xl font-bold">{confidence.toFixed(1)}%</div>
            {isSpam && !meetsThreshold && (
              <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                Below threshold ({settings.confidenceThreshold}%)
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-md ${
              isSpam
                ? "bg-destructive/5 dark:bg-destructive/10"
                : "bg-card shadow-sm dark:border dark:border-emerald-500/25 dark:bg-emerald-500/10"
            }`}
          >
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
        {settings.display.showConfidenceBar && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Confidence Level</span>
              <span>{confidence >= 80 ? "High" : confidence >= 60 ? "Medium" : "Low"}</span>
            </div>
            <div
              className="relative h-3 rounded-full bg-background/60"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(confidence.toFixed(1))}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  isSpam ? "bg-destructive" : "bg-emerald-600 dark:bg-emerald-500"
                }`}
                style={{ width: `${Math.max(0, Math.min(confidence, 100))}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground">
                {confidence.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spam Explanation */}
      {isSpam && settings.display.showSpamExplanation && (
        <SpamExplanation prediction={prediction} />
      )}

      {/* Cluster Information */}
      {isSpam && prediction.cluster && settings.display.showClusterInfo && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              Spam Type Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Spam Type</span>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {prediction.cluster.icon && <span className="text-2xl">{prediction.cluster.icon}</span>}
                    {prediction.cluster.name || `Cluster ${prediction.cluster.cluster_id}`}
                  </div>
                  {prediction.cluster.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {prediction.cluster.description}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <div className="text-xl font-bold">
                    {(prediction.cluster.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              {prediction.cluster.top_terms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Top Characteristic Terms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.cluster.top_terms.slice(0, 8).map((term, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs font-mono bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                      >
                        {term.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Model Results */}
      {settings.display.showIndividualModels && (
        <div className="rounded-lg border bg-card p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Individual Model Predictions
          </h4>
          <div className="space-y-3">
            {settings.models.multinomial_nb && (
              <ModelPredictionRow
                name="Multinomial Naive Bayes"
                isSpam={prediction.multinomial_nb.is_spam}
                confidence={prediction.multinomial_nb.confidence}
              />
            )}
            {settings.models.logistic_regression && (
              <ModelPredictionRow
                name="Logistic Regression"
                isSpam={prediction.logistic_regression.is_spam}
                confidence={prediction.logistic_regression.confidence}
              />
            )}
            {settings.models.linear_svc && (
              <ModelPredictionRow
                name="Linear SVC"
                isSpam={prediction.linear_svc.is_spam}
                confidence={prediction.linear_svc.confidence}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

