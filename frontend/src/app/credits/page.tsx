"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { Button, Input, Card, Badge, Modal } from "@/components/ui";
import {
  CreditCard,
  Zap,
  Sparkles,
  Check,
  Crown,
  Star,
  Building2,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

// Mock data
const plans = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    credits: 20,
    features: [
      "20 AI credits",
      "Basic text commands",
      "Basic receipt scanning",
      "Limited reports",
    ],
    popular: false,
  },
  {
    id: "basic",
    name: "Basic AI",
    price: 9.99,
    credits: 100,
    features: [
      "100 AI credits/month",
      "Expense creation",
      "Purchase tracking",
      "Basic receipt scanning",
      "Basic reports",
    ],
    popular: false,
  },
  {
    id: "advanced",
    name: "Advanced AI",
    price: 24.99,
    credits: 300,
    features: [
      "300 AI credits/month",
      "OCR invoice extraction",
      "Warranty automation",
      "Family expense AI",
      "Smart categorization",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium AI",
    price: 49.99,
    credits: 750,
    features: [
      "750 AI credits/month",
      "Advanced analytics",
      "Voice commands",
      "WhatsApp integration",
      "Personalized insights",
      "24/7 support",
    ],
    popular: false,
  },
];

const transactions = [
  {
    id: "1",
    type: "usage",
    amount: -2,
    description: "Added expense via chat",
    createdAt: "2026-05-29T10:30:00Z",
  },
  {
    id: "2",
    type: "usage",
    amount: -5,
    description: "Receipt scan: Whole Foods",
    createdAt: "2026-05-28T15:45:00Z",
  },
  {
    id: "3",
    type: "purchase",
    amount: 100,
    description: "Credit pack purchase",
    createdAt: "2026-05-27T09:00:00Z",
  },
  {
    id: "4",
    type: "usage",
    amount: -1,
    description: "Budget status query",
    createdAt: "2026-05-26T14:20:00Z",
  },
  {
    id: "5",
    type: "bonus",
    amount: 10,
    description: "Referral bonus",
    createdAt: "2026-05-25T11:00:00Z",
  },
];

const creditPacks = [
  { credits: 50, price: 4.99, bonus: 0 },
  { credits: 150, price: 12.99, bonus: 15 },
  { credits: 500, price: 39.99, bonus: 75 },
  { credits: 1000, price: 74.99, bonus: 200 },
];

export default function CreditsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  const currentCredits = user?.subscription?.creditsBalance || 50;
  const currentPlan = user?.subscription?.plan || "free";

  return (
    <DashboardLayout title="Credits" activeItem="credits">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Credits & Subscription</h1>
            <p className="text-gray-500">Manage your AI credits and subscription plan</p>
          </div>
        </div>

        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm">Available Credits</p>
              <p className="text-5xl font-bold mt-2">{currentCredits}</p>
              <p className="text-white/60 text-sm mt-2">
                Current plan: <span className="font-semibold text-white capitalize">{currentPlan}</span>
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="bg-white text-primary-700 hover:bg-gray-100">
              <Plus className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              View Usage
            </Button>
          </div>
        </Card>

        {/* Credit Packs */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Buy Credit Packs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack, i) => (
              <Card key={i} hover className="relative">
                {pack.bonus > 0 && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    +{pack.bonus} bonus
                  </div>
                )}
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{pack.credits}</p>
                  <p className="text-sm text-gray-500">credits</p>
                  <p className="text-xl font-semibold text-primary-600 mt-2">
                    ${pack.price}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Purchase
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                hover
                className={cn(
                  "relative",
                  plan.popular && "border-primary-500 border-2"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="pt-2">
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500">/month</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {plan.credits} AI credits/month
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full mt-6"
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Credit History</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      tx.type === "usage" ? "bg-red-100 text-red-600" : tx.type === "purchase" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    )}
                  >
                    {tx.type === "usage" ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    tx.amount > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
