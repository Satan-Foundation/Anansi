"use client"

import { useAegis } from "@/components/aegis-context"
import type { ThemeName } from "@/lib/mock-data"

const OPTIONS: { id: ThemeName; label: string; hint: string }[] = [
  { id: "civic", label: "Civic", hint: "Clean institutional" },
  { id: "tactical", label: "Tactical", hint: "Field HUD" },
  { id: "cyberpunk", label: "Cyber", hint: "Decentralized" },
  { id: "infernal", label: "Infernal", hint: "Red, black, gold, and white" },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useAegis()
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {OPTIONS.map((o) => {
        const active = theme === o.id
        return (
          <button
            key={o.id}
            onClick={() => setTheme(o.id)}
            title={o.hint}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
