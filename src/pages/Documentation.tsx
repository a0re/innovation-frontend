import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/PageHeader"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Code,
  Database,
  Layers,
  ListChecks,
  Settings,
  Target,
  Zap,
} from "lucide-react"

/**
 * Documentation page component
 */
export function Documentation() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <PageHeader
        title="Documentation"
  description="Complete guide to using AI4Cyber"
      />

      {/* Quick Start */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>Get started with AI4Cyber in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StepItem
              step={1}
              title="Open Model Test"
              description="Navigate to the Model Test page and choose the input type (text, file, email, or batch)."
            />
            <StepItem
              step={2}
              title="Provide Your Content"
              description="Type a message, upload a .txt/.csv file, or compose an email for the models to analyze."
            />
            <StepItem
              step={3}
              title="Review Results"
              description="Run the analysis to review the ensemble verdict, per-model votes, optional spam explanations, and see the results reflected in the dashboard analytics."
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Insights */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dashboard Insights
          </CardTitle>
          <CardDescription>Use the analytics workspace to stay ahead of spam trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardInsightItem
              icon={<Activity className="h-5 w-5 text-primary" />}
              title="Request Stream"
              description="Track live prediction volume, spam share, and confidence patterns across hour, day, week, or month windows."
            />
            <DashboardInsightItem
              icon={<CalendarDays className="h-5 w-5 text-primary" />}
              title="Year-to-Date Spam Heatmap"
              description="Explore day-by-day spam intensity for the current year, with optional filters per spam cluster."
            />
            <DashboardInsightItem
              icon={<Target className="h-5 w-5 text-primary" />}
              title="Cluster Explorer"
              description="Dive into spam clusters, their top terms, and distribution to surface emerging scam narratives."
            />
            <DashboardInsightItem
              icon={<ListChecks className="h-5 w-5 text-primary" />}
              title="Recent Predictions"
              description="Audit the latest predictions with ensemble verdicts, raw text, and user feedback in one place."
            />
          </div>
        </CardContent>
      </Card>

      {/* API Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            API Overview
          </CardTitle>
          <CardDescription>Understanding the API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <APIEndpoint
              method="GET"
              endpoint="/health"
              description="Verify that the backend service and models are ready."
            />
            <APIEndpoint
              method="POST"
              endpoint="/predict/multi-model"
              description="Submit a single message and receive ensemble plus per-model predictions."
              request={`{
  "message": "Congratulations! You've won a prize."
}`}
              response={`{
  "message": "Congratulations! You've won a prize.",
  "processed_message": "congratulations youve won a prize",
  "multinomial_nb": {
    "prediction": "spam",
    "confidence": 0.94,
    "is_spam": true
  },
  "logistic_regression": {
    "prediction": "spam",
    "confidence": 0.91,
    "is_spam": true
  },
  "linear_svc": {
    "prediction": "spam",
    "confidence": 0.92,
    "is_spam": true
  },
  "ensemble": {
    "prediction": "spam",
    "confidence": 0.92,
    "is_spam": true,
    "spam_votes": 3,
    "total_votes": 3
  },
  "cluster": {
    "cluster_id": 4,
    "name": "Prize & Lottery Spam",
    "short_name": "Lottery",
    "description": "Promises of winnings that require an action to claim",
    "icon": "🎉",
    "color": "#f97316",
    "confidence": 0.63,
    "total_clusters": 8,
    "top_terms": [
      { "term": "prize" },
      { "term": "click" },
      { "term": "winner" }
    ]
  },
  "timestamp": "2025-11-08T16:42:11Z"
}`}
            />
            <APIEndpoint
              method="POST"
              endpoint="/predict/batch"
              description="Send multiple messages at once. The response aggregates spam counts and individual predictions."
              request={`{
  "messages": [
    "Urgent: Verify your account",
    "Let's grab lunch tomorrow"
  ]
}`}
            />
            <APIEndpoint
              method="GET"
              endpoint="/stats"
              description="Retrieve overall statistics about predictions."
              response={`{
  "total_predictions": 1234,
  "spam_count": 456,
  "ham_count": 778,
  "spam_rate": 0.369,
  "avg_confidence": 0.89
}`}
            />
            <APIEndpoint
              method="GET"
              endpoint="/predictions/recent?limit=100"
              description="List the most recent predictions, useful for audit trails and examples."
            />
            <APIEndpoint
              method="GET"
              endpoint="/trends?period=month&limit=12"
              description="Fetch aggregated trend data for dashboards and reporting."
            />
            <APIEndpoint
              method="GET"
              endpoint="/analytics/clusters"
              description="Return spam volume grouped by AI4Cyber cluster labels to feed the distribution chart."
            />
            <APIEndpoint
              method="GET"
              endpoint="/cluster/info"
              description="Surface cluster metadata, top terms, and descriptive text for explainability tooling."
            />
            <APIEndpoint
              method="DELETE"
              endpoint="/predictions"
              description="Remove stored prediction records when you need a fresh start."
            />
          </div>
        </CardContent>
      </Card>

      {/* Model Architecture */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Model Architecture
          </CardTitle>
          <CardDescription>How our spam detection system works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Ensemble Voting Classifier
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our system uses three complementary machine learning models that vote on each prediction:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <ModelCard
                  name="Multinomial NB"
                  description="Probabilistic classifier based on Bayes' theorem, excellent for text classification."
                />
                <ModelCard
                  name="Logistic Regression"
                  description="Linear model that provides interpretable probability estimates."
                />
                <ModelCard
                  name="Linear SVC"
                  description="Support vector classifier optimized for high-dimensional text data."
                />
              </div>
            </div>

            <FeatureSection
              title="Feature Engineering"
              description="We extract 22+ custom features from each message:"
              features={[
                "Message length",
                "Capital letter ratio",
                "Special character count",
                "URL presence",
                "Numeric character ratio",
                "Currency symbol detection",
              ]}
            />

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                TF-IDF Vectorization
              </h4>
              <p className="text-sm text-muted-foreground">
                Text is converted to numerical features using Term Frequency-Inverse Document Frequency,
                which captures the importance of words in the message while reducing the weight of common words.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                K-Means Clustering
              </h4>
              <p className="text-sm text-muted-foreground">
                Messages are grouped into clusters based on similarity, helping identify spam patterns
                and providing insights into different types of spam messages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Understanding Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Understanding Results
          </CardTitle>
          <CardDescription>How to interpret the predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ResultExplanation
              title="Spam Classification"
              description={
                <>
                  The model outputs a binary classification:{" "}
                  <Badge variant="destructive">SPAM</Badge> or{" "}
                  <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                    NOT SPAM
                  </Badge>
                  . The ensemble verdict respects your configured confidence threshold from the Settings page.
                </>
              }
            />
            <ResultExplanation
              title="Confidence Score"
              description="Confidence values are returned for every model and the ensemble. Scores above 80% indicate high confidence; anything below your threshold will surface a caution badge."
            />
            <ResultExplanation
              title="Spam Type"
              description="For spam messages, AI4Cyber returns enriched cluster metadata (name, emoji, description) based on our eight k-means clusters so you can understand which pattern triggered the alert."
            />
            <ResultExplanation
              title="Top Terms"
              description="The most influential words from the cluster that contributed to the classification, helping you understand why a message was flagged."
            />
            <ResultExplanation
              title="Spam Indicators"
              description="When Spam Explanation is enabled in Settings, highlighted keywords, URLs, and formatting signals show what triggered the spam decision—ideal for explainability and user education."
            />
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Best Practices
          </CardTitle>
          <CardDescription>Tips for optimal results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <BestPracticeItem title="Provide Complete Messages" description="For best results, analyze the complete message text including subject lines and body content." />
            <BestPracticeItem
              title="Consider Context"
              description="While our model is highly accurate, always consider the context and source of messages."
            />
            <BestPracticeItem
              title="Review Low Confidence Results"
              description="Messages with confidence scores below 70% may benefit from manual review."
            />
            <BestPracticeItem
              title="Monitor Dashboard"
              description="Regularly check the dashboard for trends and patterns in your spam detection data."
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings & Controls
          </CardTitle>
          <CardDescription>Customize how predictions are made and displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <BestPracticeItem
              title="Adjust Confidence Threshold"
              description="Choose how strict the ensemble should be before marking content as spam."
            />
            <BestPracticeItem
              title="Toggle Individual Models"
              description="Enable or disable Multinomial NB, Logistic Regression, and Linear SVC depending on your needs."
            />
            <BestPracticeItem
              title="Optimize Display"
              description="Control confidence bars, spam explanations, and cluster info to match your workflow."
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FAQItem
              question="How accurate is the spam detection?"
              answer="Our ensemble model combines three complementary learners and scores around 94% macro accuracy on the curated SMS/email corpus used in Assignment&nbsp;2. Real-world performance varies with content and continues to improve as we retrain."
            />
            <FAQItem
              question="What languages are supported?"
              answer="Currently, the model is optimized for English language messages. Support for additional languages is planned for future releases."
            />
            <FAQItem
              question="Is my data stored?"
              answer="Prediction requests (including message text, processed tokens, and cluster IDs) are stored in a local SQLite database so the dashboard can show stats and trends. Use Settings → Danger Zone → Delete All Predictions to wipe the data at any time."
            />
            <FAQItem
              question="Can I integrate this with my application?"
              answer="Yes! Use our REST API endpoints to integrate spam detection into your own applications. Refer to the API Overview section for details."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Step item component for quick start
 */
function StepItem({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
        {step}
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

/**
 * API endpoint documentation component
 */
function APIEndpoint({
  method,
  endpoint,
  description,
  request,
  response,
}: {
  method: string
  endpoint: string
  description: string
  request?: string
  response?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="font-mono">
          {method}
        </Badge>
        <code className="text-sm">{endpoint}</code>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      {request && (
        <div className="bg-muted p-4 rounded-md mb-3">
          <p className="text-xs font-medium mb-2">Request Body:</p>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{request}</pre>
        </div>
      )}
      {response && (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-xs font-medium mb-2">Response:</p>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  )
}

/**
 * Model card component
 */
function ModelCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-3 rounded-md bg-muted">
      <Badge className="mb-2">{name}</Badge>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

/**
 * Feature section component
 */
function FeatureSection({
  title,
  description,
  features,
}: {
  title: string
  description: string
  features: string[]
}) {
  return (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-primary" />
        {title}
      </h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="grid md:grid-cols-2 gap-2">
        {features.map((feature) => (
          <div key={feature} className="text-sm p-2 rounded-md bg-muted">
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Result explanation component
 */
function ResultExplanation({
  title,
  description,
}: {
  title: string
  description: React.ReactNode
}) {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

/**
 * Best practice item component
 */
function BestPracticeItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function DashboardInsightItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-md border p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

/**
 * FAQ item component
 */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h4 className="font-medium mb-2">{question}</h4>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  )
}
