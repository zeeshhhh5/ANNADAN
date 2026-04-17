"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  TrendingUp,
  ArrowRight,
  Navigation,
  HandHeart,
  Recycle,
  Leaf,
} from "lucide-react";

export function CollectorDashboard() {
  const [availablePickups] = useState([
    {
      id: "1",
      title: "Biryani - 50 servings",
      address: "Grand Hotel, MG Road",
      distance: "1.2 km",
      quantityKg: 25,
      hoursRemaining: 2,
      priority: "HIGH",
    },
    {
      id: "2",
      title: "Fresh Vegetables",
      address: "City Restaurant, Park Street",
      distance: "2.5 km",
      quantityKg: 15,
      hoursRemaining: 6,
      priority: "MEDIUM",
    },
    {
      id: "3",
      title: "Bakery Items",
      address: "Sweet Corner, Main Road",
      distance: "3.0 km",
      quantityKg: 10,
      hoursRemaining: 4,
      priority: "LOW",
    },
  ]);

  const [todayStats] = useState({
    pickupsCompleted: 5,
    kgCollected: 75,
    portionsDistributed: 120,
    biogasDelivered: 30,
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
      MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      LOW: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return colors[priority] || colors.MEDIUM;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Collector Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Manage pickups, distribute food, and track your impact
          </p>
        </div>
        <Link href="/collector/pickups">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Navigation className="w-4 h-4 mr-2" />
            Start Route
          </Button>
        </Link>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pickups Today"
          value={todayStats.pickupsCompleted}
          icon={Truck}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Kg Collected"
          value={todayStats.kgCollected}
          icon={Package}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Portions Distributed"
          value={todayStats.portionsDistributed}
          icon={HandHeart}
          iconColor="text-red-400"
        />
        <StatsCard
          title="Biogas Delivered"
          value={`${todayStats.biogasDelivered} kg`}
          icon={Recycle}
          iconColor="text-purple-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Pickups */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Available Pickups Nearby</CardTitle>
            <Link href="/collector/pickups">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View Map
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {availablePickups.map((pickup) => (
              <div
                key={pickup.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{pickup.title}</h3>
                      <Badge className={getPriorityColor(pickup.priority)}>
                        {pickup.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pickup.address}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        {pickup.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {pickup.quantityKg} kg
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <Clock className="w-4 h-4" />
                        {pickup.hoursRemaining}h left
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Accept
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
              <Link href="/collector/footpath" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <HandHeart className="w-4 h-4 mr-2 text-red-400" />
                  Log Footpath Distribution
                </Button>
              </Link>
              <Link href="/collector/waste" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Recycle className="w-4 h-4 mr-2 text-green-400" />
                  Create Waste Order
                </Button>
              </Link>
              <Link href="/collector/biogas" className="block">
                <Button variant="outline" className="w-full justify-start bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Leaf className="w-4 h-4 mr-2 text-emerald-400" />
                  Biogas Plant Delivery
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Impact Score */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Impact Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-white">847</p>
                <p className="text-gray-300 mt-2">Points this month</p>
                <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                  <p className="text-sm text-orange-300">
                    🏆 Rank #12 in your city
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Collections</span>
                  <span className="text-white">+250 pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Footpath Distribution</span>
                  <span className="text-white">+350 pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Biogas Deliveries</span>
                  <span className="text-white">+247 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Biogas Partnership Banner */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                Biogas Plant Partnership
              </h3>
              <p className="text-gray-300 mt-1">
                Deliver organic waste to biogas plants and earn carbon credits for every kg!
              </p>
              <p className="text-emerald-400 font-medium mt-2">
                Current rate: 0.5 credits per kg delivered
              </p>
            </div>
            <Link href="/collector/biogas">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Find Biogas Plants
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
