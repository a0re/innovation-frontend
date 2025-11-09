import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ModelSettings {
  multinomial_nb: boolean
  logistic_regression: boolean
  linear_svc: boolean
}

export interface DisplayPreferences {
  showConfidenceBar: boolean
  showIndividualModels: boolean
  showClusterInfo: boolean
  showSpamExplanation: boolean
}

export interface AppSettings {
  confidenceThreshold: number // 0-100, default 50
  models: ModelSettings
  display: DisplayPreferences
}

const DEFAULT_SETTINGS: AppSettings = {
  confidenceThreshold: 50,
  models: {
    multinomial_nb: true,
    logistic_regression: true,
    linear_svc: true,
  },
  display: {
    showConfidenceBar: true,
    showIndividualModels: true,
    showClusterInfo: true,
    showSpamExplanation: true,
  },
}

const STORAGE_KEY = "ai4cyber-settings"

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to handle missing fields
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
    return DEFAULT_SETTINGS
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }, [settings])

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      models: { ...prev.models, ...updates.models },
      display: { ...prev.display, ...updates.display },
    }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

