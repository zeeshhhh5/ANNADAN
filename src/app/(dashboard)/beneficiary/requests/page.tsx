"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Package,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

interface Request {
  id: string;
  ngoName: string;
  foodType: string;
  quantityKg: number;
  status: "PENDING" | "APPROVED" | "FULFILLED" | "REJECTED";
  requestedAt: string;
  scheduledPickup?: string;
  location: string;
}

export default function BeneficiaryRequestsPage() {
  const [requests] = useState<Request[]>([
    {
      id: "1",
      ngoName: "Food For All NGO",
      foodType: "Cooked Meals",
      quantityKg: 5,
      status: "APPROVED",
      requestedAt: new Date().toISOString(),
      scheduledPickup: new Date(Date.now() + 3600000).toISOString(),
      location: "Community Center, Sector 15",
    },
    {
      id: "2",
      ngoName: "Helping Hands",
      foodType: "Groceries",
      quantityKg: 10,
      status: "PENDING",
      requestedAt: new Date(Date.now() - 86400000).toISOString(),
      location: "Main Office, Mayur Vihar",
    },
    {
      id: "3",
      ngoName: "Care Foundation",
      foodType: "Cooked Meals",
      quantityKg: 3,
      status: "FULFILLED",
      requestedAt: new Date(Date.now() - 172800000).toISOString(),
      location: "Distribution Point, Laxmi Nagar",
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      FULFILLED: "bg-green-500/10 text-green-400 border-green-500/20",
      REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.PENDING;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "PENDING").length,
    approved: requests.filter(r => r.status === "APPROVED").length,
    fulfilled: requests.filter(r => r.status === "FULFILLED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Requests</h1>
          <p className="text-gray-400 mt-1">Track your food assistance requests</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Approved</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm">Fulfilled</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.fulfilled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{request.ngoName}</h3>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {request.foodType} - {request.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {request.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {request.status === "APPROVED" && request.scheduledPickup && (
                    <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-blue-400 text-sm">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Pickup scheduled: {new Date(request.scheduledPickup).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
