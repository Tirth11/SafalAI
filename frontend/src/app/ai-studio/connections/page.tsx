"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Tabs } from "@/components/ui";
import { LLMsTab } from "@/components/ai-studio/LLMsTab";
import { MCPServersTab } from "@/components/ai-studio/MCPServersTab";
import { APIConnectionsTab } from "@/components/ai-studio/APIConnectionsTab";
import { useAIStudioStore } from "@/lib/ai-studio-store";
import { useAuthStore } from "@/lib/store";
import { Brain, Globe, Server } from "lucide-react";

export default function AIConnectionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { llms, mcps, apis } = useAIStudioStore();
  const [tab, setTab] = useState("llms");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/");
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;

  return (
    <DashboardLayout
      activeKey="ai-studio:connections"
      onNavigate={(_key, path) => router.push(path)}
      headerTitle="AI Connections"
      headerSubtitle="Securely configure the LLMs, MCP servers and APIs your agents use"
    >
      <div className="p-6 max-w-7xl mx-auto w-full">
        <Tabs
          tabs={[
            { id: "llms", label: "LLMs", icon: <Brain className="w-4 h-4" />, badge: llms.length },
            { id: "mcp", label: "MCP Servers", icon: <Server className="w-4 h-4" />, badge: mcps.length },
            { id: "apis", label: "API Connections", icon: <Globe className="w-4 h-4" />, badge: apis.length },
          ]}
          defaultTab="llms"
          onChange={setTab}
          className="mb-5"
        />
        {tab === "llms" && <LLMsTab />}
        {tab === "mcp" && <MCPServersTab />}
        {tab === "apis" && <APIConnectionsTab />}
      </div>
    </DashboardLayout>
  );
}
