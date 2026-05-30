"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { QuickActions } from "./QuickActions";
import type { User } from "@/types";

interface AIGreetingProps {
  user: User | null;
  onQuickAction: (action: string) => void;
}

export function AIGreeting({ user, onQuickAction }: AIGreetingProps) {
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
      {/* AI Avatar */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
      </div>

      {/* Greeting */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {greeting}, {user?.name?.split(" ")[0] || "there"}! 👋
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        I&apos;m Safal-AI, your personal financial assistant. How can I help you today?
      </p>

      {/* Quick Actions */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-gray-400 mb-3">Quick actions</p>
        <QuickActions onAction={onQuickAction} />
      </div>

      {/* Recent Activity Hint */}
      {user?.subscription && (
        <div className="mt-8 flex items-center gap-4 px-4 py-3 bg-primary-50 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div className="text-left">
              <p className="text-sm font-medium text-primary-900">
                {user.subscription.creditsBalance} AI Credits Available
              </p>
              <p className="text-xs text-primary-600">
                {user.subscription.creditsUsed} used this month
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
