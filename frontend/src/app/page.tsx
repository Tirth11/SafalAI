"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Calendar,
  HardDrive,
  CreditCard,
  Wrench,
  Star,
  Receipt,
  ClipboardList,
  PieChart,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const totalSlides = 5;
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCarouselIndex((index + totalSlides) % totalSlides);
  }, []);

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % totalSlides);
  }, []);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, []);

  useEffect(() => {
    if (carouselPaused) return;
    carouselTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [carouselPaused, nextSlide]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Products", href: "#products" },
    { label: "AI Models", href: "#ai-models" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ];

  // Four simple value cards
  const benefitCards = [
    { icon: Plug, title: "Connect AI Models", desc: "Use ChatGPT, Claude, Gemini, or your own LLM." },
    { icon: Package, title: "Use SafalVir Products", desc: "Connect SafalMyBuy and other SafalVir apps." },
    { icon: Upload, title: "Upload Files", desc: "Upload PDFs, receipts, documents, or images." },
    { icon: Zap, title: "Automate Tasks", desc: "Type a prompt and let Safal-AI prepare the action." },
  ];

  // Key features (SAI-LP-006)
  const features = [
    { icon: Package, title: "SafalVir Product Integration", desc: "Connect SafalVir products in one place." },
    { icon: Bot, title: "AI Agent Integration", desc: "Use specialized AI agents for different tasks." },
    { icon: Globe, title: "Custom LLM Models", desc: "Add your own custom language models." },
    { icon: Key, title: "External Model Support", desc: "Support for external models and APIs." },
    { icon: Upload, title: "File Upload and Understanding", desc: "Upload and let AI understand files." },
    { icon: Zap, title: "Prompt-Based Automation", desc: "Automate tasks using simple language." },
    { icon: MessageSquare, title: "Custom Chat", desc: "Chat directly with your own AI models." },
    { icon: Plug, title: "Integration Hub", desc: "Connect third-party APIs and tools." },
    { icon: Coins, title: "Safal Tokens", desc: "Transparent token usage for AI actions." },
    { icon: ShieldCheck, title: "Secure Access", desc: "Keep control before every action." },
  ];

  // AI models (SAI-LP-007)
  const aiModels = [
    { name: "ChatGPT", color: "bg-green-500", desc: "OpenAI GPT models" },
    { name: "Claude", color: "bg-purple-500", desc: "Anthropic Claude models" },
    { name: "Gemini", color: "bg-blue-500", desc: "Google Gemini models" },
    { name: "Custom LLMs", color: "bg-orange-500", desc: "Your custom large language models" },
    { name: "Private LLMs", color: "bg-red-500", desc: "Self-hosted private models" },
    { name: "Third-party AI agents", color: "bg-teal-500", desc: "External specialized AI agents" },
    { name: "API-based AI tools", color: "bg-indigo-500", desc: "Tools integrated via API" },
  ];

  // SafalVir products (SAI-LP-009) - show product names only
  const products = [
    { name: "SafalMyBuy", text: "Connect and use through SAFAL-AI" },
    { name: "SafalIRDrainMate", text: "Connect and use through SAFAL-AI" },
    { name: "SafalVendors", text: "Connect and use through SAFAL-AI" },
    { name: "SafalCalendar", text: "Connect and use through SAFAL-AI" },
    { name: "SafalSubscriptions", text: "Connect and use through SAFAL-AI" },
    { name: "SafalReviews", text: "Connect and use through SAFAL-AI" },
    { name: "SafalDrive", text: "Connect and use through SAFAL-AI" },
    { name: "SafalUtilities", text: "Connect and use through SAFAL-AI" },
  ];

  // How it works (SAI-LP-011)
  const steps = [
    { step: "1", title: "Sign In", desc: "Create your SAFAL-AI account or sign in securely." },
    { step: "2", title: "Connect Product or Model", desc: "Connect SafalVir products, AI agents, custom LLMs, or third-party APIs." },
    { step: "3", title: "Type a Prompt or Upload a File", desc: "Ask SAFAL-AI what you want to do." },
    { step: "4", title: "Review Token Usage", desc: "SAFAL-AI shows how many Safal Tokens may be used." },
    { step: "5", title: "Confirm or Modify", desc: "Confirm the prompt, modify it, or cancel." },
    { step: "6", title: "Get the Result", desc: "SAFAL-AI completes the task after confirmation." },
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
    { name: "Free", price: "$0", period: "forever", tokens: "Basic access", productCount: "Basic access", aiModels: false, cta: "Start Free", popular: false },
    { name: "Basic", price: "$5.99", period: "/month", tokens: "Simple AI usage", productCount: "Simple AI usage", aiModels: false, cta: "Choose Basic", popular: false },
    { name: "Advanced", price: "$7.99", period: "/month", tokens: "More automation", productCount: "More automation", aiModels: false, cta: "Choose Advanced", popular: true },
    { name: "Premium", price: "$9.99", period: "/month", tokens: "AI model integration", productCount: "AI model integration", aiModels: true, cta: "Choose Premium", popular: false },
    { name: "Premium Plus", price: "$15.99", period: "/month", tokens: "Full access and all models", productCount: "Full access", aiModels: true, cta: "Choose Premium Plus", popular: false },
  ];

  // Pricing comparison (SAI-LP-014)
  const comparisonRows = [
    { feature: "Safal-AI access", values: ["Yes", "Yes", "Yes", "Yes", "Yes"] },
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
    { name: "Starter", tokens: "100", price: "$1.99" },
    { name: "Growth", tokens: "300", price: "$4.99" },
    { name: "Power", tokens: "750", price: "$9.99" },
    { name: "Business", tokens: "2,000", price: "$19.99" },
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
    { q: "What is Safal-AI?", a: "Safal-AI is a single AI platform that helps you complete tasks using prompts, voice commands, file uploads, and integrations. It works with SafalVir apps, external AI models, and custom LLMs." },
    { q: "Is Safal-AI only for SafalVir products?", a: "No. Safal-AI is a platform for many uses. It connects with SafalVir apps, but you can also connect external AI models and automate your own tasks and workflows." },
    { q: "Can I connect ChatGPT, Claude, Gemini, or other models?", a: "Yes. You can connect supported models through API keys. External AI model integration is available on Premium and Premium Plus plans." },
    { q: "Can I use my own API key?", a: "Yes. The Bring Your Own API Key feature lets you connect supported models securely. It is available on Premium and Premium Plus plans." },
    { q: "Which plans support external AI model integration?", a: "Only Premium and Premium Plus plans support external AI model integration and Bring Your Own API Key. Free, Basic, and Advanced plans do not include this." },
    { q: "What are Safal Tokens?", a: "Safal Tokens are usage units inside Safal-AI. Different AI actions use different numbers of Safal Tokens based on the task, files, model usage, and workflow complexity." },
    { q: "Can I buy more Safal Tokens?", a: "Yes. You can buy top-up packs anytime when your plan tokens are low or finished. Packs range from 100 tokens ($1.99) to 2,000 tokens ($19.99)." },
    { q: "Which SafalVir products are supported?", a: "SafalMyBuy, SafalIRDrainMate, SafalVendors, SafalCalendar, SafalSubscriptions, SafalReviews, SafalDrive, and SafalUtilities are all supported. Product access depends on your plan." },
    { q: "Is my data secure?", a: "Yes. Safal-AI uses secure login, OTP verification, product-level authorization, and encrypted API key storage. Important actions always need your confirmation." },
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
              Safal-AI
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

      {/* Hero Carousel Section (SAI-LP-003, SAI-LP-004) */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-purple-50 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carousel container */}
          <div
            className="overflow-hidden relative group"
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
          >
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {/* ===== Slide 1: SafalVir Ecosystem ===== */}
              <div className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[420px]">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                      <Sparkles size={14} className="text-green-600" /> Connect SafalVir products, AI agents, custom LLM models, APIs, files, and workflows — all inside one intelligent workspace.
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      SAFAL-AI: One AI Platform for{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                        Smarter Work
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      SAFAL-AI helps users reduce manual work by turning prompts, uploads, and integrations into real actions. Users can connect SafalVir applications first, and then extend the platform with AI models like ChatGPT, Claude, Gemini, custom/private LLMs, and third-party APIs.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Get Started
                      </Link>
                      <a
                        href="#products"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Explore SAFAL-AI
                      </a>
                      <a
                        href="#ai-models"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Connect AI Model <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                  {/* Illustration: Central hub with radiating product cards */}
                  <div className="relative flex items-center justify-center min-h-[340px]">
                    {/* Central hub */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl flex items-center justify-center z-10">
                      <Sparkles size={28} className="text-white" />
                    </div>
                    {/* Radiating product cards */}
                    {[
                      { name: "SafalMyBuy", top: "5%", left: "10%", delay: "" },
                      { name: "SafalDrive", top: "0%", right: "15%", delay: "animate-float-slow" },
                      { name: "SafalCalendar", top: "35%", left: "-2%", delay: "animate-float-delay" },
                      { name: "SafalSubscriptions", top: "35%", right: "-2%", delay: "animate-float" },
                      { name: "SafalVendors", bottom: "15%", left: "8%", delay: "animate-float-slow" },
                      { name: "SafalReviews", bottom: "10%", right: "10%", delay: "animate-float-delay" },
                      { name: "SafalUtilities", bottom: "0%", left: "38%", delay: "animate-float" },
                    ].map((p) => (
                      <div
                        key={p.name}
                        className={`absolute bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2 ${p.delay}`}
                        style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom }}
                      >
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{p.name}</span>
                      </div>
                    ))}
                    {/* Subtle connection lines (circles) */}
                    <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-green-200 opacity-40" />
                    <div className="absolute w-72 h-72 rounded-full border border-dashed border-purple-200 opacity-30" />
                  </div>
                </div>
              </div>

              {/* ===== Slide 2: SAFAL-AI ===== */}
              <div className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[420px]">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                      <Sparkles size={14} className="text-purple-600" /> Powered by AI
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Work with SafalVir{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                        Products Through AI
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      Connect AI models, SafalVir apps, files, APIs, and workflows — and complete tasks through simple prompts.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Start with SAFAL-AI <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                  {/* Illustration: Chat UI mockup with floating badges */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="ml-2 text-xs text-gray-400">Safal-AI Chat</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-green-600" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                            Hi! Connect a model, upload a file, or type a prompt.
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
                            Done! Report summarized and 5 tasks created.
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                        <input type="text" placeholder="Type your prompt..." aria-label="Prompt preview" className="flex-1 text-sm bg-transparent outline-none text-gray-500" readOnly />
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <Send size={14} className="text-white" />
                        </div>
                      </div>
                    </div>
                    {/* Floating badges */}
                    <div className="absolute -top-3 -right-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5 animate-float">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> AI Models
                    </div>
                    <div className="absolute top-1/4 -left-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5 animate-float-slow">
                      <Upload size={12} className="text-purple-500" /> Files
                    </div>
                    <div className="absolute bottom-1/4 -right-4 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-medium border border-gray-100 flex items-center gap-1.5 animate-float-delay">
                      <Unplug size={12} className="text-blue-500" /> APIs
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Slide 3: SafalMyBuy ===== */}
              <div className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[420px]">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                      <Sparkles size={14} className="text-green-600" /> SafalMyBuy
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Use the AI Model That{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                        Fits Your Task
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      Connect SafalMyBuy with SAFAL-AI to manage expenses, purchase items, receipts, warranties, budgets, events, and reports through chat.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/chat?product=safalmybuy"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Connect SafalMyBuy <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                  {/* Illustration: Dashboard-style cards */}
                  <div className="relative flex items-center justify-center min-h-[340px]">
                    {/* Expense card */}
                    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-48 animate-float">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <CreditCard size={16} className="text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Expenses</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Groceries</span><span className="font-medium text-gray-700">$84.50</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Software</span><span className="font-medium text-gray-700">$29.99</span></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Travel</span><span className="font-medium text-gray-700">$156.00</span></div>
                      </div>
                    </div>
                    {/* Receipt card */}
                    <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-40 animate-float-slow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Receipt size={16} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Receipts</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-gray-100 rounded-full w-full" />
                        <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                        <div className="h-2 bg-green-100 rounded-full w-1/2" />
                      </div>
                    </div>
                    {/* Report chart card */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-56 animate-float-delay">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <PieChart size={16} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Monthly Report</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-12">
                        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Slide 4: Coming Soon Products ===== */}
              <div className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[420px]">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                      <Sparkles size={14} className="text-purple-600" /> Coming Soon
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Type a Prompt. Review.{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                        Confirm. Done.
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      SafalVir products are designed to simplify daily work by bringing important records, reminders, subscriptions, files, and tools into one connected experience.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="#products"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        View Coming Soon Products <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                  {/* Illustration: 2x2 product grid */}
                  <div className="relative flex items-center justify-center min-h-[340px]">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      {[
                        { name: "SafalDrive", icon: HardDrive, color: "bg-blue-50", iconColor: "text-blue-600", anim: "animate-float" },
                        { name: "SafalCalendar", icon: Calendar, color: "bg-green-50", iconColor: "text-green-600", anim: "animate-float-slow" },
                        { name: "SafalSubscriptions", icon: CreditCard, color: "bg-purple-50", iconColor: "text-purple-600", anim: "animate-float-delay" },
                        { name: "SafalUtilities", icon: Wrench, color: "bg-orange-50", iconColor: "text-orange-600", anim: "animate-float" },
                      ].map((product) => (
                        <div key={product.name} className={`bg-white rounded-xl shadow-lg border border-gray-100 p-5 text-center ${product.anim}`}>
                          <div className={`w-12 h-12 rounded-xl ${product.color} flex items-center justify-center mx-auto mb-3`}>
                            <product.icon size={22} className={product.iconColor} />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">{product.name}</h3>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                            Coming Soon
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Slide 5: AI Model Integration ===== */}
              <div className="w-full flex-shrink-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[420px]">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                      <Sparkles size={14} className="text-green-600" /> AI Models
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Upload Files and Let{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                        AI Understand Them
                      </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      Use ChatGPT, Claude, Gemini, custom LLMs, and third-party APIs inside SAFAL-AI to create one unified automation workspace.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="#ai-models"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <Plug size={18} /> Connect AI Model
                      </a>
                    </div>
                  </div>
                  {/* Illustration: Floating model cards connected to central node */}
                  <div className="relative flex items-center justify-center min-h-[340px]">
                    {/* Central SAFAL-AI node */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-purple-500 shadow-xl flex items-center justify-center z-10">
                      <Bot size={28} className="text-white" />
                    </div>
                    {/* Connection orbit rings */}
                    <div className="absolute w-48 h-48 rounded-full border-2 border-dashed border-green-200 opacity-30" />
                    <div className="absolute w-80 h-80 rounded-full border border-dashed border-purple-200 opacity-20" />
                    {/* Model cards */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2 animate-float">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><Bot size={12} className="text-white" /></div>
                      <span className="text-xs font-semibold text-gray-700">ChatGPT</span>
                    </div>
                    <div className="absolute top-1/3 -left-2 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2 animate-float-slow">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"><Bot size={12} className="text-white" /></div>
                      <span className="text-xs font-semibold text-gray-700">Claude</span>
                    </div>
                    <div className="absolute top-1/3 -right-2 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2 animate-float-delay">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"><Bot size={12} className="text-white" /></div>
                      <span className="text-xs font-semibold text-gray-700">Gemini</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2 animate-float">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"><Bot size={12} className="text-white" /></div>
                      <span className="text-xs font-semibold text-gray-700">Custom LLM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  carouselIndex === i
                    ? "w-8 h-2.5 bg-green-600"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What is Safal-AI Section (SAI-LP-005) */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is SAFAL-AI?</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            SAFAL-AI is an intelligent AI platform that helps users complete work through prompts, file uploads, AI agents, APIs, and connected applications. Instead of switching between many tools, users can work from one place. They can connect SafalVir products, add their own AI models, upload files, automate tasks, and manage workflows using simple language.
          </p>
          <div className="mt-6 inline-block bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-green-700">SAFAL-AI helps users connect products, models, files, and APIs into one AI workspace to complete tasks faster.</p>
          </div>
        </div>
      </section>

      {/* Key Features Section (SAI-LP-006) */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One AI Workspace</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect AI Agents and Models</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SAFAL-AI allows users to connect their preferred AI agents and LLM models. Users can add API keys and use different models for different types of work. Use the right AI model for the right task from one platform.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connected SafalVir Applications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SafalVir products are part of the SAFAL-AI ecosystem. Users can connect these applications and perform product-specific actions through SAFAL-AI after authentication.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.text}</p>
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

      {/* Why SAFAL-AI Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use SAFAL-AI?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Most users work across many tools, files, apps, and AI platforms. This creates repeated work, manual entry, and wasted time. SAFAL-AI solves this by creating one smart workspace where users can type what they want, select a model or product, review the result, and complete the task.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-purple-50 border border-green-100 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                {[
                  "Reduce manual work",
                  "Connect SafalVir products in one place",
                  "Use AI agents and custom LLM models",
                  "Upload and understand files",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    {line}
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {[
                  "Automate daily and business tasks",
                  "Keep control before every important action",
                  "Use Safal Tokens transparently",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Chat Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Custom Chat with Your Own AI Models</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Custom Chat allows users to chat with their own connected AI models. Users can choose Auto Mode or select a specific model from the dropdown.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
             <div className="flex items-center gap-3 mb-4 w-full justify-between">
                <span className="font-semibold text-gray-700">Model Selection:</span>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50" aria-label="Select AI Model">
                  <option>Auto Mode</option>
                  <option>ChatGPT</option>
                  <option>Claude</option>
                  <option>Gemini</option>
                  <option>Custom LLM</option>
                  <option>Private LLM</option>
                  <option>Other connected models</option>
                </select>
             </div>
             <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 p-3 rounded-lg w-full text-center">
               <strong className="text-blue-700">Auto Mode:</strong> Auto Mode can automatically choose the best available model based on the task, user settings, token usage, and availability.
             </p>
          </div>
        </div>
      </section>

      {/* Integration Hub Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect APIs and Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SAFAL-AI can connect with third-party APIs and tools to create a unified automation workspace. Users can add API keys, endpoints, usernames, passwords, or other connection details where required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Plug, title: "Add new integration" },
              { icon: CheckCircle, title: "Test connection" },
              { icon: ShieldCheck, title: "Manage credentials" },
              { icon: Zap, title: "Enable or disable integration" },
              { icon: MessageSquare, title: "Use integrations inside chat" },
              { icon: Unplug, title: "Disconnect anytime" },
            ].map((action, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <action.icon size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
             <p className="text-sm text-yellow-800">
               <strong className="text-yellow-900">Security Note:</strong> API keys and credentials should be encrypted, masked, and never stored in plain text.
             </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (SAI-LP-013) */}
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Plans for Every User</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more Safal Tokens, more product access, external AI models, custom LLMs, and advanced automation.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Usage with Safal Tokens</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Safal Tokens are used for AI actions inside SAFAL-AI. Before any prompt is executed, users can see how many Safal Tokens may be consumed. The prompt will not run until the user confirms.
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
                Short UI Message: This task may use 8 Safal Tokens. Do you want to continue?
              </p>
            </div>

            {/* Top-up packs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Need More Safal Tokens?</h3>
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
                Users can buy extra Safal Tokens anytime when their monthly plan tokens are low or finished. Top up anytime and continue using SAFAL-AI without interruption.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure, Transparent, and User-Controlled</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              SAFAL-AI keeps users in control. Products, AI models, APIs, and files are connected only with permission. Important actions are shown for review before execution.
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
            <p className="text-gray-600">Quick answers to common questions about Safal-AI.</p>
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

      {/* Final CTA Section */}
      <section className="py-20 bg-green-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Working Smarter with SAFAL-AI</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Connect SafalVir products, AI agents, custom LLMs, APIs, files, and workflows in one platform. Type your prompt, review the token usage, confirm the action, and let SAFAL-AI complete the task.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Free
            </Link>
            <Link href="#pricing" className="border border-green-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              View Pricing
            </Link>
            <Link href="#ai-models" className="border border-green-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Connect AI Model
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (SAI-LP-023) */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Safal-AI</h4>
              <p className="text-sm leading-relaxed">
                SAFAL-AI — One workspace for products, AI agents, custom LLMs, APIs, files, and workflows.
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
                <li><a href="#" className="hover:text-white transition-colors">About Safal-AI</a></li>
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
            <p>&copy; {new Date().getFullYear()} Safal-AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
