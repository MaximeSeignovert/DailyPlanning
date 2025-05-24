import { AuthForm } from '@/components/auth/AuthForm';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { PageLoader } from '@/components/ui/loader';

export function Auth() {
  const { userData, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté et que le chargement est terminé, rediriger vers le dashboard
    if (userData && !loading) {
      router.navigate({ to: '/app/dashboard', replace: true });
    }
  }, [userData, loading, router]);

  // Afficher un état de chargement pendant la vérification
  if (loading) {
    return <PageLoader text="Vérification de l'authentification..." />;
  }

  // Si l'utilisateur n'est pas connecté ou si le chargement n'est pas terminé, afficher le formulaire
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm />
    </div>
  );
}