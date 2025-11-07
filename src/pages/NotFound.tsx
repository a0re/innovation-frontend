import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Not Found (404) page component
 */
export function NotFound() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 max-w-2xl">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="h-20 w-20 text-destructive mb-6" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/model-test">Test Model</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
