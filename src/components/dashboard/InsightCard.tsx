import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InsightCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function InsightCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
}: InsightCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold leading-tight">{title}</CardTitle>
            {description ? <CardDescription className="text-sm leading-snug">{description}</CardDescription> : null}
          </div>
          {action ? <CardAction>{action}</CardAction> : null}
        </div>
      </CardHeader>
      <CardContent className={cn("pt-6", contentClassName)}>{children}</CardContent>
    </Card>
  )
}
