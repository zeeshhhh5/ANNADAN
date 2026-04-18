"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections] = useState([
    {
      id: "1",
      listingTitle: "Biryani - 50 servings",
      collectorName: "Green Collectors",
      donorName: "Grand Hotel",
      quantityKg: 25,
      status: "COMPLETED",
      pickupTime: new Date(Date.now() - 3600000).toISOString(),
      deliveryTime: new Date().toISOString(),
    },
    {
      id: "2",
      listingTitle: "Fresh Vegetables",
      collectorName: "City Waste Co",
      donorName: "City Restaurant",
      quantityKg: 15,
      status: "IN_TRANSIT",
      pickupTime: new Date().toISOString(),
    },
    {
      id: "3",
      listingTitle: "Cooked Rice",
      collectorName: "Eco Collectors",
      donorName: "Hotel Paradise",
      quantityKg: 20,
      status: "PENDING",
      pickupTime: new Date(Date.now() + 3600000).toISOString(),
    },
  ]);

  const stats = {
    total: collections.length,
    completed: collections.filter((c) => c.status === "COMPLETED").length,
    inTransit: collections.filter((c) => c.status === "IN_TRANSIT").length,
    pending: collections.filter((c) => c.status === "PENDING").length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400",
      IN_TRANSIT: "bg-blue-500/10 text-blue-400",
      COMPLETED: "bg-green-500/10 text-green-400",
      FAILED: "bg-red-500/10 text-red-400",
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Collections</h1>
        <p className="text-gray-400 mt-1">Monitor all food collections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Collections</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Transit</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{stats.inTransit}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collections List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{collection.listingTitle}</h3>
                    <Badge className={getStatusColor(collection.status)}>{collection.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Collector: {collection.collectorName}</span>
                    <span>Donor: {collection.donorName}</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {collection.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(collection.pickupTime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
