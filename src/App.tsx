import { ThemeProvider } from "@/components/theme/theme-provider"
import { Router } from "@/components/router"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <Router />
    </ThemeProvider>
  )
}

export default App