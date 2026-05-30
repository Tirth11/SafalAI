"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { ReceiptList } from "@/components/receipts";
import { useAuthStore } from "@/lib/store";

export default function ReceiptsPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Receipts" activeItem="receipts">
      <ReceiptList />
    </DashboardLayout>
  );
}
