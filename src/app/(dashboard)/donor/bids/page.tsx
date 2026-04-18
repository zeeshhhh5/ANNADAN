"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Gavel,
  Package,
  Clock,
  User,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  bidderRole: string;
  bidderOrganization?: string;
  message?: string;
  status: string;
  isUrgent: boolean;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    category: string;
    quantityKg: number;
    status: string;
    bestBefore: string;
    address: string;
  } | null;
}

export default function DonorBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const fetchBids = useCallback(async () => {
    try {
      const res = await fetch("/api/bids", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBids(data.data);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error("Failed to load bids");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const handleBidAction = async (bidId: string, action: "accept" | "reject") => {
    setProcessing(bidId);
    try {
      const res = await fetch("/api/bids", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId, action }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(action === "accept" ? "Bid accepted!" : "Bid rejected");
        fetchBids();
      } else {
        toast.error(data.error || "Failed to process bid");
      }
    } catch (error) {
      console.error("Error processing bid:", error);
      toast.error("Failed to process bid");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
      REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return colors[status] || colors.PENDING;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "NGO":
        return <Building2 className="w-4 h-4" />;
      case "COLLECTOR":
        return <Package className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredBids = bids.filter((bid) => {
    if (filter === "all") return true;
    return bid.status === filter.toUpperCase();
  });

  const pendingCount = bids.filter((b) => b.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Gavel className="w-8 h-8 text-yellow-400" />
              Manage Bids
            </h1>
            <p className="text-gray-400 mt-1">
              Review and respond to bids on your listings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchBids()}
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "bg-green-500 hover:bg-green-600"
                : "border-gray-700 text-gray-400 hover:text-white"
            }
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <Badge className="ml-2 bg-yellow-500/20 text-yellow-400">
                {pendingCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                  <Skeleton className="h-4 w-2/3 bg-gray-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBids.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Gavel className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No bids found</h3>
              <p className="text-gray-400">
                {filter === "all"
                  ? "You haven't received any bids yet"
                  : `No ${filter} bids`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBids.map((bid) => (
            <Card key={bid.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Bid Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {bid.bidderName}
                          </h3>
                          <Badge className={getStatusColor(bid.status)}>
                            {bid.status}
                          </Badge>
                          {bid.isUrgent && (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          {getRoleIcon(bid.bidderRole)}
                          <span>{bid.bidderRole}</span>
                          {bid.bidderOrganization && (
                            <>
                              <span>•</span>
                              <span>{bid.bidderOrganization}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Listing Info */}
                    {bid.listing && (
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Listing</p>
                            <p className="text-white font-medium">{bid.listing.title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Quantity</p>
                            <p className="text-white font-medium">{bid.listing.quantityKg} kg</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {bid.message && (
                      <div className="flex items-start gap-2 p-3 bg-gray-800/30 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-gray-300 text-sm">{bid.message}</p>
                      </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        Received {new Date(bid.createdAt).toLocaleDateString()} at{" "}
                        {new Date(bid.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {bid.status === "PENDING" && (
                    <div className="flex gap-2 lg:flex-col">
                      <Button
                        onClick={() => handleBidAction(bid.id, "accept")}
                        disabled={processing === bid.id}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleBidAction(bid.id, "reject")}
                        disabled={processing === bid.id}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
