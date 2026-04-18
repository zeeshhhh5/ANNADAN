"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Package,
  Users,
  Heart,
  TrendingUp,
  Plus,
  Clock,
  MapPin,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Loader2,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  donorName: string;
  quantityKg: number;
  bestBefore: string;
  category: string;
  address?: string;
}

interface Requirement {
  id: string;
  title: string;
  category: string;
  quantityKg: number;
  urgency: string;
  neededBy: string;
  fulfilledKg: number;
}

// Mock data for realistic display
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Fresh Biryani - 100 servings",
    donorName: "Taj Catering Services",
    quantityKg: 50,
    bestBefore: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    category: "COOKED_FOOD",
    address: "Jubilee Hills, Hyderabad",
  },
  {
    id: "2",
    title: "Mixed Vegetables - Fresh",
    donorName: "Metro Supermarket",
    quantityKg: 30,
    bestBefore: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    category: "VEGETABLES",
    address: "Banjara Hills, Hyderabad",
  },
  {
    id: "3",
    title: "Bread & Bakery Items",
    donorName: "Karachi Bakery",
    quantityKg: 15,
    bestBefore: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    category: "BAKERY",
    address: "Madhapur, Hyderabad",
  },
];

const mockRequirements: Requirement[] = [
  {
    id: "1",
    title: "Rice & Dal for 200 people",
    category: "COOKED_FOOD",
    quantityKg: 100,
    urgency: "HIGH",
    neededBy: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    fulfilledKg: 45,
  },
  {
    id: "2",
    title: "Fresh Fruits for Children",
    category: "FRUITS",
    quantityKg: 50,
    urgency: "MEDIUM",
    neededBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    fulfilledKg: 20,
  },
  {
    id: "3",
    title: "Milk & Dairy Products",
    category: "DAIRY",
    quantityKg: 30,
    urgency: "CRITICAL",
    neededBy: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    fulfilledKg: 0,
  },
];

export function NGODashboard() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, reqRes] = await Promise.all([
          fetch("/api/listings?status=ACTIVE&limit=5"),
          fetch("/api/ngo/requests"),
        ]);
        
        const listingsData = await listingsRes.json();
        const reqData = await reqRes.json();
        
        // Use API data if available, otherwise keep mock data
        if (listingsData.success && listingsData.data?.length > 0) {
          setListings(listingsData.data);
        }
        if (reqData.success && reqData.data?.length > 0) {
          setRequirements(reqData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlaceBid = async (listingId: string) => {
    setBidding(listingId);
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          message: "We would like to collect this food for distribution.",
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Bid placed successfully!");
        // Remove from list
        setListings(listings.filter(l => l.id !== listingId));
      } else {
        toast.error(data.error || "Failed to place bid");
      }
    } catch (error) {
      toast.error("Failed to place bid");
    } finally {
      setBidding(null);
    }
  };

  const getTimeRemaining = (bestBefore: string) => {
    const hours = Math.max(0, Math.floor((new Date(bestBefore).getTime() - Date.now()) / (1000 * 60 * 60)));
    if (hours === 0) return "< 1h";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[urgency] || colors.MEDIUM;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-gray-800" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 bg-gray-800" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">NGO Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Find food donations and manage distribution
          </p>
        </div>
        <Link href="/ngo/requirements/new">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Post Requirement
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Requirements"
          value={5}
          icon={ClipboardList}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Matched Listings"
          value={12}
          icon={Package}
          trend={{ value: 30, isPositive: true }}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Meals Distributed"
          value="2,450"
          description="This month"
          icon={Heart}
          iconColor="text-red-400"
        />
        <StatsCard
          title="Beneficiaries Served"
          value={850}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          iconColor="text-purple-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Listings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-green-400">✨</span>
              Available Food
            </CardTitle>
            <Link href="/ngo/listings">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No available listings</p>
              </div>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{listing.title}</h3>
                      <p className="text-sm text-gray-400">{listing.donorName || "Anonymous Donor"}</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      {listing.category?.replace(/_/g, " ") || "Food"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {listing.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getTimeRemaining(listing.bestBefore)} left
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handlePlaceBid(listing.id)}
                      disabled={bidding === listing.id}
                    >
                      {bidding === listing.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Bidding...
                        </>
                      ) : (
                        "Place Bid"
                      )}
                    </Button>
                    <Link href={`/ngo/listings/${listing.id}`}>
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Requirements */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Your Requirements</CardTitle>
            <Link href="/ngo/requests">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No active requirements</p>
                <Link href="/ngo/requests/new">
                  <Button variant="link" className="text-green-400 mt-2">
                    Create your first requirement
                  </Button>
                </Link>
              </div>
            ) : (
              requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{req.title}</h3>
                      <p className="text-sm text-gray-400">
                        Needed by: {new Date(req.neededBy).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getUrgencyColor(req.urgency)}>
                      {req.urgency}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {req.fulfilledKg || 0}/{req.quantityKg} kg
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${((req.fulfilledKg || 0) / req.quantityKg) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* NGO Network Banner */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                NGO Network
              </h3>
              <p className="text-gray-300 mt-1">
                Connect with other NGOs to share surplus food and coordinate distribution
              </p>
            </div>
            <Link href="/ngo/network">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                Explore Network
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
