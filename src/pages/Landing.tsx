import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-primary">DailyPlanning</span>
              <Badge variant="outline" className="ml-2">Beta</Badge>
              
            </div>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="cursor-pointer hover:underline text-foreground hover:text-primary hover:bg-background"
                      onClick={() => navigate({ to: "/auth" })}
                    >
                      Se connecter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accéder à votre compte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate({ to: "/auth" })}
              >
                S'inscrire
              </Button>
              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main>
          <section className="py-20 flex flex-col items-center text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Découvrez notre nouvel outil
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Planifiez votre <span className="text-primary">quotidien</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
              Organisez vos tâches journalières, suivez vos objectifs et maximisez votre productivité avec notre outil de planification intelligent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="cursor-pointer text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/auth" })}
              >
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10"
                onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop, behavior: 'smooth' })}
              >
                Découvrir les fonctionnalités
              </Button>
            </div>
          </section>

          <Separator className="my-8" />

          <section id="features" className="py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Fonctionnalités principales</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Toutes les fonctionnalités dont vous avez besoin pour une planification efficace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Planning Intelligent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Organisez vos journées efficacement avec notre système de planification intuitif.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Suivi des Objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gardez un œil sur vos progrès et atteignez vos objectifs plus rapidement.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Analytics Détaillés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analysez votre productivité avec des rapports et des statistiques détaillés.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Questions fréquentes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Tout ce que vous devez savoir pour commencer.</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-foreground hover:text-primary">
                    Comment commencer avec DailyPlanning ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Il suffit de créer un compte gratuit en cliquant sur le bouton "Commencer gratuitement", puis de suivre les instructions pour configurer votre première planification.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-foreground hover:text-primary">
                    Est-ce que DailyPlanning est gratuit ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Oui, DailyPlanning propose une version gratuite avec toutes les fonctionnalités essentielles. Des options premium sont disponibles pour les utilisateurs avancés.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-foreground hover:text-primary">
                    Comment contacter le support ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Vous pouvez contacter notre équipe de support via la page des paramètres une fois connecté, ou par email à <a href="mailto:maxime.seignovert@gmail.com" className="text-primary hover:underline">maxime.seignovert@gmail.com</a>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
        </main>

        <footer className="py-8 mt-16 border-t border-border">
          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} DailyPlanning. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
} 