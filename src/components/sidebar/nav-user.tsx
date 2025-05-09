"use client"

import { useRouter } from '@tanstack/react-router';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { supabase } from '@/lib/supabase';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from '@/contexts/UserContext';

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()
  const { userData, loading } = useUser()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      if (isMobile) {
        setOpenMobile(false);
      }
      router.navigate({ to: '/auth' })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className={isMobile ? "h-10 w-10 rounded-lg" : "h-8 w-8 rounded-lg"} />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className={isMobile ? "ml-auto h-5 w-5 rounded-full" : "ml-auto h-4 w-4 rounded-full"} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!userData) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className={isMobile ? "h-10 w-10 rounded-lg" : "h-8 w-8 rounded-lg"}>
                <AvatarImage src={userData.avatar_url} alt={userData.name} />
                <AvatarFallback className="rounded-lg">
                  {userData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={`truncate font-semibold ${isMobile ? "text-base" : ""}`}>{userData.name}</span>
                <span className={`truncate ${isMobile ? "text-sm" : "text-xs"}`}>{userData.email}</span>
              </div>
              <ChevronsUpDown className={isMobile ? "ml-auto size-5" : "ml-auto size-4"} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className={isMobile ? "h-10 w-10 rounded-lg" : "h-8 w-8 rounded-lg"}>
                  <AvatarImage src={userData.avatar_url} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">
                    {userData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className={`truncate font-semibold ${isMobile ? "text-base" : ""}`}>{userData.name}</span>
                  <span className={`truncate ${isMobile ? "text-sm" : "text-xs"}`}>{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className={isMobile ? "py-3" : ""} onClick={handleMenuItemClick}>
                <BadgeCheck className={isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4"} />
                <span className={isMobile ? "text-base" : ""}>Compte</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={isMobile ? "py-3" : ""} onClick={handleMenuItemClick}>
                <Bell className={isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4"} />
                <span className={isMobile ? "text-base" : ""}>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className={isMobile ? "py-3" : ""}>
              <LogOut className={isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4"} />
              <span className={isMobile ? "text-base" : ""}>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
