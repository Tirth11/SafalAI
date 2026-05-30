"use client";

import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Receipt,
  Wallet,
  ShoppingCart,
  ShieldCheck,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore, useUIStore } from "@/lib/store";

const menuItems = [
  { id: "chat", label: "AI Chat", icon: MessageSquare, badge: null },
  { id: "expenses", label: "Expenses", icon: Wallet, badge: null },
  { id: "purchases", label: "Purchases", icon: ShoppingCart, badge: null },
  { id: "receipts", label: "Receipts", icon: Receipt, badge: null },
  { id: "warranties", label: "Warranties", icon: ShieldCheck, badge: "2" },
  { id: "family", label: "Family", icon: Users, badge: null },
  { id: "events", label: "Events", icon: Calendar, badge: null },
  { id: "reports", label: "Reports", icon: BarChart3, badge: null },
  { id: "credits", label: "Credits", icon: CreditCard, badge: "50" },
  { id: "notifications", label: "Alerts", icon: Bell, badge: "3" },
  { id: "settings", label: "Settings", icon: Settings, badge: null },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function Sidebar({ activeItem = "chat", onItemClick }: SidebarProps) {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Safal-AI</span>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick?.(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            isActive
                              ? "bg-primary-100 text-primary-700"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-100">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <Avatar name={user?.name || "User"} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Sign in"}
              </p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button className="w-full flex justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
