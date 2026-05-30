"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        {title && <h1 className="text-base font-semibold text-gray-900">{title}</h1>}
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {/* Credit Balance */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
        <span className="text-sm font-medium text-green-700">
          {user?.subscription?.creditsBalance || 0} credits
        </span>
      </div>
    </header>
  );
}
