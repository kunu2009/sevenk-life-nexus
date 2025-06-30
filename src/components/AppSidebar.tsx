
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Target, Calendar, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Todos", url: "/todos", icon: CheckSquare },
  { title: "Habits", url: "/habits", icon: Target },
  { title: "Calendar", url: "/calendar", icon: Calendar },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="w-16 border-r border-slate-800/30 bg-slate-900/80 backdrop-blur-md">
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        relative w-12 h-12 rounded-2xl mx-2 transition-all duration-300 group
                        ${isActive 
                          ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white shadow-lg shadow-purple-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:scale-105'
                        }
                      `}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url} className="flex items-center justify-center w-full h-full">
                        <item.icon className="h-5 w-5" />
                        {isActive && (
                          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
