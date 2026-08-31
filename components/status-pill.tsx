import type { ReactNode } from "react"

type Tone = "ok" | "warn" | "fault" | "neutral" | "info"

const toneClass: Record<Tone, string> = {
  ok: "border-accent/40 bg-accent/10 text-accent",
  warn: "border-seal/50 bg-seal/10 text-seal",
  fault: "border-destructive/40 bg-destructive/10 text-destructive",
  info: "border-primary/40 bg-primary/10 text-primary",
  neutral: "border-border bg-secondary text-muted-foreground",
}

export function StatusPill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ${toneClass[tone]}`}
    >
      {children}
    </span>
  )
}

export function Dot({ tone = "neutral" }: { tone?: Tone }) {
  const c: Record<Tone, string> = {
    ok: "bg-accent",
    warn: "bg-seal",
    fault: "bg-destructive",
    info: "bg-primary",
    neutral: "bg-muted-foreground",
  }
  return <span className={`inline-block size-2 rounded-full ${c[tone]}`} />
}
