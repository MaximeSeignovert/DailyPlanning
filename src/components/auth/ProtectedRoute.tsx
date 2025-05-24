import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { PageLoader } from '@/components/ui/loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData, loading } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !userData) {
        router.navigate({ to: '/auth' });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.navigate({ to: '/auth' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, userData, loading]);

  if (loading) {
    return <PageLoader text="Chargement de l'application..." />;
  }

  return <>{children}</>;
} 