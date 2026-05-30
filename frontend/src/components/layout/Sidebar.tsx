"use client";

import { cn, getInitials, truncate } from "@/lib/utils";
import {
  MessageSquare,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuthStore, useChatStore, useUIStore } from "@/lib/store";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  isProductConnected?: boolean;
}

export function Sidebar({ activeItem = "chat", onItemClick, isProductConnected = false }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { chats, activeChatId, createChat, switchChat, deleteChat } = useChatStore();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      window.location.href = "/";
    }
  };

  const handleNewChat = () => {
    createChat();
    onItemClick?.("chat");
  };

  const handleSwitchChat = (chatId: string) => {
    switchChat(chatId);
    onItemClick?.("chat");
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (chats.length <= 1) return;
    deleteChat(chatId);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40",
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      {/* Safal-AI Branding */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Safal-AI</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {/* Product Section */}
        {sidebarOpen && (
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 mb-2">Products</p>
        )}

        {/* SafalMyBuy Chat Header */}
        <button
          onClick={() => onItemClick?.("chat")}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 mb-1",
            activeItem === "chat"
              ? "bg-green-50 text-green-700 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <MessageSquare className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-sm text-left">SafalMyBuy Chat</span>
              {isProductConnected ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              )}
            </>
          )}
        </button>

        {/* Chat List (only when sidebar open and on chat tab) */}
        {sidebarOpen && activeItem === "chat" && isProductConnected && (
          <div className="ml-4 pl-3 border-l border-gray-200 space-y-0.5 mb-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSwitchChat(chat.id)}
                className={cn(
                  "group flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors",
                  activeChatId === chat.id
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <span className="flex-1 text-xs truncate">
                  {truncate(chat.name, 20)}
                </span>
                {chats.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="hidden group-hover:block p-0.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {/* + New Chat button */}
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors w-full"
            >
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mx-3 my-2" />

        {/* Settings */}
        <button
          onClick={() => onItemClick?.("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            activeItem === "settings"
              ? "bg-green-50 text-green-700 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Settings</span>}
        </button>

        {/* Credits */}
        <button
          onClick={() => onItemClick?.("credits")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            activeItem === "credits"
              ? "bg-green-50 text-green-700 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <CreditCard className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Credits</span>}
        </button>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-2 border-t border-gray-100">
        {sidebarOpen ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(user?.name || "U")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.name || "U")}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
