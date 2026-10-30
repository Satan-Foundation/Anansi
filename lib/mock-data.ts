export type ThemeName = "civic" | "tactical" | "cyberpunk" | "infernal"

export type Credential = {
  id: string
  label: string
  issuer: string
  category: "identity" | "professional" | "clearance" | "medical"
  status: "verified" | "expiring" | "revoked"
  issued: string
  expires: string
  zkProtected: boolean
}

export type MeshNode = {
  id: string
  handle: string
  role: string
  x: number
  y: number
  hops: number
  rssi: number // signal strength dBm
  battery: number
  self?: boolean
  online: boolean
}

export type Institution = {
  id: string
  name: string
  kind: string
  optedIn: boolean
  sharedAttributes: string[]
  lastSync: string
}

export type ReportVerification = {
  nodeId: string
  handle: string
  role: string
  verdict: "confirm" | "dispute"
  note: string
  at: string
}

export type SensorReading = {
  label: string
  value: string
  nominal: string
  status: "ok" | "warn" | "fault"
}

export type FieldReport = {
  id: string
  title: string
  site: string
  authorHandle: string
  authorRole: string
  authorCredential: string
  severity: "critical" | "advisory" | "info"
  status: "unverified" | "verifying" | "verified" | "resolved"
  createdAt: string
  summary: string
  readings: SensorReading[]
  requiredCredential: string
  verifications: ReportVerification[]
}

export const HOLDER = {
  handle: "R. Vasquez",
  aegisId: "AEG-7F3A-9C21-D084",
  role: "Water Systems Specialist II",
  region: "Cascade Municipal District",
  publicKey: "ed25519:9f2c…a417",
  joined: "2043-02-11",
}

export const credentials: Credential[] = [
  {
    id: "cr-1",
    label: "Sovereign Identity",
    issuer: "Aegis Root of Trust",
    category: "identity",
    status: "verified",
    issued: "2043-02-11",
    expires: "2053-02-11",
    zkProtected: true,
  },
  {
    id: "cr-2",
    label: "Water Treatment License — Class II",
    issuer: "Cascade Water Authority",
    category: "professional",
    status: "verified",
    issued: "2044-06-01",
    expires: "2047-06-01",
    zkProtected: true,
  },
  {
    id: "cr-3",
    label: "Hazmat Field Clearance",
    issuer: "Regional Safety Board",
    category: "clearance",
    status: "expiring",
    issued: "2045-09-15",
    expires: "2046-10-01",
    zkProtected: true,
  },
  {
    id: "cr-4",
    label: "Emergency Medical Responder",
    issuer: "Cascade Health Network",
    category: "medical",
    status: "verified",
    issued: "2044-03-20",
    expires: "2048-03-20",
    zkProtected: false,
  },
]

export const wallet = {
  balance: "1,284.50",
  unit: "AEG",
  fiat: "≈ $3,142 USD",
  staked: "500.00",
  txs: [
    { id: "tx1", label: "Credential attestation reward", amount: "+12.00", at: "2h ago" },
    { id: "tx2", label: "Mesh relay incentive", amount: "+3.25", at: "6h ago" },
    { id: "tx3", label: "Field report verification", amount: "+40.00", at: "1d ago" },
    { id: "tx4", label: "Gateway data bridge fee", amount: "-1.10", at: "2d ago" },
  ],
}

export type LinkedAccount = {
  id: string
  bank: string
  country: string
  flag: string
  currency: string
  symbol: string
  balance: number
  last4: string
  nfc: boolean
  primary?: boolean
}

// Indicative FX rates expressed as: 1 unit of currency = N AEG.
// AEG acts as the settlement bridge asset between fiat currencies.
export const fxToAeg: Record<string, number> = {
  USD: 0.409,
  EUR: 0.44,
  GBP: 0.515,
  JPY: 0.00275,
  KES: 0.00316,
  BRL: 0.081,
  AEG: 1,
}

