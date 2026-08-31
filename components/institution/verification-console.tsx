"use client"

import { useState } from "react"
import { Building2, Check, EyeOff, Fingerprint, Loader2, ShieldCheck, X } from "lucide-react"
import { useAegis } from "@/components/aegis-context"
import { StatusPill } from "@/components/status-pill"

type ProofQuery = {
  id: string
  claim: string
  reveals: string
  result: "valid" | "invalid"
}

const QUERIES: ProofQuery[] = [
  { id: "q1", claim: "Holds a valid Water Treatment License (Class II or higher)", reveals: "Nothing but a yes/no", result: "valid" },
  { id: "q2", claim: "Is over 18 years of age", reveals: "Not the date of birth", result: "valid" },
  { id: "q3", claim: "Has active Hazmat field clearance", reveals: "Not the certificate ID", result: "valid" },
  { id: "q4", claim: "Holds Grid Operations certification", reveals: "Not the issuer record", result: "invalid" },
]

type Phase = "idle" | "handshake" | "proving" | "done"

const STEPS = ["Challenge issued to device", "Device computes ZK proof", "Proof verified against issuer"]

export function VerificationConsole() {
  const { institutions, toggleInstitution } = useAegis()
  const [query, setQuery] = useState<ProofQuery>(QUERIES[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [step, setStep] = useState(0)

  const run = () => {
    setPhase("handshake")
    setStep(0)
    let s = 0
    const timer = setInterval(() => {
      s += 1
      setStep(s)
      if (s === 1) setPhase("proving")
      if (s >= STEPS.length) {
        clearInterval(timer)
        setPhase("done")
      }
    }, 750)
  }

  const reset = () => {
    setPhase("idle")
    setStep(0)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Verifier */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <div>
              <p className="font-display text-sm font-semibold">Cascade Water Authority</p>
              <p className="font-mono text-[11px] text-muted-foreground">Verifier console · issuer-linked</p>
            </div>
          </div>
          <StatusPill tone="info">
            <ShieldCheck className="size-3" /> ZK verifier
          </StatusPill>
        </div>

        <div className="mt-6">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Select a claim to verify
          </p>
          <div className="flex flex-col gap-2">
            {QUERIES.map((q) => {
              const on = q.id === query.id
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setQuery(q)
                    reset()
                  }}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    on ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <p className="text-sm font-medium text-pretty">{q.claim}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <EyeOff className="size-3" /> reveals: {q.reveals}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* proof runner */}
        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Fingerprint className="size-4" /> Zero-knowledge exchange
            </span>
            {phase === "idle" ? (
              <button
                onClick={run}
                className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Request proof
              </button>
            ) : (
              <button
                onClick={reset}
                className="rounded-md border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                Reset
              </button>
            )}
          </div>

          <ol className="mt-4 flex flex-col gap-2">
            {STEPS.map((label, i) => {
              const complete = step > i && phase !== "idle"
              const activeStep = step === i && (phase === "handshake" || phase === "proving")
              return (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
                      complete
                        ? "border-accent bg-accent/10 text-accent"
                        : activeStep
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {complete ? <Check className="size-3" /> : activeStep ? <Loader2 className="size-3 animate-spin" /> : i + 1}
                  </span>
                  <span className={`text-xs ${complete || activeStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>

          {phase === "done" && (
            <div
              className={`mt-4 flex items-center gap-3 rounded-lg border p-4 ${
                query.result === "valid"
                  ? "border-accent/40 bg-accent/10"
                  : "border-destructive/40 bg-destructive/10"
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full ${
                  query.result === "valid" ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {query.result === "valid" ? <Check className="size-5" /> : <X className="size-5" />}
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {query.result === "valid" ? "Proof valid" : "Proof failed"}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground text-pretty">
                  {query.result === "valid"
                    ? "Claim confirmed. No personal data was disclosed to the verifier."
                    : "The holder cannot satisfy this claim. No data was disclosed."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Institution opt-in registry */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <p className="font-display text-sm font-semibold">Institution registry</p>
          <p className="font-mono text-[11px] text-muted-foreground text-pretty">
            Institutions opt their databases in to answer proof challenges.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {institutions.map((inst) => (
            <div key={inst.id} className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{inst.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{inst.kind}</p>
                </div>
                <button
                  onClick={() => toggleInstitution(inst.id)}
                  role="switch"
                  aria-checked={inst.optedIn}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    inst.optedIn ? "bg-accent" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-4 rounded-full bg-background transition-all ${
                      inst.optedIn ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {inst.sharedAttributes.map((a) => (
                  <span key={a} className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                {inst.optedIn ? `synced ${inst.lastSync}` : "not participating"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
