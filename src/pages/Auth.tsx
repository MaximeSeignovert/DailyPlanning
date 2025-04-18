import { AuthForm } from '@/components/auth/AuthForm';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const { userData, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté et que le chargement est terminé, rediriger vers le dashboard
    if (userData && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [userData, loading, navigate]);

  // Afficher un état de chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté ou si le chargement n'est pas terminé, afficher le formulaire
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm />
    </div>
  );
}