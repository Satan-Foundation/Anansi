"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  fieldReports as seedReports,
  institutions as seedInstitutions,
  type FieldReport,
  type Institution,
  type ThemeName,
} from "@/lib/mock-data"

type Surface = "device" | "mesh" | "console"

type AegisState = {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  surface: Surface
  setSurface: (s: Surface) => void
  reports: FieldReport[]
  addVerification: (reportId: string, verdict: "confirm" | "dispute") => void
  institutions: Institution[]
  toggleInstitution: (id: string) => void
}

const AegisContext = createContext<AegisState | null>(null)

const THEMES: ThemeName[] = ["civic", "tactical", "cyberpunk", "infernal"]

export function AegisProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("civic")
  const [surface, setSurface] = useState<Surface>("device")
  const [reports, setReports] = useState<FieldReport[]>(seedReports)
  const [institutions, setInstitutions] = useState<Institution[]>(seedInstitutions)

  const addVerification = (reportId: string, verdict: "confirm" | "dispute") => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r
        const verifications = [
          ...r.verifications,
          {
            nodeId: "n0",
            handle: "R. Vasquez",
            role: "Water Systems II",
            verdict,
            note: verdict === "confirm" ? "Independent on-site reading concurs." : "Could not replicate reported values.",
            at: "just now",
          },
        ]
        const confirms = verifications.filter((v) => v.verdict === "confirm").length
        const status: FieldReport["status"] = confirms >= 2 ? "verified" : r.status === "unverified" ? "verifying" : r.status
        return { ...r, verifications, status }
      }),
    )
  }

  const toggleInstitution = (id: string) => {
    setInstitutions((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, optedIn: !i.optedIn, lastSync: !i.optedIn ? "just now" : "—" } : i,
      ),
    )
  }

  const value = useMemo(
    () => ({ theme, setTheme, surface, setSurface, reports, addVerification, institutions, toggleInstitution }),
    [theme, surface, reports, institutions],
  )

  return (
    <AegisContext.Provider value={value}>
      <div className={`theme-${theme} min-h-dvh bg-background text-foreground`}>{children}</div>
    </AegisContext.Provider>
  )
}

export function useAegis() {
  const ctx = useContext(AegisContext)
  if (!ctx) throw new Error("useAegis must be used within AegisProvider")
  return ctx
}

export { THEMES }
export type { Surface }
