import { Fingerprint, QrCode, ShieldCheck } from "lucide-react"
import { HOLDER } from "@/lib/mock-data"
import { StatusPill } from "@/components/status-pill"

export function PassportView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Sovereign ID</span>
        <StatusPill tone="ok">
          <ShieldCheck className="size-3" /> Verified
        </StatusPill>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
          <Fingerprint className="size-10 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold leading-tight">{HOLDER.handle}</h2>
          <p className="text-xs text-muted-foreground">{HOLDER.role}</p>
          <p className="text-xs text-muted-foreground">{HOLDER.region}</p>
        </div>
      </div>

      <dl className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 font-mono text-[11px]">
        <Row k="Aegis ID" v={HOLDER.aegisId} />
        <Row k="Public key" v={HOLDER.publicKey} />
        <Row k="Enrolled" v={HOLDER.joined} />
        <Row k="Custody" v="Self-sovereign" />
      </dl>

      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/40 p-3">
        <QrCode className="size-12 text-foreground" />
        <div>
          <p className="text-xs font-medium">Selective-disclosure proof</p>
          <p className="text-[11px] text-muted-foreground text-pretty">
            Present a claim without revealing the document behind it.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate font-medium text-foreground">{v}</dd>
    </div>
  )
}
