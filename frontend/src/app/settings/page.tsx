"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input, Select, Card, Badge } from "@/components/ui";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Trash2,
  Save,
  Camera,
} from "lucide-react";

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "preferences", label: "Preferences", icon: <Globe className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout title="Settings" activeItem="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
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
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue={user?.name} />
                    <Input label="Email" type="email" defaultValue={user?.email} />
                    <Input label="Phone" type="tel" placeholder="+1 234 567 8900" />
                    <Input label="Currency" defaultValue={user?.currency || "USD"} />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: "warranty", label: "Warranty expiry reminders", description: "Get notified before your warranties expire" },
                    { id: "expiry", label: "Product expiry alerts", description: "Reminders for expiring food, medicines, etc." },
                    { id: "budget", label: "Budget alerts", description: "Get notified when you reach budget limits" },
                    { id: "credits", label: "Low credit balance", description: "Alert when credits are running low" },
                    { id: "reports", label: "Monthly reports", description: "Receive monthly spending summaries" },
                    { id: "updates", label: "Product updates", description: "New features and improvements" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <Input type="password" label="Current Password" />
                    <Input type="password" label="New Password" />
                    <Input type="password" label="Confirm New Password" />
                    <Button>Update Password</Button>
                  </div>
                </Card>
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </Card>
              </div>
            )}

            {activeTab === "preferences" && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">App Preferences</h3>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Language"
                      options={[
                        { value: "en", label: "English" },
                        { value: "hi", label: "Hindi" },
                        { value: "gu", label: "Gujarati" },
                      ]}
                      defaultValue="en"
                    />
                    <Select
                      label="Currency"
                      options={[
                        { value: "USD", label: "USD ($)" },
                        { value: "INR", label: "INR (₹)" },
                        { value: "EUR", label: "EUR (€)" },
                      ]}
                      defaultValue="USD"
                    />
                    <Select
                      label="Date Format"
                      options={[
                        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                      ]}
                      defaultValue="MM/DD/YYYY"
                    />
                    <Select
                      label="Theme"
                      options={[
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                        { value: "system", label: "System" },
                      ]}
                      defaultValue="light"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Billing & Payments</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Current Plan</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.subscription?.plan || "Free"}</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Payment Method</p>
                      <p className="text-sm text-gray-500">•••• •••• •••• 4242</p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