export const currencyMeta: Record<string, { symbol: string; label: string; flag: string }> = {
  USD: { symbol: "$", label: "US Dollar", flag: "US" },
  EUR: { symbol: "€", label: "Euro", flag: "EU" },
  GBP: { symbol: "£", label: "British Pound", flag: "GB" },
  JPY: { symbol: "¥", label: "Japanese Yen", flag: "JP" },
  KES: { symbol: "KSh", label: "Kenyan Shilling", flag: "KE" },
  BRL: { symbol: "R$", label: "Brazilian Real", flag: "BR" },
}

export const linkedAccounts: LinkedAccount[] = [
  {
    id: "ba-1",
    bank: "Cascade Federal Credit Union",
    country: "United States",
    flag: "US",
    currency: "USD",
    symbol: "$",
    balance: 4820.16,
    last4: "8841",
    nfc: true,
    primary: true,
  },
  {
    id: "ba-2",
    bank: "Meridian Financial Union",
    country: "Germany",
    flag: "EU",
    currency: "EUR",
    symbol: "€",
    balance: 1290.44,
    last4: "2093",
    nfc: true,
  },
  {
    id: "ba-3",
    bank: "Rift Valley Mobile Bank",
    country: "Kenya",
    flag: "KE",
    currency: "KES",
    symbol: "KSh",
    balance: 82400.0,
    last4: "5510",
    nfc: false,
  },
]

// Forward-looking settlement unit: time + surplus clean power.
export const chronos = {
  unit: "CHR",
  name: "Chronos",
  tagline: "Time + surplus clean power",
  balance: "48.2",
  breakdown: [
    { label: "Community project hours", value: "31.0 h", note: "Climate restoration · levee planting" },
    { label: "Surplus power fed to grid", value: "142 kWh", note: "Rooftop array · net contribution" },
  ],
}

export const meshNodes: MeshNode[] = [
  { id: "n0", handle: "R. Vasquez", role: "Water Systems II", x: 50, y: 52, hops: 0, rssi: -42, battery: 82, self: true, online: true },
  { id: "n1", handle: "T. Okafor", role: "Water Systems III", x: 28, y: 32, hops: 1, rssi: -68, battery: 64, online: true },
  { id: "n2", handle: "M. Lindqvist", role: "Grid Technician", x: 74, y: 30, hops: 1, rssi: -71, battery: 91, online: true },
  { id: "n3", handle: "Relay-Tower-04", role: "LoRa Gateway", x: 60, y: 18, hops: 1, rssi: -59, battery: 100, online: true },
  { id: "n4", handle: "J. Mbeki", role: "Field Medic", x: 20, y: 68, hops: 2, rssi: -84, battery: 47, online: true },
  { id: "n5", handle: "A. Serrano", role: "Civil Inspector", x: 82, y: 66, hops: 2, rssi: -88, battery: 55, online: true },
  { id: "n6", handle: "Relay-Buoy-11", role: "LoRa Gateway", x: 44, y: 84, hops: 2, rssi: -92, battery: 73, online: false },
  { id: "n7", handle: "D. Fischer", role: "Water Systems II", x: 90, y: 44, hops: 3, rssi: -101, battery: 38, online: true },
]

export const institutions: Institution[] = [
  {
    id: "i1",
    name: "Cascade Water Authority",
    kind: "Municipal Utility",
    optedIn: true,
    sharedAttributes: ["Professional License", "Clearance Level", "Site Access"],
    lastSync: "12m ago",
  },
  {
    id: "i2",
    name: "Regional Safety Board",
    kind: "Regulatory",
    optedIn: true,
    sharedAttributes: ["Hazmat Clearance", "Certification Validity"],
    lastSync: "1h ago",
  },
  {
    id: "i3",
    name: "Cascade Health Network",
    kind: "Healthcare",
    optedIn: true,
    sharedAttributes: ["EMR Certification", "Immunization Proof"],
    lastSync: "3h ago",
  },
  {
    id: "i4",
    name: "Continental Border Service",
    kind: "Government",
    optedIn: false,
    sharedAttributes: ["Identity Proof", "Residency Status"],
    lastSync: "—",
  },
  {
    id: "i5",
    name: "Meridian Financial Union",
    kind: "Banking",
    optedIn: false,
    sharedAttributes: ["Identity Proof", "Age Over 18", "Sanctions Clear"],
    lastSync: "—",
  },
]

