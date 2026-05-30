"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { User, Mail, Phone, Package, ArrowRight, ArrowLeft } from "lucide-react";

const productOptions = [
  { value: "safalmybuy", label: "SafalMyBuy" },
  { value: "safal-ai", label: "Safal-AI" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    product: "",
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name should contain only letters.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name should contain only letters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter a valid phone number.";
    } else if (!/^\+?[\d\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.product) {
      newErrors.product = "Please select a Safal-AI product.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsLoading(true);

    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("otp");
      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      setErrors({ form: "Something went wrong. Please try again." });
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

      if (otp === "1234" || otp.length >= 4) {
        // Success - redirect to dashboard
        router.push("/chat");
      } else {
        setErrors({ otp: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      setErrors({ otp: "Something went wrong. Please try again." });
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

  // Step 1: Registration Details
  if (step === "details") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your details to create a Safal-AI account
          </p>
        </div>

        <form onSubmit={handleSubmitDetails} className="space-y-4">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="First Name"
              placeholder="John"
              icon={<User className="w-4 h-4" />}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              error={errors.firstName}
              required
            />
            <Input
              type="text"
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              error={errors.lastName}
              required
            />
          </div>

          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            required
          />

          <Input
            type="tel"
            label="Phone Number"
            placeholder="+91 98765 43210"
            icon={<Phone className="w-4 h-4" />}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={errors.phone}
            required
          />

          <Select
            label="Purchased Safal-AI Product"
            options={productOptions}
            value={formData.product}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            placeholder="Select a product"
            error={errors.product}
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  // Step 2: OTP Verification
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <button
        onClick={() => setStep("details")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
        <p className="text-gray-500 mt-1 text-sm">
          We sent a verification code to{" "}
          <span className="font-medium text-gray-700">{formData.email}</span>
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
          Verify & Create Account
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
