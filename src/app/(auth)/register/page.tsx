"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Check,
  ShieldCheck,
} from "lucide-react";

type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY";

const roleConfig: Record<
  UserRole,
  { icon: React.ElementType; label: string; description: string; color: string }
> = {
  DONOR: {
    icon: Building2,
    label: "Food Donor",
    description: "Hotels, restaurants, events sharing surplus food",
    color: "from-blue-500 to-blue-600",
  },
  NGO: {
    icon: Users,
    label: "NGO / Charity",
    description: "Organizations distributing food to those in need",
    color: "from-purple-500 to-purple-600",
  },
  COLLECTOR: {
    icon: Truck,
    label: "Collector / Farmer",
    description: "Collect food waste, manage organic waste & composting",
    color: "from-orange-500 to-orange-600",
  },
  BENEFICIARY: {
    icon: Heart,
    label: "Beneficiary",
    description: "Individuals seeking food assistance",
    color: "from-red-500 to-red-600",
  },
  ADMIN: {
    icon: ShieldCheck,
    label: "Administrator",
    description: "Platform management and oversight",
    color: "from-gray-500 to-gray-600",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AnnaDaan</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Join the Movement
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Against Food Waste
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Create your account and become part of a community that&apos;s
              making a real difference in reducing food waste and feeding those
              in need.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-4 mt-12">
          <h3 className="text-white font-semibold mb-4">Why Join AnnaDaan?</h3>
          {[
            "Earn carbon credits for every kg of food diverted",
            "Get tax deduction certificates automatically",
            "Real-time matching with NGOs and beneficiaries",
            "Track your environmental impact",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-lg space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AnnaDaan</span>
          </div>

          {step === 1 ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  Create your account
                </h2>
                <p className="text-gray-400 mt-2">
                  Select your role to get started
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid gap-4">
                {(["DONOR", "NGO", "COLLECTOR", "BENEFICIARY"] as UserRole[]).map((role) => {
                  const config = roleConfig[role];
                  const Icon = config.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-green-500/50 hover:bg-gray-800/50 transition-all text-left group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium group-hover:text-green-400 transition-colors">
                          {config.label}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {config.description}
                        </p>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to role selection
                </button>

                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      roleConfig[selectedRole!].color
                    } flex items-center justify-center mx-auto mb-4`}
                  >
                    {(() => {
                      const Icon = roleConfig[selectedRole!].icon;
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Register as {roleConfig[selectedRole!].label}
                  </h2>
                  <p className="text-gray-400 mt-2">
                    Fill in your details to create your account
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-12 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-center text-gray-500 text-sm">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-green-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>Your data is secure with AnnaDaan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
