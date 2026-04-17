"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import {
  Search,
  Package,
  Clock,
  MapPin,
  Heart,
  Building2,
  ArrowRight,
  Phone,
} from "lucide-react";

export function BeneficiaryDashboard() {
  const [availableFood] = useState([
    {
      id: "1",
      title: "Biryani - Fresh",
      ngoName: "Food For All NGO",
      servings: 50,
      distance: "1.5 km",
      availableUntil: "6:00 PM",
      isVegetarian: false,
    },
    {
      id: "2",
      title: "Vegetable Rice & Dal",
      ngoName: "Helping Hands",
      servings: 30,
      distance: "2.0 km",
      availableUntil: "7:00 PM",
      isVegetarian: true,
    },
    {
      id: "3",
      title: "Bread & Butter",
      ngoName: "City Care Foundation",
      servings: 100,
      distance: "3.5 km",
      availableUntil: "8:00 PM",
      isVegetarian: true,
    },
  ]);

  const [nearbyNGOs] = useState([
    {
      id: "1",
      name: "Food For All NGO",
      address: "123 Main Street, City Center",
      phone: "+91 98765 43210",
      distance: "1.5 km",
      mealsToday: 150,
    },
    {
      id: "2",
      name: "Helping Hands Foundation",
      address: "456 Park Road, Downtown",
      phone: "+91 98765 43211",
      distance: "2.0 km",
      mealsToday: 80,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Find Food Near You</h1>
          <p className="text-gray-400 mt-1">
            Browse available food and connect with NGOs
          </p>
        </div>
        <Link href="/beneficiary/search">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Search className="w-4 h-4 mr-2" />
            Search Food
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Available Now"
          value={12}
          description="Food listings nearby"
          icon={Package}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Your Requests"
          value={3}
          description="Pending requests"
          icon={Clock}
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="Nearby NGOs"
          value={8}
          description="Within 5 km"
          icon={Building2}
          iconColor="text-blue-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Food */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Available Food</CardTitle>
            <Link href="/beneficiary/search">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableFood.map((food) => (
              <div
                key={food.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{food.title}</h3>
                      {food.isVegetarian && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Veg
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{food.ngoName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {food.servings} servings
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {food.distance}
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <Clock className="w-4 h-4" />
                    Until {food.availableUntil}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Request
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nearby NGOs */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Nearby NGOs</CardTitle>
            <Link href="/beneficiary/ngos">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{ngo.name}</h3>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ngo.address}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {ngo.phone}
                    </p>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {ngo.distance}
                  </Badge>
                </div>
                <div className="mt-3 p-2 bg-green-500/10 rounded text-center">
                  <p className="text-sm text-green-400">
                    🍽️ {ngo.mealsToday} meals distributed today
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Help Banner */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Need Immediate Help?</h3>
              <p className="text-gray-300 mt-1">
                Contact our helpline for emergency food assistance
              </p>
              <p className="text-green-400 font-medium mt-2 text-lg">
                📞 1800-XXX-XXXX (Toll Free)
              </p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
