"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface FoodRequest {
  id: string;
  title: string;
  category: string;
  quantityKg: number;
  urgency: string;
  status: string;
  neededBy: string;
  fulfilledKg: number;
  createdAt: string;
}

export default function NGORequestsPage() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/ngo/requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      PARTIALLY_FULFILLED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      FULFILLED: "bg-green-500/10 text-green-400 border-green-500/20",
      CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
      EXPIRED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return colors[status] || colors.OPEN;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-500/10 text-gray-400",
      MEDIUM: "bg-yellow-500/10 text-yellow-400",
      HIGH: "bg-orange-500/10 text-orange-400",
      CRITICAL: "bg-red-500/10 text-red-400",
    };
    return colors[urgency] || colors.MEDIUM;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48 bg-gray-800" />
          <Skeleton className="h-10 w-40 bg-gray-800" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Requests</h1>
          <p className="text-gray-400 mt-1">Manage your food requirements</p>
        </div>
        <Link href="/ngo/requests/new">
          <Button className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Requests Yet</h3>
            <p className="text-gray-400 mb-6">Create your first food requirement to get matched with donors</p>
            <Link href="/ngo/requests/new">
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {request.quantityKg} kg needed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        By {new Date(request.neededBy).toLocaleDateString()}
                      </span>
                    </div>
                    {request.status !== "FULFILLED" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{request.fulfilledKg}/{request.quantityKg} kg</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(request.fulfilledKg / request.quantityKg) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                      View Details
                    </Button>
                    {request.status === "OPEN" && (
                      <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
