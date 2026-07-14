"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore, useProductsStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { SafalProductId } from "@/types";
import {
  User,
  Bell,
  Save,
  Bot,
  Shield,
  LogOut,
  CheckCircle,
} from "lucide-react";

const tabIds = [
  "profile",
  "notifications",
  "ai_workspace",
  "security",
  "logout",
] as const;
type TabId = (typeof tabIds)[number];

const productNames: Record<SafalProductId, string> = {
  safalmybuy: "SafalMyBuy",
  safalirdrainmate: "SafalIRDrainMate",
  safalvendors: "SafalVendors",
  safalcalendar: "SafalCalendar",
  safalsubscriptions: "SafalSubscriptions",
  safalreviews: "SafalReviews",
  safaldrive: "SafalDrive",
  safalutilities: "SafalUtilities",
};

function SettingsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") || "profile") as TabId;
  const initialTab: TabId = tabIds.includes(tabParam) ? tabParam : "profile";

  const { isAuthenticated, user, logout } = useAuthStore();
  const { connections } = useProductsStore();

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) return null;

  const handleNavigate = (_key: string, path: string) => {
    router.push(path);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "ai_workspace",
      label: "AI Workspace",
      icon: <Bot className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="w-4 h-4" />,
    },
  ];

  const connectedProducts = (
    Object.keys(productNames) as SafalProductId[]
  ).filter((id) => connections[id]?.connected);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <DashboardLayout
      activeKey="settings"
      onNavigate={handleNavigate}
      headerTitle="Settings"
      headerSubtitle="Manage your account, models, and preferences"
    >
      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Profile, notifications, AI Workspace, security, and logout.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 text-green-700 border-green-600 whitespace-nowrap"
                  : "flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 text-gray-500 border-transparent hover:text-gray-700 whitespace-nowrap"
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  defaultValue={user?.name?.split(" ")[0]}
                />
                <Input
                  label="Last Name"
                  defaultValue={user?.name?.split(" ").slice(1).join(" ")}
                />
              </div>
              <Input
                label="Email"
                type="email"
                defaultValue={user?.email}
                suffix={
                  <button className="text-xs text-green-600 hover:text-green-700">
                    Verify
                  </button>
                }
              />
              <Input
                label="Phone"
                type="tel"
                defaultValue={user?.phone || ""}
                placeholder="+91 98765 43210"
                suffix={
                  <button className="text-xs text-green-600 hover:text-green-700">
                    Verify
                  </button>
                }
              />
              <p className="text-[11px] text-gray-400 -mt-2">
                Email and phone updates require OTP verification.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Login method
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  Email / Phone OTP
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Connected Products
                </label>
                {connectedProducts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No products connected yet. Connect one from the sidebar.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {connectedProducts.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {productNames[id]}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Account Status
                </label>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active &amp; Verified
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                {
                  id: "product",
                  label: "Product connection alerts",
                  desc: "When a product is connected or disconnected",
                },
                {
                  id: "tokens",
                  label: "Safal Token low balance",
                  desc: "When your Safal Tokens are running low",
                },
                {
                  id: "renewal",
                  label: "Subscription renewal",
                  desc: "Reminders for upcoming renewals",
                },
                {
                  id: "report",
                  label: "Report alerts",
                  desc: "When a report is ready",
                },
                {
                  id: "product_specific",
                  label: "Product-specific alerts",
                  desc: "Updates from connected SafalVir products",
                },
                {
                  id: "integration",
                  label: "Integration failures",
                  desc: "When a third-party integration fails",
                },
                {
                  id: "security",
                  label: "Security alerts",
                  desc: "New device login or unusual activity",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI Workspace */}
        {activeTab === "ai_workspace" && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                AI Workspace Preferences
              </h3>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Show agent under AI Workspace
                  </p>
                  <p className="text-xs text-gray-500">
                    Toggle the visibility of your agents in the AI Workspace.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Secure login</p>
                  <p className="text-xs text-gray-500">
                    Email/Phone OTP plus Google, Apple, or Microsoft.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Encrypted credentials</p>
                  <p className="text-xs text-gray-500">
                    LLM API keys, passwords, and integration secrets are
                    encrypted at rest and masked in the UI.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Confirmation before actions</p>
                  <p className="text-xs text-gray-500">
                    Important actions show a preview and need your approval
                    before they run.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Disconnect anytime</p>
                  <p className="text-xs text-gray-500">
                    Remove products, integrations, or LLM APIs whenever you
                    want.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <Button variant="outline" size="sm">
                  View Active Sessions
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Logout */}
        {activeTab === "logout" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">Logout</h3>
            <p className="text-sm text-gray-500 mb-4">
              Sign out of Safal-AI on this device. Your data and connected
              products stay safe and ready when you sign back in.
            </p>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageInner />
    </Suspense>
  );
}
