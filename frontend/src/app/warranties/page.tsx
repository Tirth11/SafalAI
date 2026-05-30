"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { WarrantyDashboard, ExpiryTracker } from "@/components/warranties";
import { useAuthStore } from "@/lib/store";
import { Tabs } from "@/components/ui";

export default function WarrantiesPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Warranties & Expiry" activeItem="warranties">
      <div className="space-y-6">
        <Tabs
          tabs={[
            { id: "warranties", label: "Warranties", icon: <ShieldCheck className="w-4 h-4" /> },
            { id: "expiry", label: "Expiry Tracking", icon: <Clock className="w-4 h-4" /> },
          ]}
        />
        <WarrantyDashboard />
      </div>
    </DashboardLayout>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
