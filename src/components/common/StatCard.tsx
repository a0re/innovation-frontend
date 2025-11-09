import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatCardProps } from "@/types"

/**
 * Reusable stat card component for displaying key metrics
 */
export const StatCard = React.memo<StatCardProps>(
  ({ title, value, description, icon, variant = "default" }) => {
    const variantClasses = {
      default: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      danger: "text-destructive",
      warning: "text-yellow-600 dark:text-yellow-400",
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${variantClasses[variant]}`}>{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardContent>
      </Card>
    )
  }
)

StatCard.displayName = "StatCard"