export const fieldReports: FieldReport[] = [
  {
    id: "fr-1",
    title: "Filtration fault — Treatment Plant #3",
    site: "Cascade WTP-3 · Filter Bank C",
    authorHandle: "R. Vasquez",
    authorRole: "Water Systems Specialist II",
    authorCredential: "Water Treatment License — Class II",
    severity: "critical",
    status: "verifying",
    createdAt: "2046-08-31 14:22",
    summary:
      "Drone sensor array flagged Filter Bank C operating out of specification. Turbidity and salinity climbing past safe thresholds. Recommending the bank be pulled from service for filter media replacement.",
    readings: [
      { label: "pH", value: "8.9", nominal: "6.5 – 8.5", status: "warn" },
      { label: "Salinity", value: "1,410 ppm", nominal: "< 900 ppm", status: "fault" },
      { label: "Turbidity", value: "6.2 NTU", nominal: "< 1.0 NTU", status: "fault" },
      { label: "Flow rate", value: "3.1 ML/d", nominal: "4.0 – 5.5 ML/d", status: "warn" },
    ],
    requiredCredential: "Water Treatment License — Class II+",
    verifications: [
      {
        nodeId: "n1",
        handle: "T. Okafor",
        role: "Water Systems III",
        verdict: "confirm",
        note: "On-site inspection confirms media breakthrough. Concur with pull-from-service.",
        at: "9m ago",
      },
    ],
  },
  {
    id: "fr-2",
    title: "Substation temp anomaly — Grid Node 12",
    site: "Meridian Substation · Transformer B",
    authorHandle: "M. Lindqvist",
    authorRole: "Grid Technician",
    authorCredential: "Grid Operations Certificate",
    severity: "advisory",
    status: "verified",
    createdAt: "2046-08-31 11:05",
    summary:
      "Thermal camera shows Transformer B running 18°C above baseline under normal load. Not yet critical; scheduling inspection window.",
    readings: [
      { label: "Core temp", value: "94°C", nominal: "< 85°C", status: "warn" },
      { label: "Load", value: "72%", nominal: "< 90%", status: "ok" },
      { label: "Oil level", value: "Nominal", nominal: "Nominal", status: "ok" },
    ],
    requiredCredential: "Grid Operations Certificate",
    verifications: [
      { nodeId: "n5", handle: "A. Serrano", role: "Civil Inspector", verdict: "confirm", note: "Visual confirms discoloration on housing.", at: "40m ago" },
      { nodeId: "n7", handle: "D. Fischer", role: "Water Systems II", verdict: "confirm", note: "Thermal readings replicated independently.", at: "31m ago" },
    ],
  },
  {
    id: "fr-3",
    title: "Air quality spike — District Depot",
    site: "Cascade Logistics Depot · Bay 2",
    authorHandle: "J. Mbeki",
    authorRole: "Field Medic",
    authorCredential: "Emergency Medical Responder",
    severity: "info",
    status: "resolved",
    createdAt: "2046-08-30 19:48",
    summary:
      "Portable sensor flagged elevated particulates during a diesel generator test. Ventilation restored; readings back to baseline within 40 minutes.",
    readings: [
      { label: "PM2.5", value: "12 µg/m³", nominal: "< 15 µg/m³", status: "ok" },
      { label: "CO", value: "4 ppm", nominal: "< 9 ppm", status: "ok" },
    ],
    requiredCredential: "Environmental Health Officer",
    verifications: [
      { nodeId: "n4", handle: "J. Mbeki", role: "Field Medic", verdict: "confirm", note: "Follow-up reading nominal after venting.", at: "1d ago" },
    ],
  },
]
