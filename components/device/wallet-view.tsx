"use client"

import { useMemo, useState } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Nfc,
  Plus,
  Repeat,
  Building2,
  Clock,
  Check,
  ChevronLeft,
  Radio,
} from "lucide-react"
import { wallet, linkedAccounts, fxToAeg, currencyMeta, chronos } from "@/lib/mock-data"

type Mode = "overview" | "fx" | "nfc" | "ramp"

function convert(amount: number, from: string, to: string) {
  const inAeg = amount * (fxToAeg[from] ?? 1)
  return inAeg / (fxToAeg[to] ?? 1)
}

function fmt(n: number, currency: string) {
  const decimals = currency === "JPY" || currency === "KES" ? 0 : 2
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function WalletView() {
  const [mode, setMode] = useState<Mode>("overview")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Wallet</span>
        {mode !== "overview" && (
          <button
            onClick={() => setMode("overview")}
            className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-3" /> Back
          </button>
        )}
      </div>

      {mode === "overview" && <Overview onMode={setMode} />}
      {mode === "fx" && <FxSend />}
      {mode === "nfc" && <NfcPay />}
      {mode === "ramp" && <Ramp />}
    </div>
  )
}

function Overview({ onMode }: { onMode: (m: Mode) => void }) {
  const totalFiat = useMemo(
    () => linkedAccounts.reduce((sum, a) => sum + convert(a.balance, a.currency, "USD"), 0),
    [],
  )

  return (
    <>
      {/* AEG balance */}
      <div className="rounded-xl border border-border bg-secondary/50 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Settlement balance</p>
        <p className="mt-1 font-display text-3xl font-bold">
          {wallet.balance} <span className="text-base font-medium text-muted-foreground">{wallet.unit}</span>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">{wallet.fiat}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-accent" />
          {wallet.staked} {wallet.unit} staked as relay bond
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <ActionButton icon={<ArrowLeftRight className="size-4" />} label="Send abroad" onClick={() => onMode("fx")} />
        <ActionButton icon={<Nfc className="size-4" />} label="Tap to pay" onClick={() => onMode("nfc")} />
        <ActionButton icon={<Repeat className="size-4" />} label="Ramp" onClick={() => onMode("ramp")} />
      </div>

      {/* Linked accounts */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Linked accounts</p>
          <span className="font-mono text-[11px] text-muted-foreground">≈ ${fmt(totalFiat, "USD")} USD</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {linkedAccounts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[10px] font-bold text-foreground">
                {a.flag}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-medium">{a.bank}</p>
                  {a.primary && (
                    <span className="rounded bg-accent/10 px-1 font-mono text-[9px] uppercase text-accent">Primary</span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <Building2 className="size-3" />
                  {a.country} · ••{a.last4}
                  {a.nfc && <Nfc className="size-3 text-accent" />}
                </p>
              </div>
              <span className="font-mono text-xs font-semibold">
                {a.symbol}
                {fmt(a.balance, a.currency)}
              </span>
            </div>
          ))}
          <button className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-transparent p-2.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-accent hover:text-accent">
            <Plus className="size-3.5" /> Link account
          </button>
        </div>
      </div>

      {/* Chronos teaser */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Clock className="size-3.5" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{chronos.name} · preview</p>
        </div>
        <p className="mt-2 font-display text-2xl font-bold">
          {chronos.balance} <span className="text-sm font-medium text-muted-foreground">{chronos.unit}</span>
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">{chronos.tagline}</p>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-accent/20 pt-3">
          {chronos.breakdown.map((b) => (
            <div key={b.label} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium">{b.label}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">{b.note}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] font-semibold text-accent">{b.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Recent activity</p>
        <div className="flex flex-col gap-1.5">
          {wallet.txs.map((t) => {
            const positive = t.amount.startsWith("+")
            return (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md ${
                    positive ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {positive ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{t.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{t.at}</p>
                </div>
                <span className={`font-mono text-xs font-semibold ${positive ? "text-accent" : "text-foreground"}`}>
                  {t.amount}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center transition-colors hover:border-accent hover:bg-accent/5"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">{icon}</span>
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </button>
  )
}

const currencyList = Object.keys(currencyMeta)

function FxSend() {
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("KES")
  const [amount, setAmount] = useState("250")
  const [sent, setSent] = useState(false)

  const parsed = Number.parseFloat(amount) || 0
  const bridged = convert(parsed, from, "AEG")
  const received = convert(parsed, from, to)
  const fee = bridged * 0.004

  if (sent) {
    return (
      <SuccessPanel
        title="Transfer settled"
        lines={[
          `${currencyMeta[from].symbol}${fmt(parsed, from)} → ${currencyMeta[to].symbol}${fmt(received, to)}`,
          `Bridged via ${fmt(bridged, "AEG")} AEG · settled over mesh`,
          "Recipient notified on next gateway sync",
        ]}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-pretty">
        Convert and send across borders. Value bridges through AEG settlement, so any currency reaches any currency
        peer-to-peer.
      </p>

      <CurrencyField label="You send" currency={from} onCurrency={setFrom} value={amount} onValue={setAmount} editable />

      <div className="flex items-center justify-center">
        <span className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
          <ArrowLeftRight className="size-4 rotate-90" />
        </span>
      </div>

      <CurrencyField
        label="Recipient gets"
        currency={to}
        onCurrency={setTo}
        value={received ? fmt(received, to) : "0"}
        readOnly
      />

      <div className="rounded-lg border border-border bg-secondary/40 p-3 font-mono text-[11px] text-muted-foreground">
        <Row k="Rate" v={`1 ${from} = ${convert(1, from, to).toFixed(to === "KES" || to === "JPY" ? 2 : 4)} ${to}`} />
        <Row k="Bridge asset" v={`${fmt(bridged, "AEG")} AEG`} />
        <Row k="Network fee (0.4%)" v={`${fee.toFixed(3)} AEG`} />
        <Row k="Settlement" v="Mesh · no bank rails" accent />
      </div>

      <button
        onClick={() => setSent(true)}
        disabled={parsed <= 0}
        className="w-full rounded-xl bg-accent py-3 font-mono text-xs font-semibold uppercase tracking-wide text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Confirm transfer
      </button>
    </div>
  )
}

function NfcPay() {
  const [arming, setArming] = useState(false)
  const [paid, setPaid] = useState(false)
  const account = linkedAccounts.find((a) => a.nfc) ?? linkedAccounts[0]

  function arm() {
    setArming(true)
    setTimeout(() => {
      setArming(false)
      setPaid(true)
    }, 1800)
  }

  if (paid) {
    return (
      <SuccessPanel
        title="Payment authorized"
        lines={[
          "$18.40 USD · Depot Canteen",
          `Charged to ${account.bank} ••${account.last4}`,
          "Signed with on-device key · no card number shared",
        ]}
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-center text-sm text-muted-foreground text-pretty">
        Hold Aegis near any NFC terminal. Payment is signed by your on-device key — the merchant never sees an account
        number.
      </p>

      <div
        className={`relative flex size-40 items-center justify-center rounded-full border-2 ${
          arming ? "border-accent" : "border-border"
        }`}
      >
        {arming && <span className="absolute inset-0 animate-ping rounded-full border-2 border-accent/40" />}
        <span
          className={`flex size-24 items-center justify-center rounded-full ${
            arming ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
          }`}
        >
          {arming ? <Radio className="size-10" /> : <Nfc className="size-10" />}
        </span>
      </div>

      <div className="w-full rounded-lg border border-border bg-card p-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Charge from</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs font-medium">
            {account.bank} ••{account.last4}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {account.symbol}
            {fmt(account.balance, account.currency)}
          </span>
        </div>
      </div>

      <button
        onClick={arm}
        disabled={arming}
        className="w-full rounded-xl bg-accent py-3 font-mono text-xs font-semibold uppercase tracking-wide text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {arming ? "Awaiting terminal…" : "Arm NFC payment"}
      </button>
    </div>
  )
}

function Ramp() {
  const [dir, setDir] = useState<"onramp" | "offramp">("onramp")
  const [amount, setAmount] = useState("200")
  const [done, setDone] = useState(false)
  const account = linkedAccounts[0]

  const parsed = Number.parseFloat(amount) || 0
  const onramp = dir === "onramp"
  const out = onramp ? convert(parsed, account.currency, "AEG") : convert(parsed, "AEG", account.currency)

  if (done) {
    return (
      <SuccessPanel
        title={onramp ? "Converted to AEG" : "Withdrawn to bank"}
        lines={
          onramp
            ? [
                `${account.symbol}${fmt(parsed, account.currency)} → ${fmt(out, "AEG")} AEG`,
                `Debited ${account.bank} ••${account.last4}`,
                "AEG available for mesh settlement immediately",
              ]
            : [
                `${fmt(parsed, "AEG")} AEG → ${account.symbol}${fmt(out, account.currency)}`,
                `Credited ${account.bank} ••${account.last4}`,
                "Fiat lands on next banking-day sync",
              ]
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-pretty">
        Move value between bank fiat and on-chain AEG in either direction.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Toggle active={onramp} label="Fiat → AEG" onClick={() => setDir("onramp")} />
        <Toggle active={!onramp} label="AEG → Fiat" onClick={() => setDir("offramp")} />
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          {onramp ? "From bank account" : "To bank account"}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-secondary font-mono text-[9px] font-bold">
            {account.flag}
          </span>
          <span className="text-xs font-medium">
            {account.bank} ••{account.last4}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          Amount ({onramp ? account.currency : "AEG"})
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="decimal"
          className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 font-mono text-lg font-semibold text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="rounded-lg border border-border bg-secondary/40 p-3 font-mono text-[11px] text-muted-foreground">
        <Row k="You receive" v={`${onramp ? fmt(out, "AEG") + " AEG" : account.symbol + fmt(out, account.currency)}`} accent />
        <Row k="Rate" v={`1 AEG = ${account.symbol}${(1 / fxToAeg[account.currency]).toFixed(3)} ${account.currency}`} />
        <Row k="Settlement" v={onramp ? "Instant on-chain" : "Next banking day"} />
      </div>

      <button
        onClick={() => setDone(true)}
        disabled={parsed <= 0}
        className="w-full rounded-xl bg-accent py-3 font-mono text-xs font-semibold uppercase tracking-wide text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {onramp ? "Convert to AEG" : "Withdraw to bank"}
      </button>
    </div>
  )
}

function CurrencyField({
  label,
  currency,
  onCurrency,
  value,
  onValue,
  editable,
  readOnly,
}: {
  label: string
  currency: string
  onCurrency: (c: string) => void
  value: string
  onValue?: (v: string) => void
  editable?: boolean
  readOnly?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 focus-within:border-accent">
        <select
          value={currency}
          onChange={(e) => onCurrency(e.target.value)}
          className="shrink-0 rounded bg-secondary px-2 py-1 font-mono text-xs font-semibold text-foreground outline-none"
        >
          {currencyList.map((c) => (
            <option key={c} value={c}>
              {currencyMeta[c].flag} {c}
            </option>
          ))}
        </select>
        <input
          value={value}
          onChange={(e) => editable && onValue?.(e.target.value.replace(/[^0-9.]/g, ""))}
          readOnly={readOnly}
          inputMode="decimal"
          className={`w-full bg-transparent text-right font-mono text-lg font-semibold outline-none ${
            readOnly ? "text-muted-foreground" : "text-foreground"
          }`}
        />
      </div>
    </div>
  )
}

function Toggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span>{k}</span>
      <span className={accent ? "font-semibold text-accent" : "text-foreground"}>{v}</span>
    </div>
  )
}

function SuccessPanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Check className="size-8" />
      </span>
      <p className="font-display text-lg font-bold">{title}</p>
      <div className="flex flex-col gap-1">
        {lines.map((l, i) => (
          <p key={i} className={`font-mono text-[11px] ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
            {l}
          </p>
        ))}
      </div>
    </div>
  )
}
