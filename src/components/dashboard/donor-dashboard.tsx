"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import { Skeleton } from "@/components/ui/skeleton";
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
  RefreshCw,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  status: string;
  quantityKg: number;
  bestBefore: string;
  bidCount: number;
  category: string;
  address: string;
}

interface DashboardStats {
  activeListings: number;
  totalBids: number;
  pendingBids: number;
  carbonCredits: number;
  carbonEarnings: number;
  totalKgDonated: number;
  mealsProvided: number;
  co2Saved: number;
}

// Mock data for realistic display
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Fresh Biryani - 50 servings",
    status: "ACTIVE",
    quantityKg: 25,
    bestBefore: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    bidCount: 2,
    category: "COOKED_FOOD",
    address: "Jubilee Hills, Hyderabad",
  },
  {
    id: "2",
    title: "Fresh Vegetables - Mixed",
    status: "ACTIVE",
    quantityKg: 15,
    bestBefore: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    bidCount: 0,
    category: "VEGETABLES",
    address: "Banjara Hills, Hyderabad",
  },
  {
    id: "3",
    title: "Bakery Items - Bread & Pastries",
    status: "BIDDING",
    quantityKg: 8,
    bestBefore: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    bidCount: 1,
    category: "BAKERY",
    address: "Madhapur, Hyderabad",
  },
];

const mockStats: DashboardStats = {
  activeListings: 3,
  totalBids: 5,
  pendingBids: 3,
  carbonCredits: 12.5,
  carbonEarnings: 1875,
  totalKgDonated: 125,
  mealsProvided: 500,
  co2Saved: 312.5,
};

export function DonorDashboard() {
  const [recentListings, setRecentListings] = useState<Listing[]>(mockListings);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const [statsRes, listingsRes] = await Promise.all([
        fetch("/api/stats", { cache: "no-store" }),
        fetch("/api/listings?limit=5", { cache: "no-store" }),
      ]);

      const [statsData, listingsData] = await Promise.all([
        statsRes.json(),
        listingsRes.json(),
      ]);

      // Use API data if available, otherwise use mock data
      if (statsData.success && statsData.data) {
        const apiStats = statsData.data;
        setStats({
          activeListings: apiStats.activeListings || mockStats.activeListings,
          totalBids: apiStats.totalBids || mockStats.totalBids,
          pendingBids: apiStats.pendingBids || mockStats.pendingBids,
          carbonCredits: apiStats.carbonCredits || mockStats.carbonCredits,
          carbonEarnings: apiStats.carbonEarnings || mockStats.carbonEarnings,
          totalKgDonated: apiStats.totalKgDonated || mockStats.totalKgDonated,
          mealsProvided: apiStats.mealsProvided || mockStats.mealsProvided,
          co2Saved: apiStats.co2Saved || mockStats.co2Saved,
        });
      }

      if (listingsData.success && listingsData.data?.length > 0) {
        setRecentListings(listingsData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Simulate loading then show data
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
      BIDDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      ASSIGNED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      COLLECTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      DISTRIBUTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return colors[status] || colors.ACTIVE;
  };

  const getTimeRemaining = (bestBefore: string) => {
    const hours = Math.max(0, Math.floor((new Date(bestBefore).getTime() - Date.now()) / (1000 * 60 * 60)));
    if (hours === 0) return "< 1h";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/donor/listings/new">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Post New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2 bg-gray-800" />
                  <Skeleton className="h-8 w-16 bg-gray-800" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Active Listings"
              value={stats.activeListings}
              icon={Package}
              trend={stats.activeListings > 0 ? { value: stats.activeListings, isPositive: true } : undefined}
              iconColor="text-blue-400"
            />
            <StatsCard
              title="Pending Bids"
              value={stats.pendingBids}
              description={`${stats.totalBids} total bids`}
              icon={Gavel}
              trend={stats.pendingBids > 0 ? { value: stats.pendingBids, isPositive: true } : undefined}
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
              title="Food Donated"
              value={`${stats.totalKgDonated} kg`}
              description={`${stats.mealsProvided} meals`}
              icon={TrendingUp}
              iconColor="text-purple-400"
            />
          </>
        )}
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                    <Skeleton className="h-5 w-48 mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : recentListings.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No listings yet</p>
                <Link href="/donor/listings/new">
                  <Button variant="link" className="text-green-400 mt-2">
                    Create your first listing
                  </Button>
                </Link>
              </div>
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
                        {getTimeRemaining(listing.bestBefore)} left
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {listing.bidCount || 0} bids
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
                  {stats.pendingBids > 0 && (
                    <Badge className="ml-auto bg-yellow-500/20 text-yellow-400">
                      {stats.pendingBids}
                    </Badge>
                  )}
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
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-full bg-green-800/30" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Meals Donated</span>
                    <span className="text-2xl font-bold text-white">
                      {stats.mealsProvided.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">CO₂ Saved</span>
                    <span className="text-2xl font-bold text-white">
                      {stats.co2Saved >= 1000 
                        ? `${(stats.co2Saved / 1000).toFixed(1)}T` 
                        : `${stats.co2Saved.toFixed(0)}kg`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trees Equivalent</span>
                    <span className="text-2xl font-bold text-white">
                      {Math.floor(stats.co2Saved / 21)}
                    </span>
                  </div>
                  {stats.totalKgDonated > 50 && (
                    <div className="pt-4 border-t border-green-800/50">
                      <p className="text-sm text-green-300">
                        🌟 You&apos;re making a real difference!
                      </p>
                    </div>
                  )}
                </>
              )}
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
                Estimated savings: ₹{(stats.totalKgDonated * 5).toLocaleString()}
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
