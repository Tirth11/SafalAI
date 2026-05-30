"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { ChatInterface } from "@/components/chat";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleNavigate = (id: string) => {
    if (id === "chat") return; // already here
    router.push(`/${id}`);
  };

  return (
    <DashboardLayout activeItem="chat" onNavigate={handleNavigate}>
      <ChatInterface />
    </DashboardLayout>
  );
}
