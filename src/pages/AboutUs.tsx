import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/common/PageHeader"
import {
  Shield,
  Target,
  Users,
  Zap,
  Award,
  Heart,
} from "lucide-react"

/**
 * About Us page component
 */
export function AboutUs() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <PageHeader
        title="About Us"
        description="Learn about our mission to combat spam with AI"
      />

      {/* Mission Statement */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            At AI4Cyber we bring together the security, data, and engineering work completed across
            Innovation Project assignments into a single, production-style platform. The solution couples
            a FastAPI backend, a React + Vite front-end, and scikit-learn models to provide explainable
            spam detection with real-time analytics so teams can keep inboxes clean without guesswork.
          </p>
        </CardContent>
      </Card>

      {/* Values Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ValueCard
            icon={<Shield className="h-5 w-5 text-primary" />}
            title="Security First"
            description="We prioritize the security and privacy of your data. Our models are designed with privacy-preserving techniques and robust security measures."
          />
          <ValueCard
            icon={<Zap className="h-5 w-5 text-primary" />}
            title="Innovation"
            description="We continuously innovate and improve our spam detection algorithms using the latest advances in machine learning and natural language processing."
          />
          <ValueCard
            icon={<Award className="h-5 w-5 text-primary" />}
            title="Excellence"
            description="We strive for excellence in everything we do, from model accuracy to user experience, ensuring our platform delivers the best results."
          />
          <ValueCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="User-Centric"
            description="Our users are at the heart of everything we do. We design our solutions based on real-world needs and feedback from our community."
          />
          <ValueCard
            icon={<Heart className="h-5 w-5 text-primary" />}
            title="Transparency"
            description="We believe in transparency. Our models and methodologies are clearly documented, and we provide detailed insights into our predictions."
          />
          <ValueCard
            icon={<Target className="h-5 w-5 text-primary" />}
            title="Accuracy"
            description="We are committed to providing the most accurate spam detection possible through ensemble methods and rigorous model validation."
          />
        </div>
      </div>

      {/* Technology Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Our Technology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TechSection
              title="Ensemble Learning"
              description="We use an ensemble of three powerful machine learning models: Multinomial Naive Bayes, Logistic Regression, and Linear Support Vector Classifier. This voting-based approach ensures robust and reliable predictions."
            />
            <TechSection
              title="Advanced Feature Engineering"
              description="Our system combines TF-IDF vectorization with 22+ custom text features, including message length, special character patterns, URL presence, and more, to capture the nuanced characteristics of spam messages."
            />
            <TechSection
              title="K-Means Clustering"
              description="We employ unsupervised learning through K-means clustering to identify patterns and group similar messages, providing deeper insights into spam characteristics."
            />
            <TechSection
              title="Continuous Improvement"
              description="Our models are regularly updated and refined based on new data and emerging spam patterns, ensuring we stay ahead of evolving threats."
            />
            <TechSection
              title="Observable Full Stack"
              description="Telemetry is persisted in SQLite via the FastAPI service and visualised with Recharts on the dashboard, giving instant feedback loops for model health, traffic volume, and cluster behaviour."
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Our Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AI4Cyber is maintained by a cross-disciplinary student team that spans data science,
            cybersecurity, and product engineering. We lean on open-source tooling—FastAPI, SQLite,
            scikit-learn, and modern React components—to deliver a transparent spam defense workflow
            that other innovators can extend. The work you see here is the direct continuation of
            Assignment&nbsp;1 research and Assignment&nbsp;2 modelling efforts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Value card component
 */
function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

/**
 * Technology section component
 */
function TechSection({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
