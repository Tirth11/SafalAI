"use client";

import { cn } from "@/lib/utils";
import { Search, Bell, Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore, useNotificationStore, useUIStore } from "@/lib/store";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({
  title,
  showSearch = true,
  showNotifications = true,
  onSearch,
}: HeaderProps) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses, purchases, events..."
              className={cn(
                "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg",
                "focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "outline-none transition-all duration-200",
                "bg-gray-50 focus:bg-white",
                "text-sm"
              )}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Credit Balance */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg">
          <span className="text-sm font-medium text-primary-700">
            {user?.subscription?.creditsBalance || 50} credits
          </span>
        </div>

        {/* Notifications */}
        {showNotifications && (
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Avatar */}
        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar name={user?.name || "User"} src={user?.avatar} size="sm" />
        </button>
      </div>
    </header>
  );
}
