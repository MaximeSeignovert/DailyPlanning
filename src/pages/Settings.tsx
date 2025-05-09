import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme/theme-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Settings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Thème</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez le thème de l'application
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="gap-2"
              >
                <Sun className="h-4 w-4" />
                Clair
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="gap-2"
              >
                <Moon className="h-4 w-4" />
                Sombre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 