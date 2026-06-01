"use client";

import { Button } from "@/components/ui/Button";
import {
  Package,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ProductConnectProps {
  productName: string;
  /** Optional one-line description shown under the heading */
  description?: string;
  /** True when the product is still listed as Launching Soon */
  launchingSoon?: boolean;
  onConnect: () => void;
  isConnecting?: boolean;
}

export function ProductConnect({
  productName,
  description,
  launchingSoon,
  onConnect,
  isConnecting = false,
}: ProductConnectProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
        <Package className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Connect your {productName} account
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-2">
        {description ||
          `Please login with ${productName} to connect this product. After authorization, SAFAL-AI can securely access your ${productName} data.`}
      </p>

      {launchingSoon && (
        <div className="mt-2 mb-6 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-xs text-yellow-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          {productName} is launching soon — connection is in preview
        </div>
      )}

      <Button
        onClick={onConnect}
        size="lg"
        isLoading={isConnecting}
        className="my-4"
      >
        <Package className="w-4 h-4 mr-2" />
        Login with {productName}
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      <div className="max-w-sm space-y-3 mt-2">
        <div className="flex items-start gap-3 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <span>
            Your {productName} password is never stored in SAFAL-AI. We use
            secure token-based authorization.
          </span>
        </div>
        <div className="flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <span>
            You can disconnect this product anytime from Settings or Sidebar.
          </span>
        </div>
      </div>
    </div>
  );
}
