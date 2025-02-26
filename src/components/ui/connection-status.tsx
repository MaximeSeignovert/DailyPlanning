import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes maintenant connecté à Internet",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Hors ligne",
        description: "Vous travaillez actuellement en mode hors ligne",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-md flex items-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm">Mode hors ligne</span>
    </div>
  );
} 