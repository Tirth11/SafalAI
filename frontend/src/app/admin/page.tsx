"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn, formatCurrency, formatDate, formatNumber, formatRelativeTime } from "@/lib/utils";
import { Button, Input, Select, Card, Badge, Avatar, Modal } from "@/components/ui";
import {
  Users,
  CreditCard,
  Receipt,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Settings,
  Bell,
  Shield,
  Activity,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Ban,
} from "lucide-react";

// Mock admin data
const stats = {
  totalUsers: 12500,
  activeUsers: 8500,
  totalCreditsUsed: 2450000,
  totalRevenue: 125000,
  pendingSupport: 23,
  activeSubscriptions: 6200,
};

const recentUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", plan: "premium", credits: 750, status: "active", joinedAt: "2024-05-28T10:00:00Z" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", plan: "basic", credits: 45, status: "active", joinedAt: "2024-05-27T15:30:00Z" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", plan: "advanced", credits: 180, status: "active", joinedAt: "2024-05-26T09:00:00Z" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", plan: "free", credits: 5, status: "inactive", joinedAt: "2024-05-25T14:00:00Z" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", plan: "premium", credits: 620, status: "active", joinedAt: "2024-05-24T11:00:00Z" },
];

const aiLogs = [
  { id: "1", user: "John Doe", action: "add_expense", credits: 2, status: "success", duration: "0.8s", timestamp: "2024-05-29T10:30:00Z" },
  { id: "2", user: "Jane Smith", action: "scan_receipt", credits: 5, status: "success", duration: "2.1s", timestamp: "2024-05-29T10:25:00Z" },
  { id: "3", user: "Bob Wilson", action: "generate_report", credits: 10, status: "failed", duration: "3.2s", timestamp: "2024-05-29T10:20:00Z" },
  { id: "4", user: "Alice Brown", action: "chat_query", credits: 1, status: "success", duration: "0.5s", timestamp: "2024-05-29T10:15:00Z" },
];

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  // In a real app, check if user is admin
  // if (!isAuthenticated || !user?.role?.includes("admin")) {
  //   redirect("/auth/login");
  // }

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
    { id: "ai-logs", label: "AI Logs", icon: <Activity className="w-4 h-4" /> },
    { id: "support", label: "Support", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Safal-AI Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <Avatar name="Admin" size="sm" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-gray-500">this month</span>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeUsers)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">68% of total users</p>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Credits Used</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalCreditsUsed)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">+25%</span>
                    <span className="text-gray-500">this month</span>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">+18%</span>
                    <span className="text-gray-500">this month</span>
                  </div>
                </Card>
              </div>

              {/* Subscription Breakdown */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { plan: "Premium", users: 1200, percentage: 19, color: "bg-purple-500" },
                      { plan: "Advanced", users: 2500, percentage: 40, color: "bg-primary-500" },
                      { plan: "Basic", users: 2500, percentage: 40, color: "bg-blue-500" },
                      { plan: "Free", users: 6300, percentage: 51, color: "bg-gray-400" },
                    ].map((item) => (
                      <div key={item.plan}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{item.plan}</span>
                          <span className="text-gray-500">{formatNumber(item.users)} users</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {aiLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            log.status === "success" ? "bg-green-500" : "bg-red-500"
                          )} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.user}</p>
                            <p className="text-xs text-gray-500">{log.action}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{formatRelativeTime(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <Card>
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Search users..." icon={<Search className="w-5 h-5" />} className="flex-1" />
                  <Select options={[{ value: "all", label: "All Plans" }, { value: "free", label: "Free" }, { value: "basic", label: "Basic" }, { value: "advanced", label: "Advanced" }, { value: "premium", label: "Premium" }]} />
                  <Select options={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Credits</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={user.name} size="sm" />
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.plan === "premium" ? "primary" : user.plan === "advanced" ? "secondary" : "gray"} className="capitalize">
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{user.credits}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === "active" ? "success" : "gray"}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{formatDate(user.joinedAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-1">
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Ban className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "ai-logs" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">AI Action Logs</h1>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Credits</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Duration</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{log.user}</td>
                          <td className="py-3 px-4 text-sm capitalize">{log.action.replace(/_/g, " ")}</td>
                          <td className="py-3 px-4 text-sm">{log.credits}</td>
                          <td className="py-3 px-4">
                            <Badge variant={log.status === "success" ? "success" : "danger"}>{log.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{log.duration}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">{formatRelativeTime(log.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <Card>
                <p className="text-gray-500">Subscription management features coming soon...</p>
              </Card>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
              <Card>
                <p className="text-gray-500">Support ticket management features coming soon...</p>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
