import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { wallet } from "@/lib/mock-data"

export function WalletView() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Wallet</span>

      <div className="rounded-xl border border-border bg-secondary/50 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Balance</p>
        <p className="mt-1 font-display text-3xl font-bold">
          {wallet.balance} <span className="text-base font-medium text-muted-foreground">{wallet.unit}</span>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">{wallet.fiat}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-accent" />
          {wallet.staked} {wallet.unit} staked as relay bond
        </div>
      </div>

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
    </div>
  )
}
