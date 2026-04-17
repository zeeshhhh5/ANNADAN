"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
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
} from "lucide-react";

export function NGODashboard() {
  const [matchedListings] = useState([
    {
      id: "1",
      title: "Biryani - 50 servings",
      donorName: "Grand Hotel",
      quantityKg: 25,
      distance: "2.5 km",
      hoursRemaining: 4,
      matchScore: 95,
    },
    {
      id: "2",
      title: "Fresh Vegetables Mix",
      donorName: "City Restaurant",
      quantityKg: 15,
      distance: "3.2 km",
      hoursRemaining: 12,
      matchScore: 88,
    },
  ]);

  const [activeRequirements] = useState([
    {
      id: "1",
      title: "Cooked Meals for Evening Distribution",
      category: "COOKED_MEALS",
      quantityKg: 50,
      urgency: "HIGH",
      neededBy: "Today 6 PM",
      fulfilledKg: 25,
    },
    {
      id: "2",
      title: "Fruits for Children's Home",
      category: "FRUITS",
      quantityKg: 20,
      urgency: "MEDIUM",
      neededBy: "Tomorrow",
      fulfilledKg: 0,
    },
  ]);

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[urgency] || colors.MEDIUM;
  };

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
        {/* AI Matched Listings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-green-400">✨</span>
              AI Matched Listings
            </CardTitle>
            <Link href="/ngo/listings">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchedListings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{listing.title}</h3>
                    <p className="text-sm text-gray-400">{listing.donorName}</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    {listing.matchScore}% match
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {listing.quantityKg} kg
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {listing.hoursRemaining}h left
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Place Bid
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Requirements */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Your Requirements</CardTitle>
            <Link href="/ngo/requirements">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRequirements.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{req.title}</h3>
                    <p className="text-sm text-gray-400">Needed by: {req.neededBy}</p>
                  </div>
                  <Badge className={getUrgencyColor(req.urgency)}>
                    {req.urgency}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {req.fulfilledKg}/{req.quantityKg} kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(req.fulfilledKg / req.quantityKg) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
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
