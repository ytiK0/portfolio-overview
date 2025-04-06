import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
) {
  const getInitial = useCallback(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) return JSON.parse(item) as T
      return initialValue
    }
    catch {
      return initialValue
    }
  }, [key, initialValue])

  const [value, setValueState] = useState<T>(getInitial)

  const setValue: Dispatch<SetStateAction<T>> = useCallback(update => {
    const newValue = update instanceof Function ? update(getInitial()) : update
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(new Event('local-storage'))
      setValueState(newValue)
    }
    catch {}
  }, [key, getInitial]);

  const removeValue = useCallback(() => {
    localStorage.removeItem(key)
    window.dispatchEvent(new Event('local-storage'))
    setValueState(initialValue)
  }, [key, initialValue])

  useEffect(() => {
    const handleChange = () => setValueState(getInitial())

    window.addEventListener('storage', handleChange)
    window.addEventListener('local-storage', handleChange)
    return () => {
      window.removeEventListener('storage', handleChange)
      window.removeEventListener('local-storage', handleChange)
    }
  }, [getInitial])

  return [value, setValue, removeValue] as const;
}
