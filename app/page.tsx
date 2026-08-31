import { AegisProvider } from "@/components/aegis-context"
import { AppShell } from "@/components/app-shell"

export default function Page() {
  return (
    <AegisProvider>
      <AppShell />
    </AegisProvider>
  )
}
