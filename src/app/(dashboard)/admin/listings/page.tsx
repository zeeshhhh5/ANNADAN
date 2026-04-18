"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Search,
  Clock,
  MapPin,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  donorName: string;
  category: string;
  quantityKg: number;
  status: string;
  bestBefore: string;
  createdAt: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        if (data.success) {
          setListings(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500/10 text-green-400",
      BIDDING: "bg-yellow-500/10 text-yellow-400",
      ASSIGNED: "bg-blue-500/10 text-blue-400",
      COLLECTED: "bg-purple-500/10 text-purple-400",
      DISTRIBUTED: "bg-emerald-500/10 text-emerald-400",
      EXPIRED: "bg-red-500/10 text-red-400",
      CANCELLED: "bg-gray-500/10 text-gray-400",
    };
    return colors[status] || colors.ACTIVE;
  };

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.donorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "ACTIVE").length,
    bidding: listings.filter((l) => l.status === "BIDDING").length,
    completed: listings.filter((l) => ["COLLECTED", "DISTRIBUTED"].includes(l.status)).length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">All Listings</h1>
        <p className="text-gray-400 mt-1">Monitor all food listings on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bidding</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.bidding}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">{stats.completed}</p>
              </div>
              <Package className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-800 text-white"
        />
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
                    <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>By: {listing.donorName || "Unknown"}</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {listing.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Expires: {new Date(listing.bestBefore).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {listing.status === "ACTIVE" && (
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                      <Ban className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
