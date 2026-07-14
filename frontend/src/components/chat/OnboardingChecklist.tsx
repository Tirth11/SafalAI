"use client";

import { CheckCircle2, CircleDashed, Play, X, ArrowRight, Sparkles } from "lucide-react";
import { useOnboardingStore, useProductsStore, useLLMStore, useAuthStore } from "@/lib/store";
import { useAIStudioStore } from "@/lib/ai-studio-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function OnboardingChecklist() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { connections } = useProductsStore();
  const { apis } = useLLMStore();
  const { llms, agents } = useAIStudioStore();
  
  const {
    hasStartedCustomChat,
    hasUploadedFile,
    hasViewedTokens,
    isOnboardingDismissed,
    setDemoMode,
    dismissOnboarding
  } = useOnboardingStore();

  if (isOnboardingDismissed) return null;

  const hasConnectedProduct = Object.values(connections).some((c) => c.connected);
  const hasAddedApi = apis.length > 0 || llms.length > 0;
  const hasCreatedAgent = agents.length > 0;

  const steps = [
    { label: "Connect a SafalVir product", desc: "Link an app to automate your tasks.", completed: hasConnectedProduct, href: "/chat?product=safalmybuy" },
    { label: "Create AI Connections", desc: "Add your preferred AI models and APIs.", completed: hasAddedApi, href: "/ai-studio/connections" },
    { label: "Create Agent", desc: "Build a custom AI agent tailored to your needs.", completed: hasCreatedAgent, href: "/ai-studio/create-agent" },
    { label: "My Agents", desc: "View and manage your custom agents.", completed: false, href: "/ai-studio/my-agents" },
    { label: "Agent Marketplace", desc: "Explore ready-made AI agents.", completed: false, href: "/ai-studio/marketplace" },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  const handleDemoClick = () => {
    setDemoMode(true);
    router.push("/chat?product=custom");
  };

  return (
    <div className="max-w-2xl mx-auto w-full mb-10 animate-fade-in relative group perspective-1000">
      {/* Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100 shadow-sm">
              <Sparkles size={14} className="text-indigo-500" /> Getting Started
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                SAFAL-AI
              </span>
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base">Complete these steps to unleash your intelligent workspace.</p>
          </div>
          <button 
            onClick={dismissOnboarding}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
            title="Dismiss checklist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Setup Progress</span>
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{completedCount} of {steps.length} completed</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-[2px] -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-8">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={cn(
                "group/item flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-md",
                step.completed 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50/30 border-green-200" 
                  : "bg-white border-gray-100 hover:border-indigo-200"
              )}
            >
              <div className="flex-shrink-0 relative">
                {step.completed ? (
                  <>
                    <CheckCircle2 className="text-green-500 w-6 h-6 relative z-10" />
                    <div className="absolute inset-0 bg-green-400 blur-md opacity-40 z-0"></div>
                  </>
                ) : (
                  <CircleDashed className="text-gray-300 group-hover/item:text-indigo-400 w-6 h-6 transition-colors duration-300" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-semibold truncate transition-colors duration-300",
                  step.completed ? "text-green-800" : "text-gray-900 group-hover/item:text-indigo-900"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{step.desc}</p>
              </div>
              
              {step.href && (
                <button 
                  onClick={() => router.push(step.href!)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 group-hover/item:pr-3"
                >
                  Start <ArrowRight size={14} className="opacity-70 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer / Demo CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-5 text-white">
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-base font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
              Not ready to set up? <span className="inline-flex w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            </h3>
            <p className="text-sm text-indigo-200 mt-1.5 max-w-sm mx-auto sm:mx-0 leading-relaxed">
              Skip the configuration and instantly explore Safal-AI in a fully functional demo sandbox environment.
            </p>
          </div>
          <button 
            onClick={handleDemoClick}
            className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-white text-indigo-950 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            <Play size={16} className="fill-indigo-950" /> 
            Try Demo Sandbox
          </button>
        </div>

      </div>
    </div>
  );
}
