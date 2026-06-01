"use client";

import { Button } from "@/components/ui/Button";
import {
  Package,
  ExternalLink,
  Shield,
  CheckCircle,
} from "lucide-react";

interface ProductConnectProps {
  productName: string;
  /** Optional one-line description shown under the heading */
  description?: string;
  onConnect: () => void;
  isConnecting?: boolean;
}

export function ProductConnect({
  productName,
  description,
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
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
        {description ||
          `Please login with ${productName} to connect this product. After authorization, Safal-AI can securely access your ${productName} data.`}
      </p>

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
            Your {productName} password is never stored in Safal-AI. We use
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
