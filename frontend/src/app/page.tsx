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
  Bell,
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
    { icon: MessageSquare, title: "AI Chat", desc: "Intelligent chat interface to complete tasks through simple prompts" },
    { icon: Zap, title: "Prompt Automation", desc: "Automate manual tasks like adding expenses, receipts, and records with prompts" },
    { icon: Globe, title: "External AI Models", desc: "Connect ChatGPT, Claude, Gemini, and other LLMs from one platform" },
    { icon: Key, title: "Bring Your Own API Key", desc: "Use your own API keys for supported AI models (Premium plans)" },
    { icon: Package, title: "SafalVir Integration", desc: "Connect and manage all SafalVir products from a single AI workspace" },
    { icon: Upload, title: "File Upload", desc: "Upload documents, receipts, and files for AI-powered extraction" },
    { icon: Mic, title: "Voice Commands", desc: "Give voice-based commands to complete tasks hands-free" },
    { icon: GitBranch, title: "Workflow Automation", desc: "Build automated workflows for repetitive tasks and processes" },
    { icon: Layers, title: "Multi-Chat", desc: "Run multiple AI conversations simultaneously for different tasks" },
    { icon: Coins, title: "Credit-Based Usage", desc: "Transparent credit system so you only pay for what you use" },
    { icon: BarChart3, title: "Reports & Analytics", desc: "Generate detailed reports and analytics across all connected products" },
    { icon: Bell, title: "Notifications", desc: "Smart reminders and notifications to keep you organized" },
  ];


  const products = [
    { name: "SafalMyBuy", status: "Active", desc: "Track purchases, expenses, and warranties" },
    { name: "SafalIRDrainMate", status: "Launching Soon", desc: "Irrigation and drainage management" },
    { name: "SafalVendors", status: "Launching Soon", desc: "Vendor and supplier management" },
    { name: "SafalCalendar", status: "Launching Soon", desc: "Events, reminders, and scheduling" },
    { name: "SafalSubscriptions", status: "Launching Soon", desc: "Manage recurring subscriptions" },
    { name: "SafalReviews", status: "Launching Soon", desc: "Reviews and feedback collection" },
    { name: "SafalDrive", status: "Launching Soon", desc: "Cloud storage and file management" },
    { name: "SafalUtilities", status: "Launching Soon", desc: "Utility bill tracking and reminders" },
  ];

  const pricingPlans = [
    { name: "Free", price: "$0", period: "forever", credits: "50 credits/mo", productCount: "1 product", aiModels: false, cta: "Start Free", popular: false },
    { name: "Basic", price: "$5.99", period: "/month", credits: "200 credits/mo", productCount: "2 products", aiModels: false, cta: "Choose Basic", popular: false },
    { name: "Advanced", price: "$7.99", period: "/month", credits: "500 credits/mo", productCount: "4 products", aiModels: false, cta: "Choose Advanced", popular: true },
    { name: "Premium", price: "$9.99", period: "/month", credits: "1,000 credits/mo", productCount: "6 products", aiModels: true, cta: "Choose Premium", popular: false },
    { name: "Premium Plus", price: "$15.99", period: "/month", credits: "2,500 credits/mo", productCount: "All products", aiModels: true, cta: "Choose Premium Plus", popular: false },
  ];


  const topUpPacks = [
    { name: "Starter", credits: "100", price: "$1.99" },
    { name: "Growth", credits: "300", price: "$4.99" },
    { name: "Power", credits: "750", price: "$9.99" },
    { name: "Business", credits: "2,000", price: "$19.99" },
  ];

  const creditUsage = [
    { action: "Basic chat prompt", credits: "1 credit" },
    { action: "Prompt-based task execution", credits: "2 credits" },
    { action: "File upload and extraction", credits: "5 credits" },
    { action: "Report generation", credits: "10 credits" },
    { action: "Voice command", credits: "3 credits" },
    { action: "External AI model usage", credits: "Based on model" },
    { action: "Advanced workflow automation", credits: "Based on complexity" },
  ];

  const faqs = [
    { q: "What is SAFAL-AI?", a: "SAFAL-AI is an AI-powered platform that helps users complete tasks through prompts, voice commands, file uploads, and integrations. It works with SafalVir products, external AI models, and custom LLMs." },
    { q: "Is SAFAL-AI only for SafalVir products?", a: "No. SAFAL-AI is a generic AI platform. While it integrates deeply with SafalVir products, you can also connect external AI models like ChatGPT, Claude, and Gemini for any task." },
    { q: "Can I connect ChatGPT, Claude, Gemini, or other models?", a: "Yes! Premium and Premium Plus plans support external AI model integration. You can connect supported models using your own API keys." },
    { q: "Can I use my own API key?", a: "Yes. The 'Bring Your Own API Key' feature is available on Premium and Premium Plus plans. Your API keys are securely stored and you remain in full control." },
    { q: "Which plans support external AI model integration?", a: "Only Premium ($9.99/month) and Premium Plus ($15.99/month) plans support external AI model integration and the Bring Your Own API Key feature." },
    { q: "What are AI credits?", a: "AI credits are units consumed when you perform AI actions like chat prompts, file uploads, report generation, and workflow automation. Each plan includes monthly credits." },
    { q: "Can I buy extra credits?", a: "Yes! You can purchase top-up credit packs anytime. Packs range from 100 credits ($1.99) to 2,000 credits ($19.99)." },
    { q: "Which SafalVir products are supported?", a: "Currently SafalMyBuy is active. SafalIRDrainMate, SafalVendors, SafalCalendar, SafalSubscriptions, SafalReviews, SafalDrive, and SafalUtilities are launching soon." },
    { q: "Is my data secure?", a: "Yes. SAFAL-AI uses secure login, OTP verification, product-level authorization, and encrypted API key storage. No important action is performed without your confirmation." },
    { q: "Can I cancel or upgrade my plan later?", a: "Yes. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Unused credits do not roll over to the next month." },
  ];


  const securityPoints = [
    { icon: Lock, title: "Secure Login", desc: "Encrypted authentication with OTP verification" },
    { icon: UserCheck, title: "User Confirmation", desc: "No important action without your explicit approval" },
    { icon: Key, title: "API Key Security", desc: "Your API keys are encrypted and securely stored" },
    { icon: FileCheck, title: "Secure File Handling", desc: "All uploaded files are handled with strict security" },
    { icon: CreditCard, title: "Transparent Usage", desc: "Clear credit tracking with no hidden charges" },
    { icon: Unplug, title: "Disconnect Anytime", desc: "Remove integrations and disconnect models whenever you want" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-green-600">
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
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-purple-50 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Single AI Platform for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                  Everything
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Manage tasks faster with AI-powered prompts. Add expenses, purchases, receipts, records, and business details directly into SafalVir apps — without manual effort.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Connect AI models, integrate applications, upload files, automate tasks, and complete work through simple prompts — all inside SAFAL-AI.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
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
                  Explore Pricing
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
                      Hello! I can help you add expenses, generate reports, or manage your products. What would you like to do?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-green-600 text-white rounded-lg p-3 text-sm">
                      Add expense $45.99 for groceries today
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-green-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      Done! Added $45.99 expense for groceries. Would you like to upload a receipt?
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <input type="text" placeholder="Type your prompt..." className="flex-1 text-sm bg-transparent outline-none text-gray-500" readOnly />
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Send size={14} className="text-white" />
                  </div>
                </div>
              </div>


              {/* Floating badges */}
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
              <div className="absolute -bottom-2 left-4 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100">
                📝 Expense Added
              </div>
              <div className="absolute -bottom-2 right-12 bg-white shadow-md rounded-lg px-3 py-1.5 text-xs font-medium border border-gray-100">
                🧾 Receipt Saved
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* What is SAFAL-AI Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What is SAFAL-AI?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            SAFAL-AI helps users complete manual tasks faster by using simple prompts. Users can add expenses, purchases, receipts, records, reminders, and business details directly into SafalVir applications without filling long forms.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            It makes daily work easier, faster, and more organized with the help of AI. Connect your preferred AI models using API keys and manage multiple workflows from one place.
          </p>
          <p className="text-sm text-gray-500">
            SAFAL-AI works with SafalVir products, external AI models like ChatGPT, Claude, and Gemini, custom LLMs, and third-party applications.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate tasks, connect AI models, and manage work from one intelligent platform.
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


      {/* AI Models Section */}
      <section id="ai-models" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Model Integrations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect your preferred AI models and use them seamlessly inside SAFAL-AI. Bring Your Own API Key is available on Premium and Premium Plus plans.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { name: "ChatGPT", color: "bg-green-500", desc: "OpenAI GPT models" },
              { name: "Claude", color: "bg-purple-500", desc: "Anthropic Claude models" },
              { name: "Gemini", color: "bg-blue-500", desc: "Google Gemini models" },
              { name: "Custom LLMs", color: "bg-orange-500", desc: "Your own or third-party LLMs" },
            ].map((model) => (
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
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
              <Key size={16} />
              <span>Bring Your Own API Key — Available on Premium and Premium Plus plans only</span>
            </div>
          </div>
        </div>
      </section>


      {/* SafalVir Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SafalVir Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect and manage SafalVir applications directly through SAFAL-AI. Product access depends on your subscription plan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Package size={20} className="text-green-600" />
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes. Simple steps to automate your workflow.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account and choose your plan" },
              { step: "2", title: "Connect", desc: "Link SafalVir products or connect your AI models" },
              { step: "3", title: "Prompt", desc: "Give a prompt, upload a file, or select an action" },
              { step: "4", title: "Done", desc: "SAFAL-AI completes the task — review and confirm" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-green-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more products, credits, model integrations, and automation power.
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
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    {plan.credits}
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
        </div>
      </section>


      {/* Top-Up Credit Packs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top-Up Credit Packs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need more credits? Buy top-up packs anytime when your monthly credits run low.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {topUpPacks.map((pack) => (
              <div
                key={pack.name}
                className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <Coins size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">{pack.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">{pack.credits}</p>
                <p className="text-xs text-gray-500 mb-3">credits</p>
                <p className="text-lg font-semibold">{pack.price}</p>
              </div>
            ))}
          </div>

          {/* Credit Usage Table */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-6">Credit Usage Guide</h3>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">AI Action</th>
                    <th className="text-right text-sm font-medium text-gray-700 px-4 py-3">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {creditUsage.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-50">
                      <td className="text-sm text-gray-600 px-4 py-3">{item.action}</td>
                      <td className="text-sm text-gray-800 font-medium text-right px-4 py-3">{item.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>


      {/* Security Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security & Trust</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your data and API keys are handled with the highest level of security. SAFAL-AI never performs important actions without your confirmation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section id="faqs" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
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
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? Send us a message and our team will get back to you.
            </p>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
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
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">SAFAL-AI</h4>
              <p className="text-sm leading-relaxed">
                Single AI Platform for Everything. Automate tasks, connect AI models, and manage work through simple prompts.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#ai-models" className="hover:text-white transition-colors">AI Models</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">SafalVir Products</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About SAFAL-AI</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
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
