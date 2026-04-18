"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HandHeart,
  Package,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface Distribution {
  id: string;
  listingTitle: string;
  quantityKg: number;
  beneficiariesServed: number;
  location: string;
  distributedAt: string;
  status: "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";
}

export default function DistributionPage() {
  const [distributions] = useState<Distribution[]>([
    {
      id: "1",
      listingTitle: "Biryani - 50 servings",
      quantityKg: 25,
      beneficiariesServed: 50,
      location: "Community Center, Sector 15",
      distributedAt: new Date().toISOString(),
      status: "COMPLETED",
    },
    {
      id: "2",
      listingTitle: "Fresh Vegetables Mix",
      quantityKg: 15,
      beneficiariesServed: 30,
      location: "Night Shelter, Mayur Vihar",
      distributedAt: new Date(Date.now() - 86400000).toISOString(),
      status: "COMPLETED",
    },
    {
      id: "3",
      listingTitle: "Cooked Rice & Dal",
      quantityKg: 20,
      beneficiariesServed: 0,
      location: "School, Laxmi Nagar",
      distributedAt: new Date(Date.now() + 86400000).toISOString(),
      status: "SCHEDULED",
    },
  ]);

  const stats = {
    totalDistributions: distributions.length,
    totalKg: distributions.filter(d => d.status === "COMPLETED").reduce((sum, d) => sum + d.quantityKg, 0),
    totalBeneficiaries: distributions.reduce((sum, d) => sum + d.beneficiariesServed, 0),
    thisMonth: distributions.filter(d => d.status === "COMPLETED").length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
      IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return colors[status] || colors.SCHEDULED;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Distribution</h1>
          <p className="text-gray-400 mt-1">Track food distribution activities</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <HandHeart className="w-4 h-4 mr-2" />
          Log Distribution
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Distributions</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalDistributions}</p>
              </div>
              <HandHeart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Food Distributed</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalKg} kg</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">People Served</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalBeneficiaries}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.thisMonth}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Distribution History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributions.map((dist) => (
              <div
                key={dist.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{dist.listingTitle}</h3>
                    <Badge className={getStatusColor(dist.status)}>{dist.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {dist.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {dist.beneficiariesServed} served
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dist.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(dist.distributedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
