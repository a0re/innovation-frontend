import { useMemo } from "react"
import type { CSSProperties } from "react"
import {
  eachDayOfInterval,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfWeek,
  startOfYear,
} from "date-fns"
import type { RecentPrediction } from "@/types"
import { InsightCard } from "@/components/dashboard/InsightCard"
import { useChartColors } from "@/lib/chart-colors"

interface MonthlySpamHeatmapProps {
  predictions: RecentPrediction[]
  isLoading?: boolean
  activeCluster?: {
    id: number
    label?: string
    topTerms?: string[]
  } | null
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEK_START: { weekStartsOn: 1 } = { weekStartsOn: 1 }

type HeatmapCell = { total: number }

type HeatmapComputation = {
  weeks: Date[][]
  grid: HeatmapCell[][]
  maxSpam: number
  rangeLabel: string
  windowStart: Date
  windowEnd: Date
}

export function MonthlySpamHeatmap({
  predictions,
  isLoading = false,
  activeCluster = null,
}: MonthlySpamHeatmapProps) {
  const colors = useChartColors()

  const { weeks, grid, maxSpam, rangeLabel, windowStart, windowEnd } = useMemo<HeatmapComputation>(() => {
  const today = startOfDay(new Date())
  const windowStart = startOfYear(today)
  const windowEnd = endOfYear(today)
    const calendarStart = startOfWeek(windowStart, WEEK_START)
    const calendarEnd = endOfWeek(windowEnd, WEEK_START)

    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    const weeks: Date[][] = []
    for (let index = 0; index < allDays.length; index += 7) {
      weeks.push(allDays.slice(index, index + 7))
    }

    const grid = createEmptyGrid(weeks.length)
    const dateIndex = new Map<string, { weekIndex: number; dayIndex: number }>()

    weeks.forEach((week, weekIndex) => {
      week.forEach((date, dayIndex) => {
        dateIndex.set(format(date, "yyyy-MM-dd"), { weekIndex, dayIndex })
      })
    })

    const spamPredictions = predictions?.filter((prediction) => prediction.is_spam) ?? []

    spamPredictions.forEach((prediction) => {
      const timestamp = new Date(prediction.timestamp)
      const key = format(timestamp, "yyyy-MM-dd")
      const position = dateIndex.get(key)
      if (!position) {
        return
      }
      grid[position.dayIndex][position.weekIndex].total += 1
    })

    const maxSpam = grid.reduce((max, row) => {
      const rowMax = row.reduce((rowAcc, cell) => Math.max(rowAcc, cell.total), 0)
      return Math.max(max, rowMax)
    }, 0)

    const rangeLabel = `${format(windowStart, "MMM d, yyyy")} – ${format(windowEnd, "MMM d, yyyy")}`

    return {
      weeks,
      grid,
      maxSpam,
      rangeLabel,
      windowStart,
      windowEnd,
    }
  }, [predictions])

  const clusterLabel = activeCluster
    ? `Cluster ${activeCluster.id}${activeCluster.label ? ` • ${activeCluster.label}` : ""}`
    : "All clusters"

  return (
    <InsightCard
      title="Spam Volume Heatmap"
      description={`${clusterLabel} • daily spam pattern for ${format(windowStart, "yyyy")}`}
      contentClassName="pt-0"
    >
      {isLoading ? (
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      ) : predictions.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No predictions available for this view.
        </div>
      ) : maxSpam === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <div>No spam activity detected in {format(windowStart, "yyyy")}.</div>
          <div className="text-xs">Window: {rangeLabel}</div>
        </div>
      ) : (
        <div className="space-y-4 overflow-x-auto">
          <div className="flex min-w-full justify-center">
            <div
              className="inline-grid min-w-max gap-px"
              style={{ gridTemplateColumns: `auto repeat(${Math.max(weeks.length, 1)}, minmax(22px, 1fr))` }}
            >
              <div className="h-5" />
              {weeks.map((week, weekIndex) => {
                const monthLabel = format(week[0]!, "MMM")
                const previousLabelIndex = weekIndex - 1
                const previousMonth =
                  previousLabelIndex >= 0 ? format(weeks[previousLabelIndex][0]!, "MMM") : null
                const showLabel = weekIndex === 0 || previousMonth !== monthLabel

                return (
                  <div
                    key={`week-label-${weekIndex}`}
                    className="flex h-5 items-center justify-center text-[11px] text-muted-foreground"
                  >
                    {showLabel ? monthLabel : ""}
                  </div>
                )
              })}

              {DAYS.map((dayLabel, dayIndex) => (
                <div key={`row-${dayLabel}`} className="contents">
                  <div className="flex h-6 items-center justify-end pr-2 text-xs text-muted-foreground">
                    {dayLabel}
                  </div>
                  {weeks.map((week, weekIndex) => {
                    const date = week[dayIndex]!
                    const cell = grid[dayIndex][weekIndex]
                    const isOutsideRange = date < windowStart || date > windowEnd
                    const intensity = maxSpam > 0 ? cell.total / maxSpam : 0
                    const opacity = isOutsideRange
                      ? 0.06
                      : intensity > 0
                      ? 0.25 + intensity * 0.75
                      : 0.1

                    return (
                      <TooltipCell
                        key={`cell-${dayIndex}-${weekIndex}`}
                        date={date}
                        total={cell.total}
                        isOutsideRange={isOutsideRange}
                        color={colors.destructive}
                        opacity={opacity}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors.destructive, opacity: 0.1 }} />
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors.destructive, opacity: 0.45 }} />
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors.destructive, opacity: 0.9 }} />
            </div>
            <span>More</span>
            <span className="ml-4">Intensity indicates relative spam volume per day.</span>
          </div>
          <div className="text-xs text-muted-foreground">Window: {rangeLabel}</div>
        </div>
      )}
    </InsightCard>
  )
}

interface TooltipCellProps {
  date: Date
  total: number
  isOutsideRange: boolean
  color: string
  opacity: number
}

function TooltipCell({ date, total, isOutsideRange, color, opacity }: TooltipCellProps) {
  const cellStyle: CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "4px",
    transition: "transform 0.15s ease",
  }

  const backgroundStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "4px",
    backgroundColor: color,
    opacity,
  }

  return (
    <div
      className={isOutsideRange ? "relative" : "group relative hover:scale-105"}
      style={cellStyle}
      aria-label={`${format(date, "MMM d, yyyy")}: ${total} spam messages`}
    >
      <div style={backgroundStyle} />
      {!isOutsideRange ? (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max -translate-x-1/2 rounded-md border border-border bg-background px-3 py-2 text-xs shadow-lg group-hover:block">
          <div className="font-medium text-foreground">
            {format(date, "EEE, MMM d, yyyy")}
          </div>
          <div className="text-muted-foreground">
            {total.toLocaleString()} spam message{total === 1 ? "" : "s"}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function createEmptyGrid(weekCount: number): HeatmapCell[][] {
  return DAYS.map(() => Array.from({ length: weekCount }, () => ({ total: 0 })))
}
