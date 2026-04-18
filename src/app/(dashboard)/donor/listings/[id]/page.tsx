"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Users,
  Leaf,
  Calendar,
  Thermometer,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Building2,
  User,
  MessageSquare,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  description?: string;
  category: string;
  quantityKg: number;
  servings?: number;
  preparedAt: string;
  bestBefore: string;
  canFreeze: boolean;
  isVegetarian: boolean;
  allergens: string[];
  cuisineType?: string;
  images: string[];
  address: string;
  lat: number;
  lng: number;
  pickupInstructions?: string;
  status: string;
  carbonCredits?: number;
  bidCount: number;
  createdAt: string;
}

interface Bid {
  id: string;
  listingId: string;
  bidderName: string;
  bidderRole: string;
  bidderOrganization?: string;
  message?: string;
  status: string;
  isUrgent: boolean;
  createdAt: string;
  listing?: {
    id: string;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Fetch listing
      const listingsRes = await fetch(`/api/listings?donorId=me`, { cache: "no-store" });
      const listingsData = await listingsRes.json();
      
      if (listingsData.success) {
        const found = listingsData.data.find((l: Listing) => l.id === params.id);
        if (found) {
          setListing(found);
        }
      }

      // Fetch bids for this listing
      const bidsRes = await fetch(`/api/bids?listingId=${params.id}`, { cache: "no-store" });
      const bidsData = await bidsRes.json();
      
      if (bidsData.success) {
        setBids(bidsData.data.filter((b: Bid) => b.listing?.id === params.id) || bidsData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load listing details");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        fetchData();
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to cancel this listing?")) return;

    try {
      const res = await fetch(`/api/listings?id=${params.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Listing cancelled");
        router.push("/donor/listings");
      } else {
        toast.error(data.error || "Failed to cancel listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to cancel listing");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
      BIDDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      ASSIGNED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      COLLECTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      DISTRIBUTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
      REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.ACTIVE;
  };

  const getTimeRemaining = (bestBefore: string) => {
    const hours = Math.max(0, Math.floor((new Date(bestBefore).getTime() - Date.now()) / (1000 * 60 * 60)));
    if (hours === 0) return "Expired";
    if (hours < 24) return `${hours} hours`;
    return `${Math.floor(hours / 24)} days`;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 bg-gray-800" />
          <Skeleton className="h-8 w-64 bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full bg-gray-800 rounded-lg" />
            <Skeleton className="h-48 w-full bg-gray-800 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full bg-gray-800 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Listing Not Found</h2>
        <p className="text-gray-400 mb-6">This listing may have been removed or doesn&apos;t exist.</p>
        <Link href="/donor/listings">
          <Button>Back to Listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/donor/listings">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
              <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
            </div>
            <p className="text-gray-400 mt-1">
              Created {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {["ACTIVE", "BIDDING"].includes(listing.status) && (
            <>
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Details */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              {listing.images && listing.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {listing.images.map((img, idx) => (
                    <div key={idx} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                      <img src={img} alt={`${listing.title} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white">{listing.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Package className="w-4 h-4" />
                    Quantity
                  </div>
                  <p className="text-white font-medium">{listing.quantityKg} kg</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Servings
                  </div>
                  <p className="text-white font-medium">{listing.servings || "N/A"}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Time Left
                  </div>
                  <p className="text-white font-medium">{getTimeRemaining(listing.bestBefore)}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Leaf className="w-4 h-4" />
                    Carbon Credits
                  </div>
                  <p className="text-white font-medium">{listing.carbonCredits?.toFixed(1) || 0}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  {listing.category}
                </Badge>
                {listing.isVegetarian && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    Vegetarian
                  </Badge>
                )}
                {listing.canFreeze && (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    <Thermometer className="w-3 h-3 mr-1" />
                    Can Freeze
                  </Badge>
                )}
                {listing.allergens?.map((allergen) => (
                  <Badge key={allergen} className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {allergen}
                  </Badge>
                ))}
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Pickup Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white">{listing.address}</p>
                    {listing.pickupInstructions && (
                      <p className="text-gray-400 text-sm mt-1">{listing.pickupInstructions}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bids Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Bids
                {bids.length > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">{bids.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No bids yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Bids will appear here when NGOs or collectors show interest
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-white">{bid.bidderName}</h4>
                            <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
                            {bid.isUrgent && (
                              <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
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
                          {bid.message && (
                            <div className="flex items-start gap-2 mt-3 p-2 bg-gray-800/50 rounded">
                              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                              <p className="text-gray-300 text-sm">{bid.message}</p>
                            </div>
                          )}
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {bid.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleBidAction(bid.id, "accept")}
                              disabled={processing === bid.id}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBidAction(bid.id, "reject")}
                              disabled={processing === bid.id}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Bids</span>
                <span className="text-white font-medium">{bids.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending Bids</span>
                <span className="text-yellow-400 font-medium">
                  {bids.filter((b) => b.status === "PENDING").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Carbon Credits</span>
                <span className="text-green-400 font-medium">
                  {listing.carbonCredits?.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Est. Value</span>
                <span className="text-white font-medium">
                  ₹{((listing.carbonCredits || 0) * 150).toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">Created</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(listing.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">Best Before</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(listing.bestBefore).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
