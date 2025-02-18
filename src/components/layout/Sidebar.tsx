import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Calendar, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  LineChart 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/analytics', label: 'Analytics', icon: LineChart },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen flex-col border-r bg-muted/10">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Daily Manager</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              variant={location.pathname === href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                location.pathname === href && "bg-secondary"
              )}
              asChild
            >
              <Link to={href}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}