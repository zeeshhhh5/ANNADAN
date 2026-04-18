"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building2,
  DollarSign,
} from "lucide-react";

export default function AdminCarbonPage() {
  const stats = {
    totalCredits: 12450,
    tradedCredits: 8200,
    pendingCredits: 1500,
    marketValue: 1867500,
    avgPrice: 150,
    priceChange: 5,
  };

  const recentTrades = [
    { id: "1", buyer: "Tech Corp Ltd", seller: "Grand Hotel", amount: 100, price: 150, date: new Date().toISOString() },
    { id: "2", buyer: "Green Industries", seller: "City Restaurant", amount: 75, price: 148, date: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", buyer: "Eco Solutions", seller: "Hotel Paradise", amount: 50, price: 152, date: new Date(Date.now() - 172800000).toISOString() },
  ];

  const topEarners = [
    { name: "Grand Hotel", credits: 450, earnings: 67500 },
    { name: "City Restaurant", credits: 320, earnings: 48000 },
    { name: "Hotel Paradise", credits: 280, earnings: 42000 },
    { name: "Food Court Mall", credits: 200, earnings: 30000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Credits</h1>
          <p className="text-gray-400 mt-1">Monitor carbon credit marketplace</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Market
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Credits Generated</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalCredits.toLocaleString()}</p>
              </div>
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Credits Traded</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.tradedCredits.toLocaleString()}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Market Value</p>
                <p className="text-3xl font-bold text-white mt-1">₹{(stats.marketValue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.avgPrice}</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{stats.priceChange}% this week
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{trade.buyer}</span>
                    </div>
                    <p className="text-sm text-gray-400">from {trade.seller}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{trade.amount} credits</p>
                    <p className="text-sm text-green-400">₹{trade.amount * trade.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Earners */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Credit Earners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((earner, index) => (
                <div
                  key={earner.name}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                      index === 1 ? "bg-gray-400/20 text-gray-400" :
                      index === 2 ? "bg-orange-500/20 text-orange-400" :
                      "bg-gray-700 text-gray-500"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{earner.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{earner.credits} credits</p>
                    <p className="text-sm text-green-400">₹{earner.earnings.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
