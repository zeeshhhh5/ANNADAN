"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import {
  Users,
  Package,
  Leaf,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  IndianRupee,
  Building2,
  Wallet,
  BarChart3,
} from "lucide-react";

export function AdminDashboard() {
  const [pendingKYC] = useState([
    {
      id: "1",
      name: "Grand Hotel",
      type: "DONOR",
      submittedAt: "2 hours ago",
      documents: 3,
    },
    {
      id: "2",
      name: "Food For All NGO",
      type: "NGO",
      submittedAt: "5 hours ago",
      documents: 5,
    },
    {
      id: "3",
      name: "Green Collectors",
      type: "COLLECTOR",
      submittedAt: "1 day ago",
      documents: 4,
    },
  ]);

  const [recentTrades] = useState([
    {
      id: "1",
      buyer: "ABC Industries",
      credits: 50,
      amount: 7500,
      status: "COMPLETED",
    },
    {
      id: "2",
      buyer: "XYZ Corp",
      credits: 25,
      amount: 3750,
      status: "PENDING",
    },
  ]);

  const [platformStats] = useState({
    totalUsers: 2450,
    activeListings: 156,
    totalCredits: 1250,
    monthlyRevenue: 125000,
    kgDivertedToday: 450,
    mealsToday: 1200,
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DONOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      NGO: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      COLLECTOR: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      FARMER: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return colors[type] || colors.DONOR;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Platform overview and management
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Users"
          value={platformStats.totalUsers.toLocaleString()}
          icon={Users}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Active Listings"
          value={platformStats.activeListings}
          icon={Package}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Carbon Credits"
          value={platformStats.totalCredits}
          icon={Leaf}
          iconColor="text-emerald-400"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${(platformStats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="Kg Diverted Today"
          value={platformStats.kgDivertedToday}
          icon={TrendingUp}
          iconColor="text-purple-400"
        />
        <StatsCard
          title="Meals Today"
          value={platformStats.mealsToday.toLocaleString()}
          icon={Building2}
          iconColor="text-red-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending KYC */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              Pending KYC Verifications
              <Badge className="bg-yellow-500/10 text-yellow-400 ml-2">
                {pendingKYC.length}
              </Badge>
            </CardTitle>
            <Link href="/admin/kyc">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingKYC.map((kyc) => (
              <div
                key={kyc.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{kyc.name}</h3>
                    <p className="text-sm text-gray-400">
                      {kyc.documents} documents • {kyc.submittedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(kyc.type)}>{kyc.type}</Badge>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/kyc" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <ShieldCheck className="w-4 h-4 mr-2 text-yellow-400" />
                  KYC Queue ({pendingKYC.length})
                </Button>
              </Link>
              <Link href="/admin/carbon" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Leaf className="w-4 h-4 mr-2 text-green-400" />
                  Manage Carbon Credits
                </Button>
              </Link>
              <Link href="/admin/trades" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Wallet className="w-4 h-4 mr-2 text-blue-400" />
                  Carbon Trades
                </Button>
              </Link>
              <Link href="/admin/analytics" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
                  Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Carbon Trades */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-400" />
                Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{trade.buyer}</span>
                    <Badge
                      className={
                        trade.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }
                    >
                      {trade.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-400">{trade.credits} credits</span>
                    <span className="text-green-400">₹{trade.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <Link href="/admin/trades" className="block">
                <Button variant="ghost" className="w-full text-green-400 hover:text-green-300">
                  View All Trades
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts */}
      <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-800/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">System Alerts</h3>
              <ul className="mt-2 space-y-2 text-gray-300">
                <li>• 3 listings expiring in the next hour</li>
                <li>• 2 disputes pending resolution</li>
                <li>• Carbon credit price update needed</li>
              </ul>
            </div>
            <Link href="/admin/alerts">
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                View All
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
