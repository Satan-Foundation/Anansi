"use client"

import { useState } from "react"
import {
  Activity,
  BatteryMedium,
  Fingerprint,
  IdCard,
  Radio,
  Wallet as WalletIcon,
} from "lucide-react"
import { useAegis } from "@/components/aegis-context"
import { PassportView } from "@/components/device/passport-view"
import { CredentialsView } from "@/components/device/credentials-view"
import { WalletView } from "@/components/device/wallet-view"
import { FieldView } from "@/components/device/field-view"
import { FieldReportDetail } from "@/components/field-report-detail"

type Section = "passport" | "credentials" | "wallet" | "field"

const TABS: { id: Section; label: string; icon: typeof IdCard }[] = [
  { id: "passport", label: "ID", icon: Fingerprint },
  { id: "credentials", label: "Creds", icon: IdCard },
  { id: "wallet", label: "Wallet", icon: WalletIcon },
  { id: "field", label: "Field", icon: Activity },
]

export function WearableDevice() {
  const { reports } = useAegis()
  const [section, setSection] = useState<Section>("passport")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const active = reports.find((r) => r.id === selectedReport) ?? null

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(340px,400px)_1fr]">
      {/* Device */}
      <div className="mx-auto w-full max-w-[400px]">
        <div className="rounded-[2rem] border border-border bg-card p-3 shadow-2xl shadow-primary/5">
          {/* bezel top */}
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground">AEGIS</span>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-accent" /> LORA MESH
            </div>
          </div>

          {/* screen */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
            <div className="pointer-events-none absolute inset-0 opacity-[0.6]" style={{ background: "radial-gradient(120% 80% at 50% 0%, var(--grid), transparent 60%)" }} />
            {/* status bar */}
            <div className="relative flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
              <span>14:22</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Radio className="size-3" /> −42dBm
                </span>
                <span className="flex items-center gap-1">
                  <BatteryMedium className="size-3" /> 82%
                </span>
              </div>
            </div>

            {/* body */}
            <div className="relative min-h-[440px] p-4">
              {section === "passport" && <PassportView />}
              {section === "credentials" && <CredentialsView />}
              {section === "wallet" && <WalletView />}
              {section === "field" && <FieldView selectedId={selectedReport} onSelect={setSelectedReport} />}
            </div>

            {/* tab bar */}
            <div className="relative grid grid-cols-4 border-t border-border">
              {TABS.map((t) => {
                const on = section === t.id
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setSection(t.id)}
                    className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                      on ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    {t.label}
                    {on && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <span className="h-1 w-16 rounded-full bg-border" />
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground text-pretty">
          Wrist-worn pad. Signs and relays over LoRa — no cell tower or internet required.
        </p>
      </div>

      {/* Contextual detail panel */}
      <div className="rounded-xl border border-border bg-card p-6">
        {section === "field" && active ? (
          <FieldReportDetail report={active} />
        ) : (
          <DetailPlaceholder section={section} />
        )}
      </div>
    </div>
  )
}

function DetailPlaceholder({ section }: { section: Section }) {
  const copy: Record<Section, { title: string; body: string }> = {
    passport: {
      title: "Sovereign identity",
      body: "Your root identity is a self-custodied keypair. No central authority can freeze or revoke it. Selective-disclosure proofs let you prove a claim (over 18, licensed, cleared) without exposing the underlying document.",
    },
    credentials: {
      title: "Verifiable credentials",
      body: "Institutions issue signed attestations to your device. Each is zero-knowledge protected — a verifier confirms validity against the issuer without either party revealing the raw data.",
    },
    wallet: {
      title: "Mesh-native wallet",
      body: "AEG rewards accrue for relaying mesh traffic, attesting credentials, and verifying field reports. Transactions settle peer-to-peer and reconcile to chain when a gateway is in range.",
    },
    field: {
      title: "Field intelligence feed",
      body: "Select a report to inspect its sensor array, provenance, and peer verification. Credentialed specialists can co-verify; everyone else sees full transparency, read-only.",
    },
  }
  const c = copy[section]
  return (
    <div className="flex h-full min-h-[440px] flex-col justify-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Context</span>
      <h3 className="font-display text-2xl font-semibold text-balance">{c.title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">{c.body}</p>
    </div>
  )
}
