import { Outlet, useRouter } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ConnectionStatus } from "@/components/ui/connection-status";

export function Layout() {
  const router = useRouter();
  
  const getPageTitle = () => {
    const path = router.state.location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Tableau de bord';
      case '/journal':
        return 'Journal';
      case '/calendar':
        return 'Calendrier';
      case '/analytics':
        return 'Analytique';
      case '/settings':
        return 'Paramètres';
      case '/changelog':
        return 'Changelog';
      default:
        return 'Gestionnaire Quotidien';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <span className="text-lg font-semibold">{getPageTitle()}</span>
              </div>
              <ThemeToggle />
            </header>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="w-full p-4 md:p-8">
                <Outlet />
              </div>
            </div>
          </SidebarInset>
      </div>
      <ConnectionStatus />
    </SidebarProvider>
  );
}