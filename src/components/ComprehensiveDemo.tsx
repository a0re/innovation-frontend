import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Shield, Zap, BarChart3, Brain, Target, Sparkles } from "lucide-react"

export function ComprehensiveDemo() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Machine Learning
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Advanced Spam Detection
            <span className="block text-primary mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Protect your inbox with AI-powered spam classification. Our ensemble of machine learning models
            delivers accurate, real-time spam detection with confidence scoring.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Try It Now
            </Button>
            <Button size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">99.2%</div>
              <div className="text-sm text-muted-foreground mt-2">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground mt-2">ML Models</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">&lt;50ms</div>
              <div className="text-sm text-muted-foreground mt-2">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground mt-2">Spam Clusters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to detect and analyze spam with cutting-edge machine learning
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Ensemble Learning</CardTitle>
              <CardDescription>Multi-model consensus for better accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Combines Multinomial Naive Bayes, Logistic Regression, and Linear SVM for robust predictions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-Time Classification</CardTitle>
              <CardDescription>Instant results with confidence scores</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get immediate feedback on messages with detailed confidence metrics from each model.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Clustering Analysis</CardTitle>
              <CardDescription>Identify spam campaigns and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                K-means clustering reveals spam subtypes and helps track coordinated attacks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Comprehensive insights and visualizations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track performance with confusion matrices, ROC curves, and detailed metrics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Battle-Tested Models</CardTitle>
              <CardDescription>Trained on thousands of examples</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our models are trained on diverse SMS and email datasets with rigorous validation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Feature Engineering</CardTitle>
              <CardDescription>22+ sophisticated text features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced TF-IDF vectorization combined with custom features for optimal detection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Fight Spam?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start detecting spam with confidence using our AI-powered system
            </p>
            <Button size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>SpamGuard AI - Innovation Project 2</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with React, FastAPI, and Machine Learning
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
