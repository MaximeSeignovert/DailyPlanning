import { supabase } from '@/lib/supabase';

// Fonction pour mettre en cache les activités
export async function cacheActivities(userId: string) {
  try {
    if (!userId) return;

    // Récupérer toutes les activités de l'utilisateur
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId);

    // Stocker dans le localStorage
    if (activities) {
      localStorage.setItem('cached_activities', JSON.stringify(activities));
      localStorage.setItem('activities_last_cached', new Date().toISOString());
    }
  } catch (error) {
    console.error('Erreur lors de la mise en cache des activités:', error);
  }
}

// Fonction pour récupérer les activités du cache
export function getCachedActivities() {
  const cachedData = localStorage.getItem('cached_activities');
  return cachedData ? JSON.parse(cachedData) : [];
}

// Fonction pour synchroniser les modifications locales avec le serveur
export async function syncOfflineChanges() {
  // Implémentation de la synchronisation des modifications locales
  // Cette fonction serait appelée lorsque la connexion est rétablie
} 