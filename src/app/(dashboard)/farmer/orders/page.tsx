"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";

export default function FarmerOrdersPage() {
  const [orders] = useState([
    {
      id: "1",
      title: "Organic Food Waste",
      seller: "Green Collectors",
      quantityKg: 500,
      totalPrice: 1000,
      status: "DELIVERED",
      orderedAt: new Date(Date.now() - 172800000).toISOString(),
      deliveredAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      title: "Vegetable Scraps",
      seller: "City Waste Co",
      quantityKg: 300,
      totalPrice: 450,
      status: "IN_TRANSIT",
      orderedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Mixed Organic Waste",
      seller: "Eco Collectors",
      quantityKg: 1000,
      totalPrice: 1000,
      status: "PENDING",
      orderedAt: new Date().toISOString(),
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400",
      IN_TRANSIT: "bg-blue-500/10 text-blue-400",
      DELIVERED: "bg-green-500/10 text-green-400",
      CANCELLED: "bg-red-500/10 text-red-400",
    };
    return colors[status] || colors.PENDING;
  };

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    inTransit: orders.filter((o) => o.status === "IN_TRANSIT").length,
    totalSpent: orders.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + o.totalPrice, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Orders</h1>
        <p className="text-gray-400 mt-1">Track your waste orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
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
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.delivered}</p>
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
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.totalSpent}</p>
              </div>
              <Package className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{order.title}</h3>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">From: {order.seller}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {order.quantityKg} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Ordered: {new Date(order.orderedAt).toLocaleDateString()}
                    </span>
                    {order.deliveredAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Delivered: {new Date(order.deliveredAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">₹{order.totalPrice}</p>
                  <Button variant="outline" size="sm" className="mt-2 border-gray-700 text-gray-300">
                    View Details
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
