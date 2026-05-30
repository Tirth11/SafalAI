"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { PurchaseList } from "@/components/purchases";
import { useAuthStore } from "@/lib/store";

export default function PurchasesPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Purchases" activeItem="purchases">
      <PurchaseList />
    </DashboardLayout>
  );
}
