"use client"

import { useState } from "react"
import { BatteryLow, BatteryMedium, Radio, Router, User, WifiOff } from "lucide-react"
import { meshNodes, type MeshNode } from "@/lib/mock-data"
import { StatusPill } from "@/components/status-pill"

// Connections define which nodes relay to which (the mesh topology).
const links: [string, string][] = [
  ["n0", "n1"],
  ["n0", "n2"],
  ["n0", "n3"],
  ["n1", "n4"],
  ["n2", "n5"],
  ["n3", "n2"],
  ["n1", "n6"],
  ["n2", "n7"],
]

function nodeById(id: string) {
  return meshNodes.find((n) => n.id === id)!
}

function signalTone(rssi: number) {
  if (rssi > -70) return "ok"
  if (rssi > -90) return "warn"
  return "fault"
}

export function MeshMap() {
  const [selected, setSelected] = useState<string>("n0")
  const active = nodeById(selected)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold">LoRa Mesh · Cascade District</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {meshNodes.filter((n) => n.online).length}/{meshNodes.length} nodes reachable · no internet
            </p>
          </div>
          <StatusPill tone="ok">
            <Radio className="size-3" /> Self-healing
          </StatusPill>
        </div>

        <div
          className="relative aspect-[4/3] w-full"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          {/* links */}
          <svg className="absolute inset-0 size-full" aria-hidden="true">
            {links.map(([a, b], i) => {
              const na = nodeById(a)
              const nb = nodeById(b)
              const dim = !na.online || !nb.online
              const isActive = selected === a || selected === b
              return (
                <line
                  key={i}
                  x1={`${na.x}%`}
                  y1={`${na.y}%`}
                  x2={`${nb.x}%`}
                  y2={`${nb.y}%`}
                  stroke={isActive ? "var(--primary)" : "var(--border)"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={dim ? "4 4" : undefined}
                  opacity={dim ? 0.4 : 1}
                />
              )
            })}
          </svg>

          {/* nodes */}
          {meshNodes.map((n) => (
            <NodeMarker key={n.id} node={n} selected={selected === n.id} onSelect={() => setSelected(n.id)} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <Legend swatch="bg-primary" label="You" />
          <Legend swatch="bg-accent" label="Peer online" />
          <Legend swatch="bg-muted-foreground" label="Gateway" />
          <Legend swatch="bg-destructive" label="Offline / weak" />
        </div>
      </div>

      {/* node detail */}
      <NodeDetail node={active} />
    </div>
  )
}

function NodeMarker({ node, selected, onSelect }: { node: MeshNode; selected: boolean; onSelect: () => void }) {
  const isGateway = node.role.includes("Gateway")
  const tone = !node.online ? "fault" : node.self ? "info" : "ok"
  const ring = tone === "info" ? "bg-primary" : tone === "ok" ? "bg-accent" : "bg-destructive"
  const Icon = !node.online ? WifiOff : isGateway ? Router : node.self ? User : User

  return (
    <button
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      aria-label={node.handle}
    >
      {node.self && node.online && (
        <span className={`absolute inset-0 -z-10 animate-ping rounded-full ${ring} opacity-30`} />
      )}
      <span
        className={`flex size-9 items-center justify-center rounded-full border-2 transition-all ${
          selected ? "scale-115 border-foreground" : "border-transparent"
        } ${isGateway ? "bg-secondary text-foreground" : `${ring} text-background`}`}
      >
        <Icon className="size-4" />
      </span>
      <span className="mt-1 block max-w-[80px] truncate text-center font-mono text-[9px] text-muted-foreground">
        {node.handle}
      </span>
    </button>
  )
}

function NodeDetail({ node }: { node: MeshNode }) {
  const tone = signalTone(node.rssi)
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Node</span>
        {node.online ? (
          <StatusPill tone="ok">online</StatusPill>
        ) : (
          <StatusPill tone="fault">offline</StatusPill>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold">{node.handle}</h3>
        <p className="text-xs text-muted-foreground">{node.role}</p>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        <Stat label="Distance" value={node.hops === 0 ? "This device" : `${node.hops} hop${node.hops > 1 ? "s" : ""}`} />
        <Stat label="Signal" value={`${node.rssi} dBm`} tone={tone} />
        <Stat label="Battery" value={`${node.battery}%`} tone={node.battery < 40 ? "warn" : "ok"} />
        <Stat label="Type" value={node.role.includes("Gateway") ? "Gateway" : "Holder"} />
      </dl>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
        {node.battery < 40 ? <BatteryLow className="size-4 text-seal" /> : <BatteryMedium className="size-4 text-accent" />}
        <span className="text-pretty">
          {node.online
            ? "Relaying packets across the mesh. Data hops device-to-device until it reaches a gateway."
            : "Out of range. The mesh reroutes around this node automatically."}
        </span>
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "fault" }) {
  const color = tone === "warn" ? "text-seal" : tone === "fault" ? "text-destructive" : tone === "ok" ? "text-accent" : "text-foreground"
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block size-2 rounded-full ${swatch}`} /> {label}
    </span>
  )
}
