"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Button, Input, Select, Card, Badge } from "@/components/ui";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Download,
  FileText,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Mock data for charts
const monthlyData = [
  { month: "Jan", amount: 42000 },
  { month: "Feb", amount: 38000 },
  { month: "Mar", amount: 45000 },
  { month: "Apr", amount: 52000 },
  { month: "May", amount: 48000 },
  { month: "Jun", amount: 55000 },
];

const categoryData = [
  { category: "Food & Groceries", amount: 25000, percentage: 35, color: "bg-green-500" },
  { category: "Transportation", amount: 15000, percentage: 21, color: "bg-blue-500" },
  { category: "Shopping", amount: 12000, percentage: 17, color: "bg-purple-500" },
  { category: "Entertainment", amount: 8000, percentage: 11, color: "bg-pink-500" },
  { category: "Utilities", amount: 7000, percentage: 10, color: "bg-yellow-500" },
  { category: "Others", amount: 5000, percentage: 7, color: "bg-gray-400" },
];

const insights = [
  {
    id: "1",
    type: "increase",
    message: "Your food expenses increased by 18% compared to last month",
    category: "Food & Groceries",
  },
  {
    id: "2",
    type: "decrease",
    message: "Transportation costs decreased by 12% this month",
    category: "Transportation",
  },
  {
    id: "3",
    type: "alert",
    message: "You're approaching your monthly budget limit",
    category: "Overall",
  },
];

export default function ReportsPage() {
  const { isAuthenticated } = useAuthStore();
  const [timeRange, setTimeRange] = useState("this_month");

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  const totalExpenses = categoryData.reduce((sum, c) => sum + c.amount, 0);

  return (
    <DashboardLayout title="Reports" activeItem="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500">AI-powered insights into your spending</p>
          </div>
          <div className="flex gap-2">
            <Select
              options={[
                { value: "this_week", label: "This Week" },
                { value: "this_month", label: "This Month" },
                { value: "last_month", label: "Last Month" },
                { value: "last_3_months", label: "Last 3 Months" },
                { value: "this_year", label: "This Year" },
              ]}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
              <p className="text-sm text-gray-500">Personalized recommendations based on your spending patterns</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  insight.type === "alert" ? "bg-orange-50" : "bg-white/50"
                )}
              >
                {insight.type === "increase" ? (
                  <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : insight.type === "decrease" ? (
                  <TrendingDown className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm text-gray-700">{insight.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{insight.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUp className="w-4 h-4 text-red-500" />
              <span className="text-red-600">12.5%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Daily Spending</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(2387)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowDown className="w-4 h-4 text-green-500" />
              <span className="text-green-600">5.2%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Top Category</p>
                <p className="text-2xl font-bold text-gray-900">Food</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">35% of total expenses</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
            <div className="h-64 flex items-end gap-2">
              {monthlyData.map((data, i) => {
                const max = Math.max(...monthlyData.map((d) => d.amount));
                const height = (data.amount / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "200px" }}>
                      <div
                        className="absolute bottom-0 w-full bg-primary-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {categoryData.map((category, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{category.category}</span>
                    <span className="font-medium">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", category.color)}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Ask AI Section */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Ask AI About Your Finances</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "How much did I spend on food last week?",
                  "Compare this month with last month",
                  "What's my top spending category?",
                  "Generate a yearly report",
                ].map((question, i) => (
                  <button
                    key={i}
                    className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
