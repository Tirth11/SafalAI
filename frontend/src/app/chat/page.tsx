"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { ChatInterface } from "@/components/chat";
import { useAuthStore } from "@/lib/store";

export default function ChatPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="AI Chat" activeItem="chat">
      <ChatInterface />
    </DashboardLayout>
  );
}
