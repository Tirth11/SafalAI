"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(0);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value: string) => /^\+?[\d\s-]{8,15}$/.test(value);

  const handleSubmitIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const trimmed = identifier.trim();

    if (!trimmed) {
      setErrors({ identifier: "Please enter your email address or phone number." });
      return;
    }

    if (!isEmail(trimmed) && !isPhone(trimmed)) {
      setErrors({ identifier: "Please enter a valid email address or phone number." });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate checking if user exists and sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, always proceed to OTP step
      setStep("otp");
      startResendTimer();
    } catch (error) {
      setErrors({ identifier: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!otp.trim() || otp.length < 4) {
      setErrors({ otp: "Invalid OTP. Please try again." });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const mockUser = {
        id: "1",
        email: isEmail(identifier) ? identifier : "user@example.com",
        name: "Demo User",
        phone: isPhone(identifier) ? identifier : "",
        currency: "INR",
        language: "en",
        createdAt: new Date().toISOString(),
        subscription: {
          id: "1",
          plan: "basic" as const,
          status: "active" as const,
          creditsBalance: 50,
          creditsUsed: 10,
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };

      login(mockUser, "mock-token");
      // Small delay to ensure localStorage persistence before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = "/chat";
    } catch (error) {
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    startResendTimer();
  };

  // Step 1: Enter email or phone
  if (step === "identifier") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your registered email or phone number
          </p>
        </div>

        <form onSubmit={handleSubmitIdentifier} className="space-y-4">
          {errors.identifier && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.identifier}
            </div>
          )}

          <Input
            type="text"
            label="Email or Phone Number"
            placeholder="you@example.com or +91 98765 43210"
            icon={<Mail className="w-4 h-4" />}
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors({});
            }}
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    );
  }

  // Step 2: OTP Verification
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <button
        onClick={() => {
          setStep("identifier");
          setOtp("");
          setErrors({});
        }}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
        <p className="text-gray-500 mt-1 text-sm">
          We sent a verification code to{" "}
          <span className="font-medium text-gray-700">{identifier}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-4">
        {errors.otp && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {errors.otp}
          </div>
        )}

        <Input
          type="text"
          label="Enter OTP"
          placeholder="Enter 4-6 digit code"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
            setErrors({});
          }}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Verify & Sign In
        </Button>
      </form>

      <div className="text-center mt-4">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-400">
            Resend OTP in {resendTimer}s
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
