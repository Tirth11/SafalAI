"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, ArrowUpRight, ArrowDownRight, Plus, Check } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const creditPacks = [
  { credits: 50, price: 4.99 },
  { credits: 150, price: 12.99 },
  { credits: 500, price: 39.99 },
];

const usageHistory = [
  { id: "1", action: "Added expense via chat", credits: -2, time: "2026-05-30T10:30:00Z" },
  { id: "2", action: "Receipt scan", credits: -5, time: "2026-05-29T15:00:00Z" },
  { id: "3", action: "Report generated", credits: -10, time: "2026-05-28T09:00:00Z" },
  { id: "4", action: "Credit pack purchased", credits: 100, time: "2026-05-27T12:00:00Z" },
  { id: "5", action: "Chat query", credits: -1, time: "2026-05-26T14:20:00Z" },
];

const creditCosts = [
  { action: "Chat message", cost: "1 credit" },
  { action: "Add expense / purchase", cost: "2 credits" },
  { action: "Receipt / bill scan", cost: "5 credits" },
  { action: "Invoice extraction", cost: "8 credits" },
  { action: "Report generation", cost: "10 credits" },
];

export default function CreditsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleNavigate = (id: string) => {
    if (id === "credits") return;
    router.push(`/${id}`);
  };

  const balance = user?.subscription?.creditsBalance || 0;
  const plan = user?.subscription?.plan || "free";

  return (
    <DashboardLayout activeItem="credits" onNavigate={handleNavigate}>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Credits</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your AI credits and usage</p>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white mb-6 !border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Available Credits</p>
              <p className="text-4xl font-bold mt-1">{balance}</p>
              <p className="text-green-200 text-xs mt-1">
                Plan: <span className="capitalize font-medium text-white">{plan}</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        {/* Credit Costs */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Credit Usage Guide</h3>
          <div className="space-y-2">
            {creditCosts.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5">
                <span className="text-gray-600">{item.action}</span>
                <span className="font-medium text-gray-900">{item.cost}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Buy Credits */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Buy Credit Packs</h3>
          <div className="grid grid-cols-3 gap-3">
            {creditPacks.map((pack, i) => (
              <div key={i} className="text-center border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:bg-green-50 transition-colors">
                <p className="text-2xl font-bold text-gray-900">{pack.credits}</p>
                <p className="text-xs text-gray-500 mb-2">credits</p>
                <p className="text-sm font-semibold text-green-600">${pack.price}</p>
                <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                  Buy
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Usage History */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Usage History</h3>
          <div className="divide-y divide-gray-100">
            {usageHistory.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      tx.credits > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.credits > 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{tx.action}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(tx.time)}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${tx.credits > 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.credits > 0 ? "+" : ""}{tx.credits}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
