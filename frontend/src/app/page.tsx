"use client";

import Link from "next/link";
import {
  Sparkles,
  ShoppingCart,
  Brain,
  ArrowRight,
  Shield,
  Zap,
  Globe,
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
    id: "safal-ai",
    name: "Safal-AI",
    description:
      "AI-powered assistant for expense management, receipt scanning, and financial insights.",
    icon: <Brain className="w-7 h-7" />,
    color: "bg-purple-100 text-purple-600",
    available: true,
  },
  {
    id: "more",
    name: "More Coming Soon",
    description:
      "New SafalVir products for business workflows, records management, and automation.",
    icon: <Sparkles className="w-7 h-7" />,
    color: "bg-orange-100 text-orange-600",
    available: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SafalVir</span>
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
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Smart Digital Products
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Welcome to SafalVir
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            SafalVir builds smart digital products that help users manage daily
            tasks, expenses, purchases, records, and business workflows with
            ease. Choose your product and continue to access AI-powered features
            and services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-medium rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Our Products
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Choose from our suite of smart digital products designed to
              simplify your daily workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 ${
                  product.available
                    ? "hover:shadow-lg hover:border-gray-300"
                    : "opacity-70"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${product.color} flex items-center justify-center mb-4`}
                >
                  {product.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                {product.available ? (
                  <span className="inline-flex items-center text-sm font-medium text-green-600">
                    Available
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
              <p className="text-sm text-gray-600">
                Your data is encrypted and protected at all times.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Smart automation to save your time and effort.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Simple</h3>
              <p className="text-sm text-gray-600">
                Easy to understand and use for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SafalVir. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
