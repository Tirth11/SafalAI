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
  GitBranch,
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
  CreditCard,
  Unplug,
  Sparkles,
  FileText,
  Search,
  Briefcase,
  Mail,
  Phone,
  Plug,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Products", href: "#products" },
    { label: "AI Models", href: "#ai-models" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ];

  const features = [
    { icon: MessageSquare, title: "AI Chat Workspace", desc: "One workspace to chat, prompt, and complete tasks." },
    { icon: Zap, title: "Prompt-Based Automation", desc: "Type what you want and let AI handle the work." },
    { icon: Globe, title: "Connect AI Models", desc: "Plug in ChatGPT, Claude, Gemini, and more." },
    { icon: Key, title: "Bring Your Own API Key", desc: "Use your own keys, securely stored." },
    { icon: Package, title: "SafalVir App Integration", desc: "Connect SafalVir apps in one place." },
    { icon: Upload, title: "File Upload & Understanding", desc: "Upload PDFs, images, or docs and extract info." },
    { icon: Mic, title: "Voice Commands", desc: "Speak your prompt instead of typing." },
    { icon: GitBranch, title: "Workflow Automation", desc: "Build flows for repeating tasks." },
    { icon: Layers, title: "Multi-Chat Support", desc: "Run multiple chats side by side." },
    { icon: Coins, title: "Safal Tokens", desc: "Transparent usage with simple token tracking." },
    { icon: BarChart3, title: "Reports & Insights", desc: "Generate clear summaries and reports." },
    { icon: Shield, title: "Secure Authorization", desc: "Confirmation-first design for safe actions." },
  ];

  // All SafalVir products are "Launching Soon" — names only, no descriptions.
  const products = [
    "SafalMyBuy",
    "SafalIRDrainMate",
    "SafalVendors",
    "SafalCalendar",
    "SafalSubscriptions",
    "SafalReviews",
    "SafalDrive",
    "SafalUtilities",
  ];

  const aiModels = [
    { name: "ChatGPT", color: "bg-green-500", desc: "OpenAI GPT models" },
    { name: "Claude", color: "bg-purple-500", desc: "Anthropic Claude models" },
    { name: "Gemini", color: "bg-blue-500", desc: "Google Gemini models" },
    { name: "Custom LLMs", color: "bg-orange-500", desc: "Your own or other supported LLMs" },
  ];

  const howItWorks = [
    { step: "1", title: "Sign Up", desc: "Create your free SAFAL-AI account." },
    { step: "2", title: "Choose Product", desc: "Pick a SafalVir product to work with." },
    { step: "3", title: "Connect Model", desc: "Add your AI model if your plan allows." },
    { step: "4", title: "Prompt or Upload", desc: "Type a prompt or upload a file." },
    { step: "5", title: "Review", desc: "Check the AI result before moving on." },
    { step: "6", title: "Confirm", desc: "Approve and complete the task." },
  ];

  const useCases = [
    { icon: Zap, title: "Automate Tasks", desc: "Cut manual work with simple prompts." },
    { icon: Upload, title: "Upload Files", desc: "Extract details from docs, receipts, PDFs." },
    { icon: BarChart3, title: "Generate Reports", desc: "Get clean summaries in seconds." },
    { icon: Plug, title: "Connect AI Models", desc: "Use your preferred model in one place." },
    { icon: Package, title: "Use SafalVir Apps", desc: "Drive SafalVir products from chat." },
    { icon: FileText, title: "Summarize Documents", desc: "Long files turned into short notes." },
    { icon: Search, title: "Search Past Records", desc: "Find old data with one prompt." },
    { icon: Briefcase, title: "Manage Workflows", desc: "Run business workflows from one screen." },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      tokens: "Limited Safal Tokens",
      productCount: "1 product",
      aiModels: false,
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Basic",
      price: "$5.99",
      period: "/month",
      tokens: "More Safal Tokens",
      productCount: "2 products",
      aiModels: false,
      cta: "Choose Basic",
      popular: false,
    },
    {
      name: "Advanced",
      price: "$7.99",
      period: "/month",
      tokens: "Higher Safal Tokens",
      productCount: "4 products",
      aiModels: false,
      cta: "Choose Advanced",
      popular: true,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      tokens: "Premium Safal Tokens",
      productCount: "6 products",
      aiModels: true,
      cta: "Choose Premium",
      popular: false,
    },
    {
      name: "Premium Plus",
      price: "$15.99",
      period: "/month",
      tokens: "Highest Safal Tokens",
      productCount: "All products",
      aiModels: true,
      cta: "Choose Premium Plus",
      popular: false,
    },
  ];

  const compareRows: { feature: string; values: (string | boolean)[] }[] = [
    { feature: "SAFAL-AI access", values: [true, true, true, true, true] },
    { feature: "Safal Tokens", values: ["Limited", "More", "Higher", "Premium", "Highest"] },
    { feature: "SafalVir product access", values: ["1 product", "2 products", "4 products", "6 products", "All products"] },
    { feature: "Prompt automation", values: ["Basic", "Yes", "Yes", "Advanced", "Advanced"] },
    { feature: "File upload", values: ["Limited", "Basic", "Advanced", "Advanced", "Advanced"] },
    { feature: "Multi-chat", values: ["Limited", "Yes", "Yes", "Yes", "Yes"] },
    { feature: "External AI models", values: [false, false, false, true, true] },
    { feature: "Bring your own API key", values: [false, false, false, true, true] },
    { feature: "Custom LLM support", values: [false, false, false, "Limited", "Yes"] },
    { feature: "Priority support", values: [false, false, false, true, true] },
  ];

  const topUpPacks = [
    { name: "Starter Top-Up", tokens: "100", price: "$1.99" },
    { name: "Growth Top-Up", tokens: "300", price: "$4.99" },
    { name: "Power Top-Up", tokens: "750", price: "$9.99" },
    { name: "Business Top-Up", tokens: "2,000", price: "$19.99" },
  ];

  const tokenUsage = [
    { action: "Basic chat prompt", tokens: "1 token" },
    { action: "Prompt-based task", tokens: "2 tokens" },
    { action: "File upload and extraction", tokens: "5 tokens" },
    { action: "Report generation", tokens: "10 tokens" },
    { action: "Voice command", tokens: "3 tokens" },
    { action: "External AI model usage", tokens: "Based on model usage" },
    { action: "Advanced workflow", tokens: "Based on complexity" },
  ];

  const faqs = [
    {
      q: "What is SAFAL-AI?",
      a: "SAFAL-AI is a single AI platform that helps you complete tasks through prompts, voice commands, file uploads, and integrations. It works with SafalVir applications, external AI models, and custom LLMs.",
    },
    {
      q: "Is SAFAL-AI only for SafalVir products?",
      a: "No. SAFAL-AI is a generic AI platform. You can also connect external AI models like ChatGPT, Claude, and Gemini, upload files, and run prompt-based tasks for any business or personal workflow.",
    },
    {
      q: "Can I connect ChatGPT, Claude, Gemini, or other models?",
      a: "Yes. External AI model integration is available on Premium and Premium Plus plans. You can connect supported models using your own API keys.",
    },
    {
      q: "Can I use my own API key?",
      a: "Yes. The Bring Your Own API Key feature is available on Premium and Premium Plus plans. Your keys are stored securely and you stay in control.",
    },
    {
      q: "Which plans support external AI model integration?",
      a: "Only Premium ($9.99/month) and Premium Plus ($15.99/month) support external AI models and Bring Your Own API Key. Free, Basic, and Advanced plans do not include this.",
    },
    {
      q: "What are Safal Tokens?",
      a: "Safal Tokens are usage units inside SAFAL-AI. Different AI actions use different amounts of tokens depending on task type, file size, model usage, and workflow complexity.",
    },
    {
      q: "Can I buy more Safal Tokens?",
      a: "Yes. You can buy top-up packs whenever your plan tokens are low. Packs range from 100 tokens ($1.99) to 2,000 tokens ($19.99).",
    },
    {
      q: "Which SafalVir products are supported?",
      a: "All SafalVir products are launching soon, including SafalMyBuy, SafalIRDrainMate, SafalVendors, SafalCalendar, SafalSubscriptions, SafalReviews, SafalDrive, and SafalUtilities.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. SAFAL-AI uses secure login, OTP verification, product-level authorization, and encrypted API key storage. Important actions always need your confirmation.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Yes. You can upgrade, downgrade, or cancel any time from your account settings.",
    },
  ];

  const securityPoints = [
    { icon: Lock, title: "Secure Login", desc: "Encrypted login with OTP verification." },
    { icon: UserCheck, title: "User Confirmation", desc: "Important actions always need your approval." },
    { icon: Key, title: "API Key Security", desc: "Your keys are encrypted and stored safely." },
    { icon: FileCheck, title: "Secure File Handling", desc: "Files are handled with strict security." },
    { icon: CreditCard, title: "Transparent Tokens", desc: "Clear Safal Token tracking, no surprises." },
    { icon: Unplug, title: "Disconnect Anytime", desc: "Remove integrations whenever you want." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-purple-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SAFAL-AI</span>
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
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-700 hover:text-green-600 py-2"
                >
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

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-purple-50 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 mb-6">
                <Sparkles size={12} className="text-green-600" />
                <span>Single AI Platform for Everything</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Single AI Platform for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                  Everything
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Connect AI models, integrate applications, upload files, and complete tasks through simple prompts — all inside SAFAL-AI.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Automate manual work across SafalVir products, external AI models, files, and business workflows from one simple platform.
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
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-purple-600 hover:text-purple-600 transition-colors"
                >
                  <Plug size={16} /> Connect AI Model
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400">SAFAL-AI Workspace</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      Hi! Connect a model, pick a SafalVir product, or upload a file to get started.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-green-600 text-white rounded-lg p-3 text-sm">
                      Summarize this PDF and create a report
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      Done. Summary ready. Want me to save it as a report?
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <input
                    type="text"
                    placeholder="Type your prompt..."
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
                <div className="w-2 h-2 rounded-full bg-green-500" />
                ChatGPT
              </div>
              <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Claude
              </div>
              <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Gemini
              </div>
              {/* Floating data cards */}
              <div className="absolute -bottom-2 left-4 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <FileText size={12} className="text-green-600" /> File Processed
              </div>
              <div className="absolute -bottom-2 right-12 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                <BarChart3 size={12} className="text-purple-600" /> Report Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is SAFAL-AI Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is SAFAL-AI?</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            SAFAL-AI is a smart AI platform that helps you complete tasks using prompts, voice commands, file uploads, and integrations. It works with SafalVir applications, external AI models, custom LLMs, and other business tools.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: MessageSquare, title: "Type a prompt" },
              { icon: Upload, title: "Upload a file" },
              { icon: Plug, title: "Connect your AI model" },
              { icon: Zap, title: "Complete tasks faster" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                  <item.icon size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate work, connect AI models, and run tasks from one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-green-100 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                  <feature.icon size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="ai-models" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Use Your Preferred AI Model</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect supported models through API keys and run your work from one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {aiModels.map((model) => (
              <div
                key={model.name}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 ${model.color} rounded-full mx-auto mb-3 flex items-center justify-center`}
                >
                  <Bot size={22} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
              <Key size={16} />
              <span>Bring Your Own API Key — Premium and Premium Plus only</span>
            </div>
          </div>
        </div>
      </section>

      {/* SafalVir Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">SafalVir Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SAFAL-AI connects with SafalVir applications. Product access depends on your plan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((name) => (
              <div
                key={name}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                    <Package size={18} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                  Launching Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six simple steps to start using SAFAL-AI.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-gray-100 rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Common Use Cases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real ways SAFAL-AI can help you save time every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                  <uc.icon size={20} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{uc.title}</h3>
                <p className="text-sm text-gray-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Pricing Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade for more SafalVir products, Safal Tokens, AI model integrations, and automation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl p-6 border ${
                  plan.popular ? "border-green-500 shadow-md" : "border-gray-100"
                } hover:shadow-md transition-all flex flex-col`}
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
                <ul className="space-y-2 mb-6 text-sm text-gray-600 flex-1">
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
                    <span className={plan.aiModels ? "" : "text-gray-400"}>
                      External AI Models
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.aiModels ? (
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={plan.aiModels ? "" : "text-gray-400"}>
                      Bring Your Own API Key
                    </span>
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

          {/* Comparison Table */}
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-semibold text-center mb-6">
              Compare Plans
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="font-medium text-gray-700 px-4 py-3">Feature</th>
                    {pricingPlans.map((p) => (
                      <th key={p.name} className="font-medium text-gray-700 px-4 py-3">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.feature} className="border-t border-gray-50">
                      <td className="text-gray-700 font-medium px-4 py-3">
                        {row.feature}
                      </td>
                      {row.values.map((v, idx) => (
                        <td key={idx} className="px-4 py-3 text-gray-600">
                          {typeof v === "boolean" ? (
                            v ? (
                              <CheckCircle size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-300" />
                            )
                          ) : (
                            v
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Safal Tokens Section */}
      <section id="safal-tokens" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Coins size={24} className="text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Safal Tokens & Top-Ups</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Safal Tokens are usage units inside SAFAL-AI. Different AI actions use different amounts based on task, file, model, and complexity.
            </p>
          </div>

          {/* Top-up packs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {topUpPacks.map((pack) => (
              <div
                key={pack.name}
                className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <Coins size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">{pack.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">{pack.tokens}</p>
                <p className="text-xs text-gray-500 mb-3">Safal Tokens</p>
                <p className="text-lg font-semibold text-gray-900">{pack.price}</p>
              </div>
            ))}
          </div>

          {/* Token usage examples */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-2">Example Token Usage</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              These are examples. Actual usage may vary by task.
            </p>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">
                      AI Action
                    </th>
                    <th className="text-right text-sm font-medium text-gray-700 px-4 py-3">
                      Safal Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokenUsage.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-50">
                      <td className="text-sm text-gray-600 px-4 py-3">{item.action}</td>
                      <td className="text-sm text-gray-800 font-medium text-right px-4 py-3">
                        {item.tokens}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Security & Trust</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You stay in control. SAFAL-AI asks for confirmation before important actions and connects to products or models only with your permission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {securityPoints.map((point) => (
              <div
                key={point.title}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <point.icon size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">FAQs</h2>
            <p className="text-gray-600">Quick answers to common questions about SAFAL-AI.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden"
              >
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

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? Send us a message and our team will get back to you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Email</h3>
                  <p className="text-sm text-gray-600">support@safal-ai.com</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Phone</h3>
                  <p className="text-sm text-gray-600">Available after sign in</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 space-y-4"
              onSubmit={(e) => e.preventDefault()}
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
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
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
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Start with SAFAL-AI today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start free and upgrade when you need more SafalVir products, Safal Tokens, AI model integrations, and automation power.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-purple-500 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-base font-bold text-gray-900">SAFAL-AI</span>
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed">
                Single AI platform for everything. Connect models, integrate apps, and run tasks through simple prompts.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-green-600 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-green-600 transition-colors">Pricing</a></li>
                <li><a href="#ai-models" className="hover:text-green-600 transition-colors">AI Models</a></li>
                <li><a href="#products" className="hover:text-green-600 transition-colors">SafalVir Products</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600 transition-colors">About SAFAL-AI</a></li>
                <li><a href="#contact" className="hover:text-green-600 transition-colors">Contact</a></li>
                <li><a href="#faqs" className="hover:text-green-600 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Terms and Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/auth/login" className="hover:text-green-600 transition-colors">Login</Link></li>
                <li><Link href="/auth/register" className="hover:text-green-600 transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} SAFAL-AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
