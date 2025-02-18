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
        <NavUser user={{
          name: "Utilisateur",
          email: "user@example.com",
          avatar: "/avatar.png"
        }} />
      </SidebarFooter>
    </SidebarRoot>
  );
}