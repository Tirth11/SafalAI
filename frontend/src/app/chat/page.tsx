"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { ChatInterface } from "@/components/chat";
import { ProductConnect } from "@/components/chat/ProductConnect";
import { useAuthStore } from "@/lib/store";
import { CheckCircle } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isProductConnected, setIsProductConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUser, setConnectedUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    // Check if product was previously connected (from localStorage)
    const connected = localStorage.getItem("safalmybuy_connected");
    if (connected === "true") {
      setIsProductConnected(true);
      setConnectedUser({
        name: user?.name || "User",
        email: user?.email || "",
      });
    }
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated) return null;

  const handleConnect = () => {
    setIsConnecting(true);

    // Simulate redirect to SafalMyBuy login
    // In production: window.location.href = "https://dev.safalmybuy.com/login?redirect=..."
    setTimeout(() => {
      // Simulate successful authorization callback
      setIsProductConnected(true);
      setConnectedUser({
        name: user?.name || "User",
        email: user?.email || "",
      });
      localStorage.setItem("safalmybuy_connected", "true");
      setIsConnecting(false);
    }, 2000);
  };

  const handleNavigate = (id: string) => {
    if (id === "chat") return;
    router.push(`/${id}`);
  };

  return (
    <DashboardLayout activeItem="chat" onNavigate={handleNavigate} isProductConnected={isProductConnected}>
      <div className="flex flex-col h-screen">
        {/* Top Header - Always shows Safal-AI */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-semibold text-gray-900">SafalMyBuy Chat</h1>
              {isProductConnected ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Connected as {connectedUser?.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">Not Connected</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
            <span className="text-xs font-medium text-green-700">
              {user?.subscription?.creditsBalance || 0} credits
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {isProductConnected ? (
            <ChatInterface />
          ) : (
            <ProductConnect onConnect={handleConnect} isConnecting={isConnecting} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
