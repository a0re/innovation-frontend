/**
 * Utility to get chart colors that work with SVG elements
 * Since SVG doesn't support CSS variables directly, we need to get computed values
 */

import { useEffect, useState } from 'react'

/**
 * Get a CSS variable value as a computed color
 */
function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') {
    // Fallback colors for SSR
    return '#888888'
  }
  
  const root = document.documentElement
  const value = getComputedStyle(root).getPropertyValue(variable).trim()
  
  if (!value) {
    // Fallback if variable not found
    console.warn(`CSS variable ${variable} not found`)
    return '#888888'
  }
  
  return value
}

/**
 * Chart color utilities that work with SVG elements
 */
export const chartColors = {
  get chart1() {
    return getCSSVariable('--chart-1')
  },
  get chart2() {
    return getCSSVariable('--chart-2')
  },
  get chart3() {
    return getCSSVariable('--chart-3')
  },
  get chart4() {
    return getCSSVariable('--chart-4')
  },
  get chart5() {
    return getCSSVariable('--chart-5')
  },
  get chart6() {
    return getCSSVariable('--chart-6')
  },
  get destructive() {
    return getCSSVariable('--destructive')
  },
  get mutedForeground() {
    return getCSSVariable('--muted-foreground')
  },
  get foreground() {
    return getCSSVariable('--foreground')
  },
  get border() {
    return getCSSVariable('--border')
  },
  get background() {
    return getCSSVariable('--background')
  },
}

/**
 * React hook to get chart colors (reactive to theme changes)
 */
export function useChartColors() {
  const [colors, setColors] = useState({
    chart1: chartColors.chart1,
    chart2: chartColors.chart2,
    chart3: chartColors.chart3,
    chart4: chartColors.chart4,
    chart5: chartColors.chart5,
    chart6: chartColors.chart6,
    destructive: chartColors.destructive,
    mutedForeground: chartColors.mutedForeground,
    foreground: chartColors.foreground,
    border: chartColors.border,
    background: chartColors.background,
  })

  useEffect(() => {
    // Update colors when theme changes
    const updateColors = () => {
      setColors({
        chart1: chartColors.chart1,
        chart2: chartColors.chart2,
        chart3: chartColors.chart3,
        chart4: chartColors.chart4,
        chart5: chartColors.chart5,
        chart6: chartColors.chart6,
        destructive: chartColors.destructive,
        mutedForeground: chartColors.mutedForeground,
        foreground: chartColors.foreground,
        border: chartColors.border,
        background: chartColors.background,
      })
    }

    // Listen for theme changes
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Also listen for storage changes (theme toggle)
    window.addEventListener('storage', updateColors)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', updateColors)
    }
  }, [])

  return colors
}

