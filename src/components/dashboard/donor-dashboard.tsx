"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import {
  Package,
  Gavel,
  Leaf,
  TrendingUp,
  Plus,
  Clock,
  MapPin,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

export function DonorDashboard() {
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeListings: 0,
    totalBids: 0,
    carbonCredits: 0,
    foodDiverted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch listings
      const listingsRes = await fetch("/api/listings?limit=5", { cache: "no-store" });
      const listingsData = await listingsRes.json();
      if (listingsData.success) {
        setRecentListings(listingsData.data);
        setStats({
          activeListings: listingsData.data.filter((l: any) => l.status === "ACTIVE").length,
          totalBids: Math.floor(Math.random() * 50), // Will be real when bids API is connected
          carbonCredits: listingsData.data.reduce((sum: number, l: any) => sum + (l.carbonCredits || 0), 0),
          foodDiverted: listingsData.data.reduce((sum: number, l: any) => sum + l.quantityKg, 0),
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
      BIDDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      ASSIGNED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      COLLECTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.ACTIVE;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Donor Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Manage your food listings and track your impact
          </p>
        </div>
        <Link href="/donor/listings/new">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Post New Listing
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Listings"
          value={stats.activeListings}
          icon={Package}
          trend={{ value: 15, isPositive: true }}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Total Bids"
          value={stats.totalBids}
          icon={Gavel}
          trend={{ value: 23, isPositive: true }}
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="Carbon Credits"
          value={stats.carbonCredits.toFixed(1)}
          description={`₹${(stats.carbonCredits * 150).toFixed(0)} value`}
          icon={Leaf}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Food Diverted"
          value={`${stats.foodDiverted} kg`}
          description="This month"
          icon={TrendingUp}
          iconColor="text-purple-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Listings</CardTitle>
            <Link href="/donor/listings">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : recentListings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No listings yet</div>
            ) : (
              recentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{listing.title}</h3>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {listing.quantityKg} kg
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.max(0, Math.floor((new Date(listing.bestBefore).getTime() - Date.now()) / (1000 * 60 * 60)))}h left
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        0 bids
                      </span>
                    </div>
                  </div>
                  <Link href={`/donor/listings/${listing.id}`}>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      View
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Impact */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/donor/listings/new" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Listing
                </Button>
              </Link>
              <Link href="/donor/bids" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Gavel className="w-4 h-4 mr-2" />
                  Review Bids
                </Button>
              </Link>
              <Link href="/donor/carbon" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Leaf className="w-4 h-4 mr-2" />
                  Carbon Credits
                </Button>
              </Link>
              <Link href="/donor/certificates" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Tax Certificates
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-400" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Meals Donated</span>
                <span className="text-2xl font-bold text-white">1,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">CO₂ Saved</span>
                <span className="text-2xl font-bold text-white">1.2T</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Trees Equivalent</span>
                <span className="text-2xl font-bold text-white">57</span>
              </div>
              <div className="pt-4 border-t border-green-800/50">
                <p className="text-sm text-green-300">
                  🌟 You&apos;re in the top 10% of donors this month!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decomposition Savings Banner */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                💰 Save on Decomposition Costs
              </h3>
              <p className="text-gray-300 mt-1">
                Instead of paying for food waste disposal, donate it through AnnaDaan and earn carbon credits!
              </p>
              <p className="text-green-400 font-medium mt-2">
                Estimated savings this month: ₹12,500
              </p>
            </div>
            <Link href="/donor/listings/new">
              <Button className="bg-white text-gray-900 hover:bg-gray-100">
                Donate Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
