"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { useAegis } from "@/components/aegis-context"
import { StatusPill } from "@/components/status-pill"
import type { FieldReport } from "@/lib/mock-data"

const severityTone = { critical: "fault", advisory: "warn", info: "info" } as const
const statusTone = { unverified: "neutral", verifying: "warn", verified: "ok", resolved: "info" } as const
const readingTone = { ok: "ok", warn: "warn", fault: "fault" } as const

// The signed-in holder's credential. Determines whether they can co-verify a report.
const HOLDER_CREDENTIAL = "Water Treatment License — Class II"

export function FieldReportDetail({ report }: { report: FieldReport }) {
  const { addVerification } = useAegis()

  const canVerify =
    report.requiredCredential.startsWith("Water Treatment") &&
    !report.verifications.some((v) => v.nodeId === "n0") &&
    report.status !== "resolved"

  const confirms = report.verifications.filter((v) => v.verdict === "confirm").length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {report.severity === "critical" ? (
              <AlertTriangle className="size-5 text-destructive" />
            ) : report.severity === "advisory" ? (
              <AlertTriangle className="size-5 text-seal" />
            ) : (
              <Info className="size-5 text-primary" />
            )}
            <StatusPill tone={severityTone[report.severity]}>{report.severity}</StatusPill>
          </div>
          <StatusPill tone={statusTone[report.status]}>{report.status}</StatusPill>
        </div>
        <h3 className="font-display text-xl font-semibold leading-tight text-balance">{report.title}</h3>
        <p className="font-mono text-xs text-muted-foreground">{report.site}</p>
      </div>

      {/* Author provenance */}
      <div className="rounded-lg border border-border bg-secondary/50 p-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="size-4 text-accent" />
          <span className="text-muted-foreground">Signed by</span>
          <span className="font-medium text-foreground">{report.authorHandle}</span>
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          {report.authorRole} · credential: {report.authorCredential}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-pretty">{report.summary}</p>

      {/* Sensor readings */}
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Sensor array · double-verifiable
        </p>
        <div className="grid grid-cols-2 gap-2">
          {report.readings.map((r) => (
            <div key={r.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</span>
                <StatusPill tone={readingTone[r.status]}>{r.status}</StatusPill>
              </div>
              <p className="mt-1 font-mono text-lg font-semibold">{r.value}</p>
              <p className="font-mono text-[11px] text-muted-foreground">spec {r.nominal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verifications */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Peer verification · {confirms} confirm{confirms === 1 ? "" : "s"}
          </p>
          <span className="font-mono text-[11px] text-muted-foreground">2 needed to finalize</span>
        </div>
        <div className="flex flex-col gap-2">
          {report.verifications.map((v, i) => (
            <div key={i} className="flex gap-2 rounded-lg border border-border bg-card p-3">
              {v.verdict === "confirm" ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
              ) : (
                <ThumbsDown className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <div>
                <p className="text-xs">
                  <span className="font-medium">{v.handle}</span>{" "}
                  <span className="text-muted-foreground">· {v.role} · {v.at}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground text-pretty">{v.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action zone — gated by credential */}
      {canVerify ? (
        <div className="flex flex-col gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
          <p className="flex items-center gap-2 text-xs text-foreground">
            <ShieldCheck className="size-4 text-accent" />
            You hold <span className="font-medium">{HOLDER_CREDENTIAL}</span> — you may co-verify.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => addVerification(report.id, "confirm")}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <ThumbsUp className="size-4" /> Confirm
            </button>
            <button
              onClick={() => addVerification(report.id, "dispute")}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <ThumbsDown className="size-4" /> Dispute
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-pretty">
            {report.status === "resolved"
              ? "This report is resolved and archived to the mesh ledger. Read-only."
              : `Read-only. Editing or verifying requires "${report.requiredCredential}". You can view the data and provenance for full transparency, but cannot alter it.`}
          </p>
        </div>
      )}
    </div>
  )
}
