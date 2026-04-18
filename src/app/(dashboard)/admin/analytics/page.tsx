"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Leaf,
  Truck,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  const stats = analytics || {
    users: { total: 0, donors: 0, ngos: 0, collectors: 0 },
    listings: { total: 0, active: 0, completed: 0 },
    impact: { mealsProvided: 0, co2Saved: 0, carbonCredits: 0 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Platform performance overview</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.users?.total || 0}</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +12% this month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.listings?.total || 0}</p>
              </div>
              <Package className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Meals Provided</p>
                <p className="text-3xl font-bold text-white mt-1">{(stats.impact?.mealsProvided || 0).toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carbon Credits</p>
                <p className="text-3xl font-bold text-white mt-1">{(stats.impact?.carbonCredits || 0).toFixed(0)}</p>
              </div>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Donors", value: stats.users?.donors || 0, color: "blue", icon: Package },
              { label: "NGOs", value: stats.users?.ngos || 0, color: "purple", icon: Users },
              { label: "Collectors", value: stats.users?.collectors || 0, color: "orange", icon: Truck },
              { label: "Beneficiaries", value: stats.users?.beneficiaries || 0, color: "pink", icon: Heart },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 text-${item.color}-400`} />
                    <span className="text-gray-400">{item.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{((stats.impact?.co2Saved || 0) / 1000).toFixed(1)}T</p>
              <p className="text-gray-400 mt-1">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{Math.floor((stats.impact?.co2Saved || 0) / 21)}</p>
              <p className="text-gray-400 mt-1">Trees Equivalent</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">₹{((stats.impact?.carbonCredits || 0) * 150 / 1000).toFixed(0)}K</p>
              <p className="text-gray-400 mt-1">Carbon Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart Placeholder */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 45, 78, 52, 90, 68, 85].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-green-500/20 rounded-t transition-all hover:bg-green-500/30"
                  style={{ height: `${value * 2}px` }}
                />
                <span className="text-xs text-gray-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
