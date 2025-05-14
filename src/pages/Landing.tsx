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
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  const slideFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <motion.header 
          className="py-4 sm:py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-2xl sm:text-3xl font-bold text-primary">DailyPlanning</span>
              <Badge variant="outline" className="ml-2">Beta</Badge>
            </motion.div>
              
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      className="cursor-pointer hover:underline text-foreground hover:text-primary hover:bg-background"
                      onClick={() => navigate({ to: "/auth" })}
                    >
                      Se connecter
                    </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accéder à votre compte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate({ to: "/auth" })}
              >
                S'inscrire
              </Button>
              </motion.div>
              <ThemeToggle />
            </div>
            
            {/* Bouton menu mobile */}
            <div className="flex md:hidden items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </nav>
          
          {/* Menu mobile déroulant */}
          {mobileMenuOpen && (
            <motion.div 
              className="mt-4 py-4 bg-background border border-border rounded-lg md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3 px-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-primary hover:bg-background"
                  onClick={() => {
                    navigate({ to: "/auth" });
                    setMobileMenuOpen(false);
                  }}
                >
                  Se connecter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    navigate({ to: "/auth" });
                    setMobileMenuOpen(false);
                  }}
                >
                  S'inscrire
                </Button>
              </div>
            </motion.div>
          )}
        </motion.header>

        <main>
          <motion.section 
            className="py-12 sm:py-20 flex flex-col items-center text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={slideUp}>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Découvrez notre nouvel outil
            </Badge>
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-foreground"
              variants={slideUp}
            >
              Planifiez votre <span className="text-primary">quotidien</span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl px-2"
              variants={slideUp}
            >
              Organisez vos tâches journalières, suivez vos objectifs et maximisez votre productivité avec notre outil de planification intelligent.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full px-4 sm:px-0 sm:w-auto"
              variants={slideUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                  className="cursor-pointer text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/auth" })}
              >
                Commencer gratuitement
              </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                  className="cursor-pointer text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary text-primary hover:bg-primary/10"
                onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop, behavior: 'smooth' })}
              >
                Découvrir les fonctionnalités
              </Button>
              </motion.div>
            </motion.div>
          </motion.section>

          <Separator className="my-6 sm:my-8" />

          <motion.section 
            id="features" 
            className="py-10 sm:py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-10 sm:mb-16" variants={slideUp}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">Fonctionnalités principales</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">Toutes les fonctionnalités dont vous avez besoin pour une planification efficace.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full px-4 sm:px-0">
              <motion.div variants={slideUp}>
                <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Planning Intelligent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Organisez vos journées efficacement avec notre système de planification intuitif.</p>
                </CardContent>
              </Card>
                </motion.div>
              </motion.div>
              
              <motion.div variants={slideUp}>
                <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Suivi des Objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gardez un œil sur vos progrès et atteignez vos objectifs plus rapidement.</p>
                </CardContent>
              </Card>
                </motion.div>
              </motion.div>
              
              <motion.div variants={slideUp}>
                <motion.div whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <Card className="bg-card text-card-foreground border-border shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Analytics Détaillés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analysez votre productivité avec des rapports et des statistiques détaillés.</p>
                </CardContent>
              </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          <Separator className="my-6 sm:my-8" />

          <motion.section 
            className="py-10 sm:py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div className="text-center mb-10 sm:mb-16" variants={slideUp}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">Questions fréquentes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">Tout ce que vous devez savoir pour commencer.</p>
            </motion.div>
            
            <motion.div 
              className="max-w-3xl mx-auto px-4 sm:px-0"
              variants={fadeIn}
            >
              <Accordion type="single" collapsible className="w-full">
                <motion.div variants={slideFromLeft}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-foreground hover:text-primary text-left">
                    Comment commencer avec DailyPlanning ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Il suffit de créer un compte gratuit en cliquant sur le bouton "Commencer gratuitement", puis de suivre les instructions pour configurer votre première planification.
                  </AccordionContent>
                </AccordionItem>
                </motion.div>

                <motion.div variants={slideFromLeft}>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-foreground hover:text-primary text-left">
                    Est-ce que DailyPlanning est gratuit ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Oui, DailyPlanning propose une version gratuite avec toutes les fonctionnalités essentielles. Des options premium sont disponibles pour les utilisateurs avancés.
                  </AccordionContent>
                </AccordionItem>
                </motion.div>

                <motion.div variants={slideFromLeft}>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-foreground hover:text-primary text-left">
                    Comment contacter le support ?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Vous pouvez contacter notre équipe de support via la page des paramètres une fois connecté, ou par email à <a href="mailto:maxime.seignovert@gmail.com" className="text-primary hover:underline">maxime.seignovert@gmail.com</a>.
                  </AccordionContent>
                </AccordionItem>
                </motion.div>
              </Accordion>
            </motion.div>
          </motion.section>
        </main>

        <motion.footer 
          className="py-6 sm:py-8 mt-10 sm:mt-16 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} DailyPlanning. Tous droits réservés.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
} 