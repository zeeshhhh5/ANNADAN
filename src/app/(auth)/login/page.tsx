"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Leaf,
  Building2,
  Users,
  Truck,
  Heart,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

type UserRole = "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY" | "ADMIN";

const demoAccounts = [
  { role: "DONOR", email: "donor@example.com", password: "password123", icon: Building2, color: "blue" },
  { role: "NGO", email: "ngo@example.com", password: "password123", icon: Users, color: "purple" },
  { role: "COLLECTOR", email: "collector@example.com", password: "password123", icon: Truck, color: "orange" },
  { role: "ADMIN", email: "admin@annadan.org", password: "admin123", icon: Shield, color: "green" },
];

const roleConfig: Record<UserRole, { icon: React.ElementType; label: string; description: string }> = {
  DONOR: {
    icon: Building2,
    label: "For Donors",
    description: "Hotels, restaurants & events sharing surplus food",
  },
  NGO: {
    icon: Users,
    label: "For NGOs",
    description: "Distribute food to those in need",
  },
  COLLECTOR: {
    icon: Truck,
    label: "For Collectors",
    description: "Collect food waste & composting",
  },
  BENEFICIARY: {
    icon: Heart,
    label: "For Beneficiaries",
    description: "Access food assistance",
  },
  ADMIN: {
    icon: Shield,
    label: "For Admins",
    description: "Platform management",
  },
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        toast.error(result.error === "CredentialsSignin" 
          ? "Invalid email or password. Please check your credentials." 
          : result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Welcome back! Redirecting...");
        window.location.href = callbackUrl;
      } else {
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">AnnaDaan</span>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-gray-400 mt-2">Sign in to your account to continue</p>
      </div>

      {/* Demo Accounts Quick Login */}
      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <p className="text-sm text-gray-400 mb-3 text-center">Quick Demo Login</p>
        <div className="grid grid-cols-2 gap-2">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoLogin(account.email, account.password)}
                className={`flex items-center gap-2 p-2 rounded-lg border border-gray-700 hover:border-${account.color}-500/50 hover:bg-gray-800 transition-all text-left`}
              >
                <Icon className={`w-4 h-4 text-${account.color}-400`} />
                <span className="text-xs text-gray-300">{account.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-green-400 hover:text-green-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500 pr-12"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-center text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-green-400 hover:text-green-300 font-medium"
        >
          Create account
        </Link>
      </p>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <Shield className="w-4 h-4" />
        <span>Secured by AnnaDaan Auth</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AnnaDaan</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Reduce Food Waste,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Feed the Hungry
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              A multi-stakeholder platform connecting food donors, NGOs, waste
              collectors, farmers, and beneficiaries into one intelligent
              ecosystem.
            </p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-12">
          {(["DONOR", "NGO", "COLLECTOR"] as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <div
                key={role}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-green-500/50 transition-all"
              >
                <Icon className="w-6 h-6 text-green-400 mb-3" />
                <h3 className="text-white font-medium text-sm">{config.label}</h3>
                <p className="text-gray-500 text-xs mt-1">{config.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8 mt-8">
          <div>
            <p className="text-3xl font-bold text-white">50K+</p>
            <p className="text-gray-500 text-sm">Meals Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">2.5T</p>
            <p className="text-gray-500 text-sm">CO₂ Saved</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-gray-500 text-sm">Active Partners</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <Suspense fallback={
          <div className="w-full max-w-md space-y-8 animate-pulse">
            <div className="h-10 bg-gray-800 rounded w-3/4 mx-auto" />
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-12 bg-gray-800 rounded" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
