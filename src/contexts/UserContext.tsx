import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
  refreshUserData: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        

        setUserData({
          id: user.id,
          name: user.email?.split('@')[0] || 'Utilisateur',
          email: user.email || '',
          avatar_url:'/default-avatar.png'
        });
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshUserData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 