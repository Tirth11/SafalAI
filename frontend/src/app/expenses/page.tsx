"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { ExpenseList } from "@/components/expenses";
import { useAuthStore } from "@/lib/store";

export default function ExpensesPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Expenses" activeItem="expenses">
      <ExpenseList />
    </DashboardLayout>
  );
}
