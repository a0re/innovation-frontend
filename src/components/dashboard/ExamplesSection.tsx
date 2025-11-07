import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"

/**
 * Example messages section
 */
interface ExamplesSectionProps {
  examples: {
    spam: string[]
    not_spam: string[]
  }
}

export function ExamplesSection({ examples }: ExamplesSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Example Spam Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {examples.spam.slice(0, 3).map((msg, i) => (
              <div key={i} className="p-3 rounded-md bg-destructive/5 border border-destructive/20">
                <p className="text-sm text-destructive line-clamp-2">{msg}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            Example Legitimate Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {examples.not_spam.slice(0, 3).map((msg, i) => (
              <div
                key={i}
                className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20"
              >
                <p className="text-sm text-emerald-700 dark:text-emerald-300 line-clamp-2">{msg}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
