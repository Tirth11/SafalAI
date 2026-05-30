"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { User, Bell, Save } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleNavigate = (id: string) => {
    if (id === "settings") return;
    router.push(`/${id}`);
  };

  return (
    <DashboardLayout activeItem="settings" onNavigate={handleNavigate}>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your profile and preferences</p>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {[
            { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
            { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-green-700 border-green-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue={user?.name?.split(" ")[0]} />
                <Input label="Last Name" defaultValue={user?.name?.split(" ").slice(1).join(" ")} />
              </div>
              <Input label="Email" type="email" defaultValue={user?.email} />
              <Input label="Phone" type="tel" defaultValue={user?.phone || ""} placeholder="+91 98765 43210" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Selected Product</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  SafalMyBuy
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Status</label>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active & Verified
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

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: "warranty", label: "Warranty reminders", desc: "Get notified before warranties expire" },
                { id: "expiry", label: "Expiry reminders", desc: "Alerts for expiring items" },
                { id: "credits", label: "Low credit alerts", desc: "When your AI credits are running low" },
                { id: "reports", label: "Report reminders", desc: "Monthly spending report notifications" },
                { id: "events", label: "Event payment reminders", desc: "Pending event payments" },
                { id: "family", label: "Family/shared expense alerts", desc: "Shared expense notifications" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
