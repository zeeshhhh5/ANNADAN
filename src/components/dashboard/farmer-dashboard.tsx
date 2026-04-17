"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "./stats-card";
import {
  Sprout,
  Package,
  TrendingUp,
  ArrowRight,
  Calculator,
  Gavel,
  ShoppingCart,
  Leaf,
  IndianRupee,
} from "lucide-react";

export function FarmerDashboard() {
  const [availableWaste] = useState([
    {
      id: "1",
      title: "Vegetable Waste - Mixed",
      collectorName: "Green Collectors",
      wasteKg: 100,
      pricePerKg: 2,
      distance: "5 km",
      bidsCount: 3,
    },
    {
      id: "2",
      title: "Fruit Peels & Scraps",
      collectorName: "City Waste Solutions",
      wasteKg: 75,
      pricePerKg: 2.5,
      distance: "8 km",
      bidsCount: 2,
    },
    {
      id: "3",
      title: "Kitchen Organic Waste",
      collectorName: "Eco Collectors",
      wasteKg: 150,
      pricePerKg: 1.5,
      distance: "12 km",
      bidsCount: 5,
    },
  ]);

  const [roiData] = useState({
    organicCostPerKg: 2,
    chemicalCostPerKg: 25,
    monthlySavings: 4500,
    totalPurchased: 500,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Farmer Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Purchase organic waste and track your composting ROI
          </p>
        </div>
        <Link href="/farmer/marketplace">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Browse Marketplace
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Bids"
          value={8}
          icon={Gavel}
          iconColor="text-yellow-400"
        />
        <StatsCard
          title="Waste Purchased"
          value={`${roiData.totalPurchased} kg`}
          description="This month"
          icon={Package}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Monthly Savings"
          value={`₹${roiData.monthlySavings}`}
          description="vs chemical fertilizers"
          icon={TrendingUp}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Compost Produced"
          value="150 kg"
          icon={Sprout}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Waste */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Available Organic Waste</CardTitle>
            <Link href="/farmer/marketplace">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableWaste.map((waste) => (
              <div
                key={waste.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{waste.title}</h3>
                    <p className="text-sm text-gray-400">{waste.collectorName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {waste.wasteKg} kg
                      </span>
                      <span className="flex items-center gap-1 text-green-400">
                        <IndianRupee className="w-4 h-4" />
                        {waste.pricePerKg}/kg
                      </span>
                      <span>{waste.distance}</span>
                      <span className="flex items-center gap-1">
                        <Gavel className="w-4 h-4" />
                        {waste.bidsCount} bids
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Place Bid
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-400" />
                ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Organic Waste Cost</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{roiData.organicCostPerKg}/kg
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Chemical Fertilizer Cost</p>
                <p className="text-2xl font-bold text-red-400">
                  ₹{roiData.chemicalCostPerKg}/kg
                </p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-300">Your Savings</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round(((roiData.chemicalCostPerKg - roiData.organicCostPerKg) / roiData.chemicalCostPerKg) * 100)}%
                </p>
                <p className="text-sm text-green-300 mt-1">
                  ₹{roiData.monthlySavings} saved this month
                </p>
              </div>
              <Link href="/farmer/roi" className="block">
                <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
                  Full ROI Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Compost Tracker */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                Active Compost Batches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white">Batch #12</span>
                  <Badge className="bg-yellow-500/10 text-yellow-400">Day 15</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">50%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white">Batch #11</span>
                  <Badge className="bg-green-500/10 text-green-400">Day 28</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">93%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[93%]" />
                  </div>
                </div>
              </div>
              <Link href="/farmer/compost" className="block">
                <Button variant="ghost" className="w-full text-green-400 hover:text-green-300">
                  View All Batches
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sustainability Banner */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                Sustainability Impact
              </h3>
              <p className="text-gray-300 mt-1">
                By using organic waste, you&apos;ve prevented 1.2 tonnes of CO₂ emissions this year
              </p>
            </div>
            <Link href="/farmer/impact">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                View Full Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
