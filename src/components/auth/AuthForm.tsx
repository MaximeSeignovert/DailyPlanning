import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Interface pour les points du trait
interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<Point | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Configurer le canvas pour qu'il couvre tout le conteneur
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurer le style du trait
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    ctx.strokeStyle = randomColor();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fonction pour redessiner tous les points
    const redrawPoints = () => {
      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Supprimer les points plus vieux que 3 secondes
      const now = Date.now();
      pointsRef.current = pointsRef.current.filter(point => 
        now - point.timestamp < 300
      );
      
      // Redessiner tous les points restants
      if (pointsRef.current.length > 1) {
        for (let i = 1; i < pointsRef.current.length; i++) {
          const prevPoint = pointsRef.current[i - 1];
          const currentPoint = pointsRef.current[i];
          
          ctx.lineWidth = 4 + (i / pointsRef.current.length) * 2;

          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(currentPoint.x, currentPoint.y);
          ctx.stroke();
        }
      }
      
      // Continuer l'animation
      animationFrameRef.current = requestAnimationFrame(redrawPoints);
    };

    // Démarrer l'animation
    animationFrameRef.current = requestAnimationFrame(redrawPoints);

    // Gestionnaires d'événements pour le dessin
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentPoint: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        timestamp: Date.now()
      };

      // Ajouter le point seulement si nous avons un point précédent
      if (lastPosRef.current) {
        pointsRef.current.push(currentPoint);
      }

      lastPosRef.current = currentPoint;
    };

    // Réinitialiser la position lorsque la souris quitte la zone
    const handleMouseLeave = () => {
      lastPosRef.current = null;
    };

    // Ajouter les écouteurs d'événements au conteneur principal
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      // Nettoyer l'animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      router.navigate({ to: '/app/dashboard' });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    changeColor();
    
    // Afficher un toast avec un message aléatoire
    const messages = [
      "Nouvelle couleur appliquée !",
      "Vous aimez cette couleur ?",
      "Essayez de dessiner quelque chose !",
      "Bienvenue sur DailyPlanning !",
      "Prêt à organiser votre journée ?",
      "Un crayon pour vos pensées !"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    toast({
      title: "Changement de couleur",
      description: randomMessage,
      variant: "default",
    });
  };

  const changeColor = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = randomColor;
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center bg-background p-4 overflow-hidden relative">
      <Toaster />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 max-w-md w-full">
        <Card className="w-full shadow-lg bg-background/90">
          <div className="flex flex-col items-center pt-6">
            <img 
              src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crayon/3D/crayon_3d.png" 
              alt="Logo de l'application" 
              className="select-none h-16 w-auto drop-shadow-md hover:rotate-12 transition-transform duration-300 hover:scale-110 cursor-pointer hover:bg-accent/50 rounded-md p-2"
              onClick={handleLogoClick}
            />
            <h1 className="text-xl font-bold mt-2 select-none">DailyPlanning</h1>
          </div>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Créer un compte' : 'Bon retour'}</CardTitle>
            <CardDescription>
              {isSignUp ? "Inscrivez-vous pour commencer" : 'Connectez-vous à votre compte'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "S'inscrire" : 'Se connecter'}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Vous avez déjà un compte ?' : "Vous n'avez pas de compte ?"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}