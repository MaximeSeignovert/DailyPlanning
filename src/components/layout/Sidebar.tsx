import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  LineChart,
} from 'lucide-react';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from '@/components/sidebar/nav-user';

export function Sidebar() {
  const location = useLocation();
  
  const links = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/calendar', label: 'Calendrier', icon: Calendar },
    { href: '/analytics', label: 'Analytique', icon: LineChart },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <SidebarRoot variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crayon/3D/crayon_3d.png" alt="Logo" className="size-8 drop-shadow-lg hover:rotate-180 transition-transform duration-300" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DailyPlanning</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  data-active={location.pathname === href}
                >
                  <Link to={href} className="no-underline text-inherit">
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </SidebarRoot>
  );
}