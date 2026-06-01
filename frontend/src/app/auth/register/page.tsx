"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import {
  GoogleIcon,
  AppleIcon,
  MicrosoftIcon,
} from "@/components/auth/ProviderIcons";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

type SocialProvider = "google" | "apple" | "microsoft";
type Step = "method" | "email" | "phone" | "otp" | "profile";

const productOptions = [
  { value: "safalmybuy", label: "SafalMyBuy" },
  { value: "safaldraintmate", label: "SafalIRDrainMate" },
  { value: "safalvendors", label: "SafalVendors" },
  { value: "safalcalendar", label: "SafalCalendar" },
  { value: "safalsubscriptions", label: "SafalSubscriptions" },
  { value: "safalreviews", label: "SafalReviews" },
  { value: "safaldrive", label: "SafalDrive" },
  { value: "safalutilities", label: "SafalUtilities" },
];

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value: string) => /^\+?[\d\s-]{8,15}$/.test(value);

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<"email" | "phone" | SocialProvider | null>(
    null
  );

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    product: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [info, setInfo] = useState<string>("");

  // ---------- helpers ----------
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

  const reset = () => {
    setStep("method");
    setMethod(null);
    setEmail("");
    setPhone("");
    setOtp("");
    setErrors({});
    setInfo("");
  };

  // ---------- step handlers ----------
  const pickMethod = async (selected: "email" | "phone" | SocialProvider) => {
    setErrors({});
    setInfo("");
    setMethod(selected);

    if (selected === "email") {
      setStep("email");
      return;
    }
    if (selected === "phone") {
      setStep("phone");
      return;
    }

    // Social providers — simulate OAuth/OpenID redirect & callback
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      // Simulate verified provider details. Email auto-filled from provider.
      const fakeEmail = `${selected}.user@example.com`;
      setEmail(fakeEmail);
      // Provider gives us name parts in many cases — leave blank so user fills
      setStep("profile");
      setInfo(
        `${capitalize(
          selected
        )} authorization successful. Please complete your profile to continue.`
      );
    } catch {
      setErrors({
        method: `${capitalize(selected)} authorization failed. Please try again.`,
      });
      setStep("method");
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const trimmed = email.trim();
    if (!trimmed || !isEmail(trimmed)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      // For demo: pretend email is not yet registered. In a real system, the
      // server would return "exists" and we'd guide the user to sign in.
      setStep("otp");
      setInfo("OTP sent to your email.");
      startResendTimer();
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const trimmed = phone.trim();
    if (!trimmed || !isPhone(trimmed)) {
      setErrors({ phone: "Please enter a valid phone number." });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setStep("otp");
      setInfo("OTP sent to your phone number.");
      startResendTimer();
    } catch {
      setErrors({ phone: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!otp.trim() || otp.length < 4) {
      setErrors({ otp: "Invalid OTP. Please try again." });
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      // Demo: any 4-6 digit OTP passes
      setStep("profile");
      setInfo("Verified. One last step to set up your account.");
    } catch {
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setInfo(
        method === "phone"
          ? "OTP sent to your phone number."
          : "OTP sent to your email."
      );
      startResendTimer();
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!profile.firstName.trim())
      newErrors.firstName = "Please enter your first name.";
    else if (!/^[a-zA-Z\s]+$/.test(profile.firstName))
      newErrors.firstName = "First name should contain only letters.";
    if (!profile.lastName.trim())
      newErrors.lastName = "Please enter your last name.";
    else if (!/^[a-zA-Z\s]+$/.test(profile.lastName))
      newErrors.lastName = "Last name should contain only letters.";
    if (!profile.product)
      newErrors.product = "Please select at least one SafalVir product.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      useAuthStore.getState().login(
        {
          id: "1",
          email: email || "user@example.com",
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: phone || "",
          currency: "INR",
          language: "en",
          createdAt: new Date().toISOString(),
          subscription: {
            id: "1",
            plan: "free" as const,
            status: "active" as const,
            creditsBalance: 20,
            creditsUsed: 0,
            renewalDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        },
        "mock-token"
      );
      // Allow store to flush before navigating
      await new Promise((r) => setTimeout(r, 100));
      window.location.href = "/chat";
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- render ----------
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <AuthBrandPanel
        title="Start using one AI platform for apps, files, models, and workflows."
        subtitle="Create your SAFAL-AI account to connect AI models, upload files, and automate everyday tasks."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {step === "method" && (
          <MethodStep
            mode="signup"
            onPick={pickMethod}
            isLoading={isLoading}
            error={errors.method}
          />
        )}

        {step === "email" && (
          <EmailStep
            mode="signup"
            email={email}
            setEmail={setEmail}
            error={errors.email}
            onBack={() => {
              setStep("method");
              setErrors({});
            }}
            onSubmit={sendEmailOtp}
            isLoading={isLoading}
          />
        )}

        {step === "phone" && (
          <PhoneStep
            mode="signup"
            phone={phone}
            setPhone={setPhone}
            error={errors.phone}
            onBack={() => {
              setStep("method");
              setErrors({});
            }}
            onSubmit={sendPhoneOtp}
            isLoading={isLoading}
          />
        )}

        {step === "otp" && (
          <OtpStep
            mode="signup"
            destination={method === "phone" ? phone : email}
            otp={otp}
            setOtp={setOtp}
            error={errors.otp}
            info={info}
            onBack={() => {
              setStep(method === "phone" ? "phone" : "email");
              setOtp("");
              setErrors({});
              setInfo("");
            }}
            onSubmit={verifyOtp}
            isLoading={isLoading}
            resendTimer={resendTimer}
            onResend={resendOtp}
          />
        )}

        {step === "profile" && (
          <ProfileStep
            email={email}
            phone={phone}
            profile={profile}
            setProfile={setProfile}
            errors={errors}
            info={info}
            onSubmit={completeProfile}
            onBack={reset}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

// =================== sub-components ===================

function MethodStep({
  mode,
  onPick,
  isLoading,
  error,
}: {
  mode: "signup" | "login";
  onPick: (m: "email" | "phone" | SocialProvider) => void;
  isLoading: boolean;
  error?: string;
}) {
  const isSignup = mode === "signup";
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isSignup ? "Create your SAFAL-AI account" : "Sign in to SAFAL-AI"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {isSignup
            ? "Choose how you want to continue."
            : "Choose how you want to sign in."}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <ProviderButton
          label={isSignup ? "Continue with Email" : "Login with Email"}
          icon={<Mail className="w-4 h-4" />}
          onClick={() => onPick("email")}
          disabled={isLoading}
          variant="primary"
        />
        <ProviderButton
          label={isSignup ? "Continue with Phone" : "Login with Phone"}
          icon={<Phone className="w-4 h-4" />}
          onClick={() => onPick("phone")}
          disabled={isLoading}
        />

        <Divider />

        <ProviderButton
          label={isSignup ? "Continue with Google" : "Login with Google"}
          icon={<GoogleIcon />}
          onClick={() => onPick("google")}
          disabled={isLoading}
        />
        <ProviderButton
          label={isSignup ? "Continue with Apple" : "Login with Apple"}
          icon={<AppleIcon />}
          onClick={() => onPick("apple")}
          disabled={isLoading}
        />
        <ProviderButton
          label={isSignup ? "Continue with Microsoft" : "Login with Microsoft"}
          icon={<MicrosoftIcon />}
          onClick={() => onPick("microsoft")}
          disabled={isLoading}
        />
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            New to SAFAL-AI?{" "}
            <Link
              href="/auth/register"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create Account
            </Link>
          </>
        )}
      </p>
    </>
  );
}

function EmailStep({
  mode,
  email,
  setEmail,
  error,
  onBack,
  onSubmit,
  isLoading,
}: {
  mode: "signup" | "login";
  email: string;
  setEmail: (v: string) => void;
  error?: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "signup" ? "Continue with Email" : "Login with Email"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          We&apos;ll send a one-time code to your email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Send OTP
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </>
  );
}

function PhoneStep({
  mode,
  phone,
  setPhone,
  error,
  onBack,
  onSubmit,
  isLoading,
}: {
  mode: "signup" | "login";
  phone: string;
  setPhone: (v: string) => void;
  error?: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "signup" ? "Continue with Phone" : "Login with Phone"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          We&apos;ll send a one-time code to your phone.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="tel"
          label="Phone Number"
          placeholder="+91 98765 43210"
          icon={<Phone className="w-4 h-4" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={error}
          required
        />
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Send OTP
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </>
  );
}

function OtpStep({
  mode,
  destination,
  otp,
  setOtp,
  error,
  info,
  onBack,
  onSubmit,
  isLoading,
  resendTimer,
  onResend,
}: {
  mode: "signup" | "login";
  destination: string;
  otp: string;
  setOtp: (v: string) => void;
  error?: string;
  info?: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  resendTimer: number;
  onResend: () => void;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
        <p className="text-gray-500 mt-1 text-sm">
          We sent a verification code to{" "}
          <span className="font-medium text-gray-700">{destination}</span>
        </p>
      </div>

      {info && !error && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-start gap-2">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <span>{info}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="text"
          inputMode="numeric"
          label="Enter OTP"
          placeholder="Enter 4-6 digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          error={error}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          {mode === "signup" ? "Verify & Continue" : "Verify & Sign In"}
        </Button>
      </form>

      <div className="text-center mt-4">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-400">Resend OTP in {resendTimer}s</p>
        ) : (
          <button
            onClick={onResend}
            disabled={isLoading}
            className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
            type="button"
          >
            Resend OTP
          </button>
        )}
      </div>
    </>
  );
}

function ProfileStep({
  email,
  phone,
  profile,
  setProfile,
  errors,
  info,
  onSubmit,
  onBack,
  isLoading,
}: {
  email: string;
  phone: string;
  profile: { firstName: string; lastName: string; product: string };
  setProfile: (p: { firstName: string; lastName: string; product: string }) => void;
  errors: Record<string, string>;
  info?: string;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <BackButton onClick={onBack} label="Start over" />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complete your profile</h1>
        <p className="text-gray-500 mt-1 text-sm">
          A few details to set up your SAFAL-AI workspace.
        </p>
      </div>

      {info && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-start gap-2">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <span>{info}</span>
        </div>
      )}

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            placeholder="John"
            icon={<User className="w-4 h-4" />}
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
            error={errors.firstName}
            required
          />
          <Input
            type="text"
            label="Last Name"
            placeholder="Doe"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
            error={errors.lastName}
            required
          />
        </div>

        {email && (
          <Input
            type="email"
            label="Email Address"
            value={email}
            readOnly
            icon={<Mail className="w-4 h-4" />}
            className="bg-gray-50"
          />
        )}

        {phone && (
          <Input
            type="tel"
            label="Phone Number"
            value={phone}
            readOnly
            icon={<Phone className="w-4 h-4" />}
            className="bg-gray-50"
          />
        )}

        <Select
          label="SafalVir Product"
          options={productOptions}
          value={profile.product}
          onChange={(e) => setProfile({ ...profile, product: e.target.value })}
          placeholder="Select a product"
          error={errors.product}
          required
        />
        <p className="text-xs text-gray-400 -mt-2">
          All SafalVir products are launching soon. You can change this later.
        </p>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Create Account
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </>
  );
}

// =================== bits ===================

function ProviderButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "outline",
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline" | "primary";
}) {
  const base =
    "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      <span className="flex items-center justify-center w-5">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function BackButton({
  onClick,
  label = "Back",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      type="button"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
