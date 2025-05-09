import { Link, Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { useLocation } from '@tanstack/react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

export function Layout() {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    return segments.map((segment, index) => {
      const currentPath = '/' + segments.slice(0, index + 1).join('/');
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return (
        <BreadcrumbItem key={currentPath}>
          <Link to={currentPath}>{title}</Link>
          {index < segments.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      );
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                  {getBreadcrumbItems()}
                </BreadcrumbList>
              </Breadcrumb>
              </div>
              <ThemeToggle />
            </header>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="w-full p-4 md:px-8">
                <h1 className="text-2xl pb-4 font-bold">{location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1)}</h1>
                <Outlet />
              </div>
            </div>
          </SidebarInset>
      </div>
      <ConnectionStatus />
    </SidebarProvider>
  );
}