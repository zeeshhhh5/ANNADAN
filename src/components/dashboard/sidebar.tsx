"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Leaf,
  LayoutDashboard,
  Package,
  Gavel,
  Users,
  Truck,
  Sprout,
  Heart,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  FileText,
  BarChart3,
  Map,
  ClipboardList,
  Building2,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Recycle,
  HandHeart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "KYC Verification", href: "/admin/kyc", icon: ShieldCheck },
    { title: "All Listings", href: "/admin/listings", icon: Package },
    { title: "Collections", href: "/admin/collections", icon: Truck },
    { title: "Carbon Credits", href: "/admin/carbon", icon: Leaf },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ],
  DONOR: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Listings", href: "/donor/listings", icon: Package },
    { title: "Active Bids", href: "/donor/bids", icon: Gavel },
    { title: "Carbon Credits", href: "/donor/carbon", icon: Leaf },
    { title: "Impact Report", href: "/donor/impact", icon: BarChart3 },
  ],
  NGO: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Available Food", href: "/ngo/listings", icon: Package },
    { title: "My Requests", href: "/ngo/requests", icon: ClipboardList },
    { title: "Beneficiaries", href: "/ngo/beneficiaries", icon: Heart },
    { title: "Distribution", href: "/ngo/distribution", icon: HandHeart },
    { title: "Impact", href: "/ngo/impact", icon: BarChart3 },
  ],
  COLLECTOR: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Available Pickups", href: "/collector/pickups", icon: Map },
    { title: "My Collections", href: "/collector/collections", icon: Truck },
    { title: "Waste Management", href: "/collector/waste", icon: Recycle },
    { title: "Composting", href: "/collector/compost", icon: Sprout },
    { title: "Earnings", href: "/collector/earnings", icon: TrendingUp },
  ],
  BENEFICIARY: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Find Food", href: "/beneficiary/search", icon: Package },
    { title: "My Requests", href: "/beneficiary/requests", icon: ClipboardList },
    { title: "Nearby NGOs", href: "/beneficiary/ngos", icon: Building2 },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = (session?.user?.role || "DONOR") as UserRole;
  const navItems = roleNavItems[userRole] || roleNavItems.DONOR;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AnnaDaan</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors outline-none">
            <Avatar className="w-10 h-10">
              <AvatarImage src={session?.user?.avatar || ""} />
              <AvatarFallback className="bg-green-500/20 text-green-400">
                {getInitials(session?.user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userRole.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2 text-gray-300 w-full">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/notifications" className="flex items-center gap-2 text-gray-300 w-full">
                <Bell className="w-4 h-4" />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-red-400 focus:text-red-400 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
