import { ThemeProvider } from "@/components/theme/theme-provider"
import { PWAUpdater } from "@/components/pwa/PWAUpdater"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./routes"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <UserProvider>
        <PWAUpdater />
        <RouterProvider router={router} />
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App