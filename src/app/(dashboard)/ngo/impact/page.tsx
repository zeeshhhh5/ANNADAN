"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Download,
  Share2,
} from "lucide-react";

export default function NGOImpactPage() {
  const stats = {
    totalBeneficiaries: 850,
    mealsDistributed: 12450,
    foodCollectedKg: 3200,
    activeVolunteers: 45,
    distributionPoints: 12,
    monthlyGrowth: 15,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Impact Report</h1>
          <p className="text-gray-400 mt-1">Your organization&apos;s contribution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-800/50">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {stats.totalBeneficiaries.toLocaleString()}
            </h2>
            <p className="text-xl text-purple-300">Lives Touched</p>
            <p className="text-gray-400 mt-2">
              Through {stats.mealsDistributed.toLocaleString()} meals distributed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Food Collected</p>
                <p className="text-3xl font-bold text-white">{stats.foodCollectedKg.toLocaleString()} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Volunteers</p>
                <p className="text-3xl font-bold text-white">{stats.activeVolunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Distribution Points</p>
                <p className="text-3xl font-bold text-white">{stats.distributionPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Monthly Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-400">+{stats.monthlyGrowth}%</div>
            <p className="text-gray-400">increase in beneficiaries served compared to last month</p>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {[65, 72, 68, 80, 75, 85, 90].map((value, i) => (
              <div key={i} className="text-center">
                <div
                  className="bg-green-500/20 rounded-t"
                  style={{ height: `${value}px` }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "500 Meals Milestone", date: "Today", icon: "🎉" },
              { title: "New Distribution Point Added", date: "2 days ago", icon: "📍" },
              { title: "10 New Volunteers Joined", date: "1 week ago", icon: "👥" },
              { title: "Partnership with City Restaurant", date: "2 weeks ago", icon: "🤝" },
            ].map((achievement, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-white">{achievement.title}</p>
                  <p className="text-sm text-gray-400">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
