"use client"

import { AlertTriangle, ChevronRight, Info } from "lucide-react"
import { useAegis } from "@/components/aegis-context"
import { StatusPill } from "@/components/status-pill"

const severityTone = { critical: "fault", advisory: "warn", info: "info" } as const
const statusTone = { unverified: "neutral", verifying: "warn", verified: "ok", resolved: "info" } as const

export function FieldView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { reports } = useAegis()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Field feed</span>
        <span className="font-mono text-[11px] text-muted-foreground">mesh · public</span>
      </div>

      <div className="flex flex-col gap-2">
        {reports.map((r) => {
          const on = r.id === selectedId
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {r.severity === "info" ? (
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <AlertTriangle
                  className={`mt-0.5 size-4 shrink-0 ${r.severity === "critical" ? "text-destructive" : "text-seal"}`}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-tight text-balance">{r.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{r.authorHandle} · {r.createdAt.split(" ")[1]}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <StatusPill tone={severityTone[r.severity]}>{r.severity}</StatusPill>
                  <StatusPill tone={statusTone[r.status]}>{r.status}</StatusPill>
                </div>
              </div>
              <ChevronRight className={`mt-0.5 size-4 shrink-0 ${on ? "text-primary" : "text-muted-foreground"}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
