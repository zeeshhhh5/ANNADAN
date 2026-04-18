"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  MapPin,
  Truck,
  Leaf,
  ShoppingCart,
} from "lucide-react";

interface WasteOrder {
  id: string;
  title: string;
  type: string;
  quantityKg: number;
  pricePerKg: number;
  location: string;
  distance: string;
  seller: string;
  quality: string;
}

export default function FarmerMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders] = useState<WasteOrder[]>([
    {
      id: "1",
      title: "Organic Food Waste",
      type: "FOOD_WASTE",
      quantityKg: 500,
      pricePerKg: 2,
      location: "Sector 15, Noida",
      distance: "5 km",
      seller: "Green Collectors",
      quality: "HIGH",
    },
    {
      id: "2",
      title: "Vegetable Scraps",
      type: "VEGETABLE_WASTE",
      quantityKg: 300,
      pricePerKg: 1.5,
      location: "Mayur Vihar, Delhi",
      distance: "8 km",
      seller: "City Waste Co",
      quality: "MEDIUM",
    },
    {
      id: "3",
      title: "Mixed Organic Waste",
      type: "MIXED",
      quantityKg: 1000,
      pricePerKg: 1,
      location: "Laxmi Nagar, Delhi",
      distance: "12 km",
      seller: "Eco Collectors",
      quality: "STANDARD",
    },
  ]);

  const getQualityColor = (quality: string) => {
    const colors: Record<string, string> = {
      HIGH: "bg-green-500/10 text-green-400",
      MEDIUM: "bg-yellow-500/10 text-yellow-400",
      STANDARD: "bg-gray-500/10 text-gray-400",
    };
    return colors[quality] || colors.STANDARD;
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Waste Marketplace</h1>
          <p className="text-gray-400 mt-1">Buy organic waste for composting</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search waste types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-800 text-white"
        />
      </div>

      {/* Available Waste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <Badge className={getQualityColor(order.quality)}>{order.quality}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{order.title}</h3>
              <p className="text-sm text-gray-400 mb-4">From: {order.seller}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white">{order.quantityKg} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price</span>
                  <span className="text-green-400">₹{order.pricePerKg}/kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-medium">₹{order.quantityKg * order.pricePerKg}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{order.location} ({order.distance})</span>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
