import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Safal-AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your AI Assistant for
            <span className="block mt-2">Financial Management</span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-lg">
            Track expenses, manage purchases, scan receipts, track warranties, and get AI-powered insights — all through simple conversations.
          </p>

          {/* Features List */}
          <div className="space-y-4">
            {[
              { icon: "💬", text: "Natural language expense tracking" },
              { icon: "📄", text: "Receipt scanning with AI" },
              { icon: "⏰", text: "Warranty & expiry reminders" },
              { icon: "👨‍👩‍👧‍👦", text: "Family expense sharing" },
              { icon: "📊", text: "Smart reports & insights" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-base">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
