"use client"

import { Activity, Network, ShieldCheck, Watch } from "lucide-react"
import { useAegis, type Surface } from "@/components/aegis-context"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { WearableDevice } from "@/components/device/wearable-device"
import { MeshMap } from "@/components/mesh/mesh-map"
import { VerificationConsole } from "@/components/institution/verification-console"

const NAV: { id: Surface; label: string; icon: typeof Watch; blurb: string }[] = [
  { id: "device", label: "Wearable", icon: Watch, blurb: "The Aegis device" },
  { id: "mesh", label: "Mesh", icon: Network, blurb: "LoRa P2P network" },
  { id: "console", label: "Verify", icon: ShieldCheck, blurb: "Institution console" },
]

const HEADINGS: Record<Surface, { title: string; sub: string }> = {
  device: {
    title: "The Grimoir",
    sub: "A compact, offline-first interface for identity, credentials, mesh telemetry, and field reports on the Tanmatsu device.",
  },
  mesh: {
    title: "LoRa mesh network",
    sub: "Devices relay peer-to-peer over long-range radio. No cell tower, no internet — the network heals around dead nodes.",
  },
  console: {
    title: "Zero-knowledge verification",
    sub: "Opted-in institutions confirm a claim is true without the holder ever surrendering the underlying document.",
  },
}

export function AppShell() {
  const { surface, setSurface } = useAegis()
  const h = HEADINGS[surface]

  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 py-6 md:px-8">
      {/* header */}
      <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-primary/40 bg-background">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Satan%20Foundation%20Logo-hEajY7H8bDxDAHz6IwseHwX8BV5Lck.jpg"
              alt="The Satan Foundation sigil"
              className="size-full object-cover object-[center_68%] mix-blend-multiply dark:invert"
            />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight">THE GRIMOIR</p>
            <p className="font-mono text-[11px] text-muted-foreground">Satan Foundation field interface · v0.4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted-foreground sm:flex">
            <Activity className="size-3 text-accent" /> mesh live · 7 peers
          </span>
          <ThemeSwitcher />
        </div>
      </header>

      {/* nav */}
      <nav className="mt-6 grid grid-cols-3 gap-2 sm:max-w-xl">
        {NAV.map((n) => {
          const on = surface === n.id
          const Icon = n.icon
          return (
            <button
              key={n.id}
              onClick={() => setSurface(n.id)}
              className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition-colors ${
                on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                  on ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium leading-tight ${on ? "text-foreground" : "text-muted-foreground"}`}>
                  {n.label}
                </p>
                <p className="hidden truncate font-mono text-[10px] text-muted-foreground sm:block">{n.blurb}</p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* surface heading */}
      <div className="mt-8 mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">{h.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{h.sub}</p>
      </div>

      {/* surface body */}
      <main className="flex-1">
        {surface === "device" && <WearableDevice />}
        {surface === "mesh" && <MeshMap />}
        {surface === "console" && <VerificationConsole />}
      </main>

      <footer className="mt-12 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
        The Grimoir · Satan Foundation field interface · build 0.4.2
      </footer>
    </div>
  )
}
