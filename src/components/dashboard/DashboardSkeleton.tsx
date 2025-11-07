import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"

/**
 * Dashboard skeleton loader
 */
export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
