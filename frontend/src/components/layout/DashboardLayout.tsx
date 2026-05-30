"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "@/lib/store";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export function DashboardLayout({
  children,
  activeItem,
  onNavigate,
}: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={onNavigate} />

      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        {children}
      </main>
    </div>
  );
}
