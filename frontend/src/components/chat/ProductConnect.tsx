"use client";

import { Button } from "@/components/ui/Button";
import { ShoppingCart, ExternalLink, Shield, CheckCircle } from "lucide-react";

interface ProductConnectProps {
  onConnect: () => void;
  isConnecting?: boolean;
}

export function ProductConnect({ onConnect, isConnecting = false }: ProductConnectProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
        <ShoppingCart className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Connect your SafalMyBuy account
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-8">
        To use SafalMyBuy features, please connect your SafalMyBuy account. This allows Safal-AI to securely access your expenses, purchases, and records.
      </p>

      <Button onClick={onConnect} size="lg" isLoading={isConnecting} className="mb-6">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Login with SafalMyBuy
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      <div className="max-w-sm space-y-3">
        <div className="flex items-start gap-3 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <span>Your SafalMyBuy password is never stored in Safal-AI. We use secure token-based authorization.</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <span>You can disconnect your account anytime from Settings.</span>
        </div>
      </div>
    </div>
  );
}
