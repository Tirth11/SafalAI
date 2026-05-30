"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useUIStore } from "@/lib/store";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export function DashboardLayout({
  children,
  title,
  activeItem,
  onNavigate,
}: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={onNavigate} />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <Header title={title} />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
