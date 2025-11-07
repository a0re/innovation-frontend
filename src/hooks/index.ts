import { useState, useCallback, useEffect } from "react"
import { MESSAGES } from "@/constants"

/**
 * Generic data fetching hook with loading and error states
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : MESSAGES.ERRORS.FETCH_DATA_FAILED
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    execute()
  }, dependencies)

  const refetch = useCallback(() => execute(), [execute])

  return { data, loading, error, refetch }
}

/**
 * Hook for handling form submission with loading state
 */
export function useAsyncAction<T, E = Error>(
  asyncFn: (input: T) => Promise<void>,
  onSuccess?: () => void,
  onError?: (error: E) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(
    async (input: T) => {
      setLoading(true)
      setError(null)
      try {
        await asyncFn(input)
        onSuccess?.()
      } catch (err) {
        const error = err as E
        setError(error)
        onError?.(error)
      } finally {
        setLoading(false)
      }
    },
    [asyncFn, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setError(null)
    setLoading(false)
  }, [])

  return { loading, error, execute, reset }
}

/**
 * Hook for managing form state with validation
 */
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  onSubmit?: (state: T) => Promise<void> | void
) {
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((key: keyof T, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }, [errors])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit?.(state)
      } finally {
        setIsSubmitting(false)
      }
    },
    [state, onSubmit]
  )

  const reset = useCallback(() => {
    setState(initialState)
    setErrors({})
  }, [initialState])

  return {
    state,
    setState,
    updateField,
    errors,
    setErrors,
    isSubmitting,
    handleSubmit,
    reset,
  }
}

/**
 * Hook for managing pagination
 */
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(pageNumber)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for local storage sync
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}
