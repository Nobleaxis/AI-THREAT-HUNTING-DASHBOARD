import { useEffect, useRef, useState } from "react"

export const themes = {
  darkBlue: {
    name: "Dark Blue",
    variables: {
      "--bg-color": "#020617",
      "--card-color": "#0f172a",
      "--surface-color": "#1e293b",
      "--text-color": "#f8fafc",
      "--muted-text-color": "#cbd5e1",
      "--accent-color": "#2563eb",
      "--accent-hover-color": "#3b82f6",
      "--border-color": "#1e293b",
      "--danger-bg-color": "rgba(127, 29, 29, 0.5)",
      "--danger-text-color": "#fecaca",
      "--danger-border-color": "#991b1b",
    },
  },
  cyberGreen: {
    name: "Cyber Green",
    variables: {
      "--bg-color": "#030704",
      "--card-color": "#101510",
      "--surface-color": "#172017",
      "--text-color": "#d9ffe4",
      "--muted-text-color": "#8cffac",
      "--accent-color": "#22c55e",
      "--accent-hover-color": "#4ade80",
      "--border-color": "#1f4d2e",
      "--danger-bg-color": "rgba(69, 10, 10, 0.65)",
      "--danger-text-color": "#fecaca",
      "--danger-border-color": "#ef4444",
    },
  },
  lightMode: {
    name: "Light Mode",
    variables: {
      "--bg-color": "#f8fafc",
      "--card-color": "#ffffff",
      "--surface-color": "#eef2f7",
      "--text-color": "#111827",
      "--muted-text-color": "#475569",
      "--accent-color": "#2563eb",
      "--accent-hover-color": "#1d4ed8",
      "--border-color": "#d8e0ea",
      "--danger-bg-color": "#fee2e2",
      "--danger-text-color": "#7f1d1d",
      "--danger-border-color": "#fca5a5",
    },
  },
  purpleNight: {
    name: "Purple Night",
    variables: {
      "--bg-color": "#16051f",
      "--card-color": "#251334",
      "--surface-color": "#35204a",
      "--text-color": "#faf5ff",
      "--muted-text-color": "#d8b4fe",
      "--accent-color": "#8b5cf6",
      "--accent-hover-color": "#a78bfa",
      "--border-color": "#4c1d95",
      "--danger-bg-color": "rgba(127, 29, 29, 0.5)",
      "--danger-text-color": "#fecaca",
      "--danger-border-color": "#f87171",
    },
  },
  solarizedDark: {
    name: "Solarized Dark",
    variables: {
      "--bg-color": "#002b36",
      "--card-color": "#073642",
      "--surface-color": "#0b4552",
      "--text-color": "#eee8d5",
      "--muted-text-color": "#93a1a1",
      "--accent-color": "#b58900",
      "--accent-hover-color": "#268bd2",
      "--border-color": "#586e75",
      "--danger-bg-color": "rgba(220, 50, 47, 0.18)",
      "--danger-text-color": "#fdf6e3",
      "--danger-border-color": "#dc322f",
    },
  },
} as const

type ThemeKey = keyof typeof themes
type ThemeVariable = keyof (typeof themes)[ThemeKey]["variables"]

const STORAGE_KEY = "threat-hunting-dashboard-theme"

function isThemeKey(value: string | null): value is ThemeKey {
  return Boolean(value && value in themes)
}

function applyTheme(themeKey: ThemeKey) {
  const root = document.documentElement
  root.dataset.theme = themeKey

  Object.entries(themes[themeKey].variables).forEach(([property, value]) => {
    root.style.setProperty(property as ThemeVariable, value)
  })
}

export default function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(() => {
    if (typeof window === "undefined") return "darkBlue"
    const savedTheme = window.localStorage.getItem(STORAGE_KEY)
    return isThemeKey(savedTheme) ? savedTheme : "darkBlue"
  })
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    applyTheme(selectedTheme)
    window.localStorage.setItem(STORAGE_KEY, selectedTheme)
  }, [selectedTheme])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="theme-switcher" ref={containerRef}>
      <button
        type="button"
        className="theme-switcher__button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="theme-switcher__swatch" aria-hidden="true" />
        {themes[selectedTheme].name}
        <span className="theme-switcher__chevron" aria-hidden="true">
          v
        </span>
      </button>

      {open ? (
        <div className="theme-switcher__menu" role="menu" aria-label="Select dashboard theme">
          {(Object.keys(themes) as ThemeKey[]).map((themeKey) => (
            <button
              type="button"
              key={themeKey}
              className="theme-switcher__option"
              role="menuitemradio"
              aria-checked={selectedTheme === themeKey}
              onClick={() => {
                setSelectedTheme(themeKey)
                setOpen(false)
              }}
            >
              <span
                className="theme-switcher__option-swatch"
                style={{ backgroundColor: themes[themeKey].variables["--accent-color"] }}
                aria-hidden="true"
              />
              <span>{themes[themeKey].name}</span>
              {selectedTheme === themeKey ? <span className="theme-switcher__check">Selected</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
