import {
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export const THEME_STORAGE_KEY = 'javeriana.theme.v1'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function parsePreference(value: string | null): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system'
}

function readPreference(): ThemePreference {
  try {
    return parsePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

function subscribeToSystem(onChange: () => void) {
  const media = window.matchMedia?.(MEDIA_QUERY)
  media?.addEventListener('change', onChange)
  return () => media?.removeEventListener('change', onChange)
}

function getSystemDark() {
  return window.matchMedia?.(MEDIA_QUERY).matches ?? false
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)
  const systemDark = useSyncExternalStore(
    subscribeToSystem,
    getSystemDark,
    () => false,
  )
  const isDark =
    preference === 'dark' || (preference === 'system' && systemDark)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#101923' : '#fafafa')
  }, [isDark])

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        setPreference(readPreference())
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function chooseTheme(value: ThemePreference) {
    setPreference(value)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch {
      // A blocked or full storage must not prevent changing the current theme.
    }
  }

  return { isDark, chooseTheme }
}
