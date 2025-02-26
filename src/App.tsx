import { ThemeProvider } from "@/components/theme/theme-provider"
import { Router } from "@/components/router"
import { PWAUpdater } from "@/components/pwa/PWAUpdater"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <PWAUpdater />
      <Router />
      <Toaster />
    </ThemeProvider>
  )
}

export default App