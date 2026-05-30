"use client";

import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Shield,
  Brain,
  Globe,
  ShoppingCart,
  BarChart3,
  Receipt,
  Users,
  Clock,
  Sparkles,
  FileText,
  Bell,
  Briefcase,
} from "lucide-react";

const products = [
  {
    id: "safalmybuy",
    name: "SafalMyBuy",
    description:
      "Track expenses, purchases, receipts, warranties, and manage family finances with ease.",
    icon: <ShoppingCart className="w-7 h-7" />,
    color: "bg-green-100 text-green-600",
    available: true,
  },
  {
    id: "more-1",
    name: "More Products Coming Soon",
    description:
      "New smart products for business workflows, records management, and daily task automation.",
    icon: <Sparkles className="w-7 h-7" />,
    color: "bg-orange-100 text-orange-600",
    available: false,
  },
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Prompts",
    description: "Just type what you need. AI understands your intent and auto-fills all the details.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Receipt className="w-6 h-6" />,
    title: "Receipts & Bills",
    description: "Upload bills and receipts. AI reads, extracts, and saves all details automatically.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Reports & Analytics",
    description: "Ask questions in plain language and get spending reports instantly.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Reminders & Warranties",
    description: "Never miss expiry dates or warranty periods. Get timely reminders.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Family & Events",
    description: "Track shared expenses, manage event budgets, and split costs easily.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Business Records",
    description: "Add business details, outlays, and budgets directly through simple conversation.",
    color: "bg-teal-100 text-teal-600",
  },
];

const floatingCards = [
  { label: "Expense Added", icon: <FileText className="w-3.5 h-3.5" />, color: "bg-green-500" },
  { label: "Receipt Scanned", icon: <Receipt className="w-3.5 h-3.5" />, color: "bg-blue-500" },
  { label: "Purchase Saved", icon: <ShoppingCart className="w-3.5 h-3.5" />, color: "bg-purple-500" },
  { label: "Reminder Set", icon: <Bell className="w-3.5 h-3.5" />, color: "bg-orange-500" },
  { label: "Report Ready", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "bg-indigo-500" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Safal-AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Assistant
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Manage tasks faster with
                <span className="text-green-600"> AI-powered prompts.</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Add expenses, purchases, receipts, records, and business details directly into SafalVir apps — without manual effort.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white bg-green-600 hover:bg-green-700 font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Start with Safal-AI
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-medium rounded-xl transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right: Visual Illustration */}
            <div className="relative hidden lg:block">
              {/* Main Chat Window */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 relative z-10">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Safal-AI Assistant</p>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="py-4 space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[75%]">
                      Add $500 grocery expense from Walmart
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm max-w-[80%]">
                      Done! I added your expense:<br />
                      <span className="text-xs text-gray-500 mt-1 block">Grocery • $500 • Walmart • Today</span>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[75%]">
                      Show my spending this month
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-400">
                    Type your request...
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 flex flex-col gap-2 z-20">
                {floatingCards.slice(0, 3).map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-gray-100 text-xs font-medium"
                    style={{ transform: `translateX(${i * 8}px)` }}
                  >
                    <span className={`w-5 h-5 rounded ${card.color} text-white flex items-center justify-center`}>
                      {card.icon}
                    </span>
                    <span className="text-gray-700">{card.label}</span>
                  </div>
                ))}
              </div>

              {/* Bottom floating cards */}
              <div className="absolute -bottom-3 -left-6 flex gap-2 z-20">
                {floatingCards.slice(3).map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md border border-gray-100 text-xs font-medium"
                  >
                    <span className={`w-5 h-5 rounded ${card.color} text-white flex items-center justify-center`}>
                      {card.icon}
                    </span>
                    <span className="text-gray-700">{card.label}</span>
                  </div>
                ))}
              </div>

              {/* Background Gradient */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-3xl transform rotate-2 scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Safal-AI helps users complete manual tasks faster by using simple prompts. Users can add expenses, purchases, receipts, records, reminders, and business details directly into SafalVir applications without filling long forms. It makes daily work easier, faster, and more organized with the help of AI.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Safal-AI Can Do</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              All the power of a finance app, accessible through simple conversations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Product</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Connect your existing product and let AI manage it for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl border border-gray-200 p-6 transition-all ${
                  product.available ? "hover:shadow-lg hover:border-green-200" : "opacity-60"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl ${product.color} flex items-center justify-center mb-4`}>
                  {product.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                {product.available ? (
                  <span className="inline-flex items-center text-sm font-medium text-green-600">
                    Available Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Three simple steps to get started.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Create Account", desc: "Sign up and select your SafalVir product." },
              { step: "2", title: "Connect Product", desc: "Login with your product account to authorize access." },
              { step: "3", title: "Start Prompting", desc: "Type what you need. AI fills forms and saves records for you." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-hero text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to work smarter?
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Stop filling long forms. Start using simple prompts to manage everything.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white bg-green-600 hover:bg-green-700 font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded gradient-hero flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Safal-AI</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Safal-AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
