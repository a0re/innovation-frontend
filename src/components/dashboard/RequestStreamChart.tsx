import { useMemo } from "react"
import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useChartColors } from "@/lib/chart-colors"
import type { TrendPoint } from "@/types"
import { InsightCard } from "@/components/dashboard/InsightCard"

interface RequestStreamChartProps {
  data: TrendPoint[]
  period: "hour" | "day" | "week" | "month"
  onPeriodChange?: (period: "hour" | "day" | "week" | "month") => void
  isLoading?: boolean
}

const PERIOD_OPTIONS: Array<{ label: string; value: RequestStreamChartProps["period"] }> = [
  { label: "Hourly", value: "hour" },
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
]

type ChartTooltipPayload = {
  dataKey?: string
  value?: number
  payload?: TrendPoint
}

function RequestStreamChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: ChartTooltipPayload[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const spam = payload.find((entry) => entry?.dataKey === "spam")
  const ham = payload.find((entry) => entry?.dataKey === "ham")
  const total = payload.find((entry) => entry?.dataKey === "total")
  const basePayload = payload[0]?.payload

  return (
    <div className="rounded-lg border bg-background p-3 text-sm shadow-md">
      <div className="font-semibold">{label}</div>
      {typeof spam?.value === "number" ? (
        <div className="text-destructive">Spam: {spam.value.toLocaleString()}</div>
      ) : null}
      {typeof ham?.value === "number" ? (
        <div className="text-primary">Ham: {ham.value.toLocaleString()}</div>
      ) : null}
      {typeof total?.value === "number"
        ? (
            <div className="text-foreground">
              Total: {total.value.toLocaleString()}
            </div>
          )
        : typeof basePayload?.total === "number"
        ? (
            <div className="text-foreground">
              Total: {basePayload.total.toLocaleString()}
            </div>
          )
        : null}
    </div>
  )
}

export function RequestStreamChart({ data, period, onPeriodChange, isLoading = false }: RequestStreamChartProps) {
  const colors = useChartColors()

  const chartData = useMemo(() => {
    return data.map((point) => ({
      period: point.period,
      spam: point.spam_count,
      ham: point.ham_count,
      total: point.total,
    }))
  }, [data])

  const chartAnimationKey = useMemo(
    () => `${period}-${chartData.length > 0 ? chartData[chartData.length - 1]?.period : "empty"}`,
    [period, chartData],
  )

  return (
    <InsightCard
      title="Request Stream"
      description="Volume of spam versus legitimate messages over time"
      action={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {onPeriodChange ? (
            <ButtonGroup>
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={period === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPeriodChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          ) : null}
        </div>
      }
      contentClassName="pt-0"
    >
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No trend data available yet.
        </div>
      ) : (
        <div className="h-128">
          {/* Remounts on period change so the lines animate between ranges */}
          <ResponsiveContainer key={chartAnimationKey} width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.mutedForeground} opacity={0.2} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<RequestStreamChartTooltip />} cursor={{ stroke: colors.border }} />
              <Legend verticalAlign="top" />
              <Line
                type="monotone"
                dataKey="spam"
                stroke={colors.destructive}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Spam"
                animationDuration={500}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="ham"
                stroke={colors.chart2}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Ham"
                animationDuration={500}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke={colors.chart3}
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                name="Total"
                animationDuration={500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </InsightCard>
  )
}
