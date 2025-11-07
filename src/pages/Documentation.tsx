import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common"
import {
  BookOpen,
  Code,
  Database,
  Layers,
  Settings,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react"

/**
 * Documentation page component
 */
export function Documentation() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <PageHeader
        title="Documentation"
        description="Complete guide to using SpamGuard AI"
      />

      {/* Quick Start */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>Get started with SpamGuard AI in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StepItem step={1} title="Navigate to Model Test" description="Go to the Model Test page from the navigation menu to start testing messages." />
            <StepItem
              step={2}
              title="Enter Your Message"
              description="Type or paste the message you want to analyze in the text area."
            />
            <StepItem
              step={3}
              title="Get Results"
              description='Click "Analyze Message" to receive instant spam detection results with confidence scores.'
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
              method="POST"
              endpoint="/api/predict"
              description="Submit a message for spam detection analysis."
              request={`{
  "message": "Your message text here"
}`}
              response={`{
  "is_spam": true,
  "confidence": 0.95,
  "spam_type": 2,
  "cluster_id": 1,
  "top_terms": ["free", "click", "win"]
}`}
            />
            <APIEndpoint
              method="GET"
              endpoint="/api/stats"
              description="Retrieve overall statistics about predictions."
              response={`{
  "total_predictions": 1234,
  "spam_detected": 456,
  "not_spam_detected": 778,
  "average_confidence": 0.89
}`}
            />
            <APIEndpoint
              method="GET"
              endpoint="/api/cluster-info"
              description="Get information about message clusters and patterns."
              response={`{
  "total_clusters": 8,
  "silhouette_score": 0.342,
  "clusters": [...]
}`}
            />
            <APIEndpoint
              method="GET"
              endpoint="/api/examples"
              description="Fetch example messages for spam and non-spam categories."
            />
            <APIEndpoint
              method="GET"
              endpoint="/api/historical-predictions"
              description="Retrieve historical prediction data for trend analysis."
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
                  . This is determined by the majority vote of the three ensemble models.
                </>
              }
            />
            <ResultExplanation
              title="Confidence Score"
              description="The confidence score (0-100%) indicates how certain the model is about its prediction. Higher scores mean greater confidence. Scores above 80% indicate high confidence."
            />
            <ResultExplanation
              title="Spam Type"
              description="For spam messages, the model assigns a spam type (0-7) based on clustering analysis, which helps categorize different kinds of spam patterns."
            />
            <ResultExplanation
              title="Top Terms"
              description="The most influential words from the cluster that contributed to the classification, helping you understand why a message was flagged."
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
              answer="Our ensemble model achieves high accuracy through the combination of three different machine learning algorithms. The exact accuracy varies based on message types, but typically exceeds 95% on standard spam detection benchmarks."
            />
            <FAQItem
              question="What languages are supported?"
              answer="Currently, the model is optimized for English language messages. Support for additional languages is planned for future releases."
            />
            <FAQItem
              question="Is my data stored?"
              answer="Predictions are stored anonymously for analytics and model improvement purposes. No personally identifiable information is retained."
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
