import { ThemeProvider } from "@/components/theme/theme-provider"
import { Router } from "@/components/router"
import { PWAUpdater } from "@/components/pwa/PWAUpdater"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <UserProvider>
        <PWAUpdater />
        <Router />
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App