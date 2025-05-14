import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2 
} from 'lucide-react';

export function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    {
      path: '/app/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/app/journal',
      icon: BookOpen,
      label: 'Journal'
    },
    {
      path: '/app/analytics',
      icon: BarChart2,
      label: 'Analytiques'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 transition-colors",
              pathname.includes(item.path) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 