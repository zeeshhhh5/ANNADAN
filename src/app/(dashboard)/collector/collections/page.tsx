"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  Filter,
} from "lucide-react";

interface Collection {
  id: string;
  listingTitle: string;
  donorName: string;
  quantityKg: number;
  pickupAddress: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED";
  scheduledAt: string;
  completedAt?: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data
    setCollections([
      {
        id: "1",
        listingTitle: "Biryani - 50 servings",
        donorName: "Grand Hotel",
        quantityKg: 25,
        pickupAddress: "123 Main St, Sector 15",
        status: "COMPLETED",
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 82800000).toISOString(),
      },
      {
        id: "2",
        listingTitle: "Fresh Vegetables",
        donorName: "City Restaurant",
        quantityKg: 15,
        pickupAddress: "456 Market Rd, Mayur Vihar",
        status: "IN_TRANSIT",
        scheduledAt: new Date().toISOString(),
      },
      {
        id: "3",
        listingTitle: "Cooked Rice",
        donorName: "Hotel Paradise",
        quantityKg: 20,
        pickupAddress: "789 Food St, Laxmi Nagar",
        status: "PENDING",
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      IN_TRANSIT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      DELIVERED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return colors[status] || colors.PENDING;
  };

  const filteredCollections = filter === "all" 
    ? collections 
    : collections.filter(c => c.status === filter);

  const stats = {
    total: collections.length,
    completed: collections.filter(c => c.status === "COMPLETED").length,
    inProgress: collections.filter(c => ["PENDING", "IN_TRANSIT"].includes(c.status)).length,
    totalKg: collections.filter(c => c.status === "COMPLETED").reduce((sum, c) => sum + c.quantityKg, 0),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 bg-gray-800" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Collections</h1>
          <p className="text-gray-400 mt-1">Track your pickup history</p>
        </div>
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
                <p className="text-3xl font-bold text-white mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Food Collected</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalKg} kg</p>
              </div>
              <Package className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "PENDING", "IN_TRANSIT", "COMPLETED"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? "bg-green-500" : "border-gray-700 text-gray-300"}
          >
            {f === "all" ? "All" : f.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Collections List */}
      <div className="space-y-4">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{collection.listingTitle}</h3>
                    <Badge className={getStatusColor(collection.status)}>{collection.status}</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">From: {collection.donorName}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {collection.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {collection.pickupAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(collection.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {collection.status === "PENDING" && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Start Pickup
                    </Button>
                  )}
                  {collection.status === "IN_TRANSIT" && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Mark Delivered
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
