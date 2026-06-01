"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  MessageSquare,
  Zap,
  Globe,
  Key,
  Package,
  Upload,
  Mic,
  Workflow,
  Layers,
  Coins,
  BarChart3,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
  Bot,
  Send,
  Lock,
  UserCheck,
  FileCheck,
  Unplug,
  Plug,
  Sparkles,
  FileText,
  Search,
  Database,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Products", href: "#products" },
    { label: "AI Models", href: "#ai-models" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ];

  // What is SAFAL-AI benefit cards (SAI-LP-005)
  const benefitCards = [
    { icon: MessageSquare, title: "Type a prompt", desc: "Describe what you need in plain words." },
    { icon: Upload, title: "Upload a file", desc: "Share documents and let AI read them." },
    { icon: Plug, title: "Connect your AI model", desc: "Use ChatGPT, Claude, Gemini, and more." },
    { icon: Zap, title: "Complete tasks faster", desc: "Get work done from one simple place." },
  ];

  // Key features (SAI-LP-006)
  const features = [
    { icon: MessageSquare, title: "AI Chat Workspace", desc: "Complete tasks through a simple, smart chat." },
    { icon: Zap, title: "Prompt-Based Automation", desc: "Type what you want and let SAFAL-AI do it." },
    { icon: Globe, title: "Connect AI Models", desc: "Use ChatGPT, Claude, Gemini, and other LLMs." },
    { icon: Key, title: "Bring Your Own API Key", desc: "Connect supported models with your own key." },
    { icon: Package, title: "SafalVir App Integration", desc: "Work with SafalVir products in one place." },
    { icon: Upload, title: "File Upload & Understanding", desc: "Upload files and let AI extract details." },
    { icon: Mic, title: "Voice Commands", desc: "Speak your request and complete tasks." },
    { icon: Workflow, title: "Workflow Automation", desc: "Automate repetitive tasks and processes." },
    { icon: Layers, title: "Multi-Chat Support", desc: "Run many AI chats for different tasks." },
    { icon: Coins, title: "Safal Tokens", desc: "Simple usage units for every AI action." },
    { icon: BarChart3, title: "Reports & Insights", desc: "Generate reports and clear insights." },
    { icon: ShieldCheck, title: "Secure Authorization", desc: "Actions run only with your permission." },
  ];

  // AI models (SAI-LP-007)
  const aiModels = [
    { name: "ChatGPT", color: "bg-green-500", desc: "OpenAI GPT models" },
    { name: "Claude", color: "bg-purple-500", desc: "Anthropic Claude models" },
    { name: "Gemini", color: "bg-blue-500", desc: "Google Gemini models" },
    { name: "Custom LLMs", color: "bg-orange-500", desc: "Other supported models" },
  ];

  // SafalVir products (SAI-LP-009) - show product names only
  const products = [
    { name: "SafalMyBuy" },
    { name: "SafalIRDrainMate" },
    { name: "SafalVendors" },
    { name: "SafalCalendar" },
    { name: "SafalSubscriptions" },
    { name: "SafalReviews" },
    { name: "SafalDrive" },
    { name: "SafalUtilities" },
  ];

  // How it works (SAI-LP-011)
  const steps = [
    { step: "1", title: "Sign up or sign in", desc: "Create your account in minutes." },
    { step: "2", title: "Choose a product", desc: "Pick a SafalVir product to work with." },
    { step: "3", title: "Connect a model", desc: "Add an AI model if your plan allows." },
    { step: "4", title: "Prompt or upload", desc: "Type a prompt or upload a file." },
    { step: "5", title: "Review the result", desc: "Check what SAFAL-AI prepared for you." },
    { step: "6", title: "Confirm & complete", desc: "Approve the action and you are done." },
  ];

  // Use cases (SAI-LP-012)
  const useCases = [
    { icon: Zap, title: "Automate Manual Tasks", desc: "Let AI handle repetitive everyday work." },
    { icon: Upload, title: "Upload Files", desc: "Upload documents, receipts, or PDFs and extract details." },
    { icon: BarChart3, title: "Generate Reports", desc: "Turn your data into clear reports fast." },
    { icon: Plug, title: "Connect AI Models", desc: "Bring your preferred model into one place." },
    { icon: Package, title: "Work with SafalVir", desc: "Manage SafalVir products through AI." },
    { icon: FileText, title: "Summarize Documents", desc: "Get short summaries of long files." },
    { icon: Database, title: "Extract Data", desc: "Pull key details from files and text." },
    { icon: Mic, title: "Use Voice Commands", desc: "Speak to complete tasks hands-free." },
    { icon: Search, title: "Search Past Records", desc: "Find old records with simple questions." },
    { icon: Workflow, title: "Manage Workflows", desc: "Run business and personal workflows." },
  ];

  // Pricing plans (SAI-LP-013) - Safal Tokens
  const pricingPlans = [
    { name: "Free", price: "$0", period: "forever", tokens: "Limited Safal Tokens", productCount: "1 product", aiModels: false, cta: "Start Free", popular: false },
    { name: "Basic", price: "$5.99", period: "/month", tokens: "More Safal Tokens", productCount: "2 products", aiModels: false, cta: "Choose Basic", popular: false },
    { name: "Advanced", price: "$7.99", period: "/month", tokens: "Higher Safal Tokens", productCount: "4 products", aiModels: false, cta: "Choose Advanced", popular: true },
    { name: "Premium", price: "$9.99", period: "/month", tokens: "Premium Safal Tokens", productCount: "6 products", aiModels: true, cta: "Choose Premium", popular: false },
    { name: "Premium Plus", price: "$15.99", period: "/month", tokens: "Highest Safal Tokens", productCount: "All products", aiModels: true, cta: "Choose Premium Plus", popular: false },
  ];

  // Pricing comparison (SAI-LP-014)
  const comparisonRows = [
    { feature: "SAFAL-AI access", values: ["Yes", "Yes", "Yes", "Yes", "Yes"] },
    { feature: "Safal Tokens", values: ["Limited", "More", "Higher", "Premium", "Highest"] },
    { feature: "SafalVir product access", values: ["1 product", "2 products", "4 products", "6 products", "All products"] },
    { feature: "Prompt automation", values: ["Basic", "Yes", "Yes", "Advanced", "Advanced"] },
    { feature: "File upload", values: ["Limited", "Basic", "Advanced", "Advanced", "Advanced"] },
    { feature: "Multi-chat", values: ["Limited", "Yes", "Yes", "Yes", "Yes"] },
    { feature: "External AI models", values: ["No", "No", "No", "Yes", "Yes"] },
    { feature: "Bring your own API key", values: ["No", "No", "No", "Yes", "Yes"] },
    { feature: "Custom LLM support", values: ["No", "No", "No", "Limited", "Yes"] },
    { feature: "Priority support", values: ["No", "No", "No", "Yes", "Yes"] },
  ];
  const planNames = ["Free", "Basic", "Advanced", "Premium", "Premium Plus"];

  // Safal Token usage examples (SAI-LP-016)
  const tokenUsage = [
    { action: "Basic chat prompt", tokens: "1 token" },
    { action: "Prompt-based task", tokens: "2 tokens" },
    { action: "File upload and extraction", tokens: "5 tokens" },
    { action: "Report generation", tokens: "10 tokens" },
    { action: "Voice command", tokens: "3 tokens" },
    { action: "External AI model usage", tokens: "Based on model usage" },
    { action: "Advanced workflow", tokens: "Based on complexity" },
  ];

  // Top-up packs (SAI-LP-017) - Safal Tokens
  const topUpPacks = [
    { name: "Starter Top-Up", tokens: "100", price: "$1.99" },
    { name: "Growth Top-Up", tokens: "300", price: "$4.99" },
    { name: "Power Top-Up", tokens: "750", price: "$9.99" },
    { name: "Business Top-Up", tokens: "2,000", price: "$19.99" },
  ];

  // Security & trust (SAI-LP-020)
  const securityPoints = [
    { icon: Lock, title: "Secure Login", desc: "Encrypted authentication with OTP verification." },
    { icon: UserCheck, title: "Product-Level Authorization", desc: "Access is granted per product and plan." },
    { icon: Key, title: "API Key Security", desc: "Your API keys are encrypted and safe." },
    { icon: FileCheck, title: "Secure File Handling", desc: "Uploaded files are handled with care." },
    { icon: ShieldCheck, title: "Confirmation First", desc: "Important actions need your approval." },
    { icon: Coins, title: "Transparent Tokens", desc: "Clear Safal Token usage, no surprises." },
    { icon: Shield, title: "Permission-Based Access", desc: "Data is accessed only after permission." },
    { icon: Unplug, title: "Disconnect Anytime", desc: "Remove integrations whenever you want." },
  ];

  // FAQs (SAI-LP-021) - Safal Tokens
  const faqs = [
    { q: "What is SAFAL-AI?", a: "SAFAL-AI is a single AI platform that helps you complete tasks using prompts, voice commands, file uploads, and integrations. It works with SafalVir apps, external AI models, and custom LLMs." },
    { q: "Is SAFAL-AI only for SafalVir products?", a: "No. SAFAL-AI is a platform for many uses. It connects with SafalVir apps, but you can also connect external AI models and automate your own tasks and workflows." },
    { q: "Can I connect ChatGPT, Claude, Gemini, or other models?", a: "Yes. You can connect supported models through API keys. External AI model integration is available on Premium and Premium Plus plans." },
    { q: "Can I use my own API key?", a: "Yes. The Bring Your Own API Key feature lets you connect supported models securely. It is available on Premium and Premium Plus plans." },
    { q: "Which plans support external AI model integration?", a: "Only Premium and Premium Plus plans support external AI model integration and Bring Your Own API Key. Free, Basic, and Advanced plans do not include this." },
    { q: "What are Safal Tokens?", a: "Safal Tokens are usage units inside SAFAL-AI. Different AI actions use different numbers of Safal Tokens based on the task, files, model usage, and workflow complexity." },
    { q: "Can I buy more Safal Tokens?", a: "Yes. You can buy top-up packs anytime when your plan tokens are low or finished. Packs range from 100 tokens ($1.99) to 2,000 tokens ($19.99)." },
    { q: "Which SafalVir products are supported?", a: "SafalMyBuy, SafalIRDrainMate, SafalVendors, SafalCalendar, SafalSubscriptions, SafalReviews, SafalDrive, and SafalUtilities are launching soon. Product access depends on your plan." },
    { q: "Is my data secure?", a: "Yes. SAFAL-AI uses secure login, OTP verification, product-level authorization, and encrypted API key storage. Important actions always need your confirmation." },
    { q: "Can I upgrade my plan later?", a: "Yes. You can upgrade or change your plan anytime from your account to unlock more products, Safal Tokens, and AI model integrations." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header (SAI-LP-001) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-purple-500 text-white">
                <Sparkles size={16} />
              </span>
              SAFAL-AI
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-green-600 py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                <Link href="/auth/login" className="text-sm text-gray-700 hover:text-green-600 py-2">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section (SAI-LP-003, SAI-LP-004) */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-purple-50 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                <Sparkles size={14} className="text-green-600" /> One platform, endless possibilities
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Single AI Platform for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                  Everything
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Connect AI models, integrate applications, upload files, and complete tasks through simple prompts.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                SAFAL-AI helps you automate manual work across SafalVir products, external AI models, files, and workflows from one simple platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors"
                >
                  View Pricing
                </a>
                <a
                  href="#ai-models"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors"
                >
                  <Plug size={18} /> Connect AI Model
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400">SAFAL-AI Chat</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      Hi! Connect a model, upload a file, or type a prompt. What would you like to do?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-green-600 text-white rounded-lg p-3 text-sm">
                      Summarize this report and create a task list
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      Done! I summarized the report and created 5 tasks. Want me to save them?
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <input
                    type="text"
                    placeholder="Type your prompt..."
                    aria-label="Prompt preview"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-500"
                    readOnly
                  />
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Send size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Floating model badges */}
              <div className="absolute -top-3 -right-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" /> ChatGPT
              </div>
              <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" /> Claude
              </div>
              <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Gemini
              </div>
              <div className="absolute -bottom-2 left-4 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100">
                File Understood
              </div>
              <div className="absolute -bottom-2 right-12 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100">
                Task Completed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is SAFAL-AI Section (SAI-LP-005) */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is SAFAL-AI?</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            SAFAL-AI is a smart AI platform that helps you complete tasks using prompts, voice commands, file uploads, and integrations. It works with SafalVir applications, external AI models, custom LLMs, and other business tools.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {benefitCards.map((card) => (
              <div key={card.title} className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <card.icon size={22} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section (SAI-LP-006) */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate tasks, connect AI models, and manage work from one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-green-100 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Section (SAI-LP-007, SAI-LP-008) */}
      <section id="ai-models" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Model Integrations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use your preferred AI model. Connect supported models through API keys and run your work from one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {aiModels.map((model) => (
              <div
                key={model.name}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${model.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <Bot size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 mb-3">
              <Key size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Bring Your Own API Key</h3>
            <p className="text-sm text-gray-600">
              Bring your own API key and connect supported AI models securely. Your keys are stored safely and you stay in control of connected models.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
              <Key size={16} />
              <span>Available on Premium and Premium Plus plans only</span>
            </div>
          </div>
        </div>
      </section>

      {/* SafalVir Products Section (SAI-LP-009, SAI-LP-010) */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SafalVir Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect and manage SafalVir applications through SAFAL-AI. Product access depends on your plan.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-3 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold">{product.name}</h3>
              </div>
            ))}
          </div>

          {/* Product access by plan (SAI-LP-010) */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-6">Product Access by Plan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { plan: "Free", count: "1 product" },
                { plan: "Basic", count: "2 products" },
                { plan: "Advanced", count: "4 products" },
                { plan: "Premium", count: "6 products" },
                { plan: "Premium Plus", count: "All products" },
              ].map((item) => (
                <div key={item.plan} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold">{item.plan}</p>
                  <p className="text-sm text-green-600 mt-1">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (SAI-LP-011) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started. We always review and confirm before important actions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section (SAI-LP-012) */}
      <section id="use-cases" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real ways SAFAL-AI helps with business and personal work every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                  <item.icon size={20} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (SAI-LP-013) */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more products, Safal Tokens, AI model integrations, and automation power.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl p-6 border ${
                  plan.popular ? "border-green-500 shadow-lg" : "border-gray-100"
                } hover:shadow-lg transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500"> {plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    {plan.tokens}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    {plan.productCount}
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.aiModels ? (
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={plan.aiModels ? "" : "text-gray-400"}>AI Model Integration</span>
                  </li>
                </ul>
                <Link
                  href="/auth/register"
                  className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                    plan.popular
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing Comparison (SAI-LP-014) */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-center mb-6">Compare Plans</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left font-medium text-gray-700 px-4 py-3">Feature</th>
                    {planNames.map((name) => (
                      <th key={name} className="text-center font-medium text-gray-700 px-4 py-3">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-50">
                      <td className="text-gray-600 px-4 py-3 font-medium">{row.feature}</td>
                      {row.values.map((value, i) => (
                        <td key={i} className="text-center px-4 py-3">
                          {value === "Yes" ? (
                            <CheckCircle size={16} className="text-green-600 inline" />
                          ) : value === "No" ? (
                            <X size={16} className="text-gray-300 inline" />
                          ) : (
                            <span className="text-gray-700">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              External AI model integration and Bring Your Own API Key are available on Premium and Premium Plus only.
            </p>
          </div>
        </div>
      </section>

      {/* Safal Tokens Section (SAI-LP-015, SAI-LP-016, SAI-LP-017) */}
      <section id="tokens" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Coins size={28} className="text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Safal Tokens</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Safal Tokens are usage units inside SAFAL-AI. Different AI actions use different numbers of tokens based on the task, file processing, model usage, and workflow complexity.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Token usage examples */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Example Token Usage</h3>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">AI Action</th>
                      <th className="text-right text-sm font-medium text-gray-700 px-4 py-3">Safal Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenUsage.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-50">
                        <td className="text-sm text-gray-600 px-4 py-3">{item.action}</td>
                        <td className="text-sm text-gray-800 font-medium text-right px-4 py-3">{item.tokens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                These values are examples only. Actual Safal Token usage may vary by task.
              </p>
            </div>

            {/* Top-up packs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top-Up Packs</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {topUpPacks.map((pack) => (
                  <div
                    key={pack.name}
                    className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                      <Coins size={20} className="text-green-600" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{pack.name}</h4>
                    <p className="text-2xl font-bold text-green-600">{pack.tokens}</p>
                    <p className="text-xs text-gray-500 mb-2">Safal Tokens</p>
                    <p className="text-lg font-semibold">{pack.price}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Top-ups are optional and used when your plan tokens are low or finished. Sign in to buy top-ups.
              </p>
              <Link
                href="/auth/register"
                className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section (SAI-LP-020) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security &amp; Trust</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You stay in control. SAFAL-AI asks for confirmation before important actions and connects to products or models only with your permission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <point.icon size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section (SAI-LP-021) */}
      <section id="faqs" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions about SAFAL-AI.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-medium text-sm sm:text-base pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section (SAI-LP-022) */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact &amp; Support</h2>
            <p className="text-gray-600">Have questions? Send us a message and our team will get back to you.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">support@safal-ai.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">+1 (555) 010-2025</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form
              className="lg:col-span-2 space-y-4 bg-white border border-gray-100 rounded-xl p-6"
              onSubmit={(e) => {
                e.preventDefault();
                setContactSent(true);
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Tell us more..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Send Message
              </button>
              {contactSent && (
                <p className="text-sm text-green-600 text-center" role="status">
                  Thanks! Your message has been received. We will get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer (SAI-LP-023) */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">SAFAL-AI</h4>
              <p className="text-sm leading-relaxed">
                Single AI Platform for Everything. Connect AI models, use SafalVir products, upload files, and automate tasks through simple prompts.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">SafalVir Products</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#ai-models" className="hover:text-white transition-colors">AI Models</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About SAFAL-AI</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms and Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SAFAL-AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
