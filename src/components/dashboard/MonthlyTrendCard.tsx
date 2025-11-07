import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

/**
 * Monthly trend visualization
 */
interface MonthlyTrendCardProps {
  data: any[]
}

export function MonthlyTrendCard({ data }: MonthlyTrendCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Spam detection patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="spam" stroke="hsl(var(--destructive))" />
            <Line type="monotone" dataKey="not_spam" stroke="hsl(var(--primary))" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
