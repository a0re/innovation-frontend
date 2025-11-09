import React from "react"
import type { PageHeaderProps } from "@/types"

/**
 * Page header component with title and description
 */
export const PageHeader = React.memo<PageHeaderProps>(({ title, description }) => (
  <div className="mb-10 flex flex-col gap-3">
    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-[2.75rem]">{title}</h1>
    {description ? <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p> : null}
  </div>
))

PageHeader.displayName = "PageHeader"

