import { IdCard, Lock } from "lucide-react"
import { credentials } from "@/lib/mock-data"
import { StatusPill, Dot } from "@/components/status-pill"

const statusTone = { verified: "ok", expiring: "warn", revoked: "fault" } as const

export function CredentialsView() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Credentials</span>
        <span className="font-mono text-[11px] text-muted-foreground">{credentials.length} held</span>
      </div>

      <div className="flex flex-col gap-2">
        {credentials.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <IdCard className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium leading-tight text-balance">{c.label}</p>
                  <p className="text-[11px] text-muted-foreground">{c.issuer}</p>
                </div>
              </div>
              <StatusPill tone={statusTone[c.status]}>{c.status}</StatusPill>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span>exp {c.expires}</span>
              {c.zkProtected ? (
                <span className="flex items-center gap-1 text-accent">
                  <Lock className="size-3" /> ZK-protected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Dot tone="neutral" /> standard
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
