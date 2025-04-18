import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function PWAUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const {
    offlineReady,
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered() {
    },
    onRegisterError() {
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    }
  });

  const updateSW = () => {
    updateServiceWorker(true);
  };

  useEffect(() => {
    if (offlineReady) {
      toast({
        title: "Application prête",
        description: "L'application est maintenant disponible hors ligne",
      });
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast({
        title: "Mise à jour disponible",
        description: "Une nouvelle version est disponible",
        action: (
          <Button onClick={updateSW}>
            Mettre à jour
          </Button>
        ),
      });
    }
  }, [needRefresh]);

  return null;
} 