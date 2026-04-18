"use client";

import { useState } from "react";
import { MapView } from "@/components/map-view";
import { QRCodeGenerator } from "@/components/qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Navigation,
  Route,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  Play,
  ExternalLink,
} from "lucide-react";

// Mock pickup locations
const mockLocations = [
  {
    id: "1",
    name: "Grand Hotel - Biryani",
    type: "pickup" as const,
    lat: 17.4239,
    lng: 78.4738,
    address: "Jubilee Hills, Hyderabad",
    phone: "+919876543210",
    quantity: 25,
    urgency: "HIGH" as const,
    timeRemaining: "2h left",
  },
  {
    id: "2",
    name: "City Restaurant - Vegetables",
    type: "pickup" as const,
    lat: 17.4156,
    lng: 78.4347,
    address: "Banjara Hills, Hyderabad",
    phone: "+919876543211",
    quantity: 15,
    urgency: "MEDIUM" as const,
    timeRemaining: "6h left",
  },
  {
    id: "3",
    name: "Sweet Corner - Bakery Items",
    type: "pickup" as const,
    lat: 17.4401,
    lng: 78.4489,
    address: "Madhapur, Hyderabad",
    phone: "+919876543212",
    quantity: 10,
    urgency: "LOW" as const,
    timeRemaining: "4h left",
  },
  {
    id: "4",
    name: "Food For All NGO",
    type: "delivery" as const,
    lat: 17.4312,
    lng: 78.4125,
    address: "Ameerpet, Hyderabad",
    phone: "+919876543213",
    quantity: 50,
    timeRemaining: "Delivery Point",
  },
  {
    id: "5",
    name: "Green Biogas Plant",
    type: "biogas" as const,
    lat: 17.4567,
    lng: 78.3912,
    address: "Kukatpally, Hyderabad",
    phone: "+919876543214",
    quantity: 100,
    timeRemaining: "Biogas Plant",
  },
];

export default function CollectorRoutePage() {
  const [selectedPickup, setSelectedPickup] = useState<typeof mockLocations[0] | null>(null);
  const [routeStarted, setRouteStarted] = useState(false);
  const [completedPickups, setCompletedPickups] = useState<string[]>([]);

  const handleStartRoute = () => {
    setRouteStarted(true);
    toast.success("Route started! Follow the optimized path.");
  };

  const handleCompletePickup = (id: string) => {
    setCompletedPickups([...completedPickups, id]);
    toast.success("Pickup marked as complete!");
  };

  const openGoogleMapsRoute = () => {
    const waypoints = mockLocations
      .filter(loc => !completedPickups.includes(loc.id))
      .map(loc => `${loc.lat},${loc.lng}`)
      .join("/");
    
    // Get user's current location or use first pickup as origin
    const url = `https://www.google.com/maps/dir/Current+Location/${waypoints}`;
    window.open(url, "_blank");
  };

  const activeLocations = mockLocations.filter(loc => !completedPickups.includes(loc.id));
  const totalQuantity = activeLocations.reduce((sum, loc) => sum + (loc.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Route Planner</h1>
          <p className="text-gray-400 mt-1">
            Optimize your pickup route and navigate efficiently
          </p>
        </div>
        <div className="flex gap-2">
          {!routeStarted ? (
            <Button
              onClick={handleStartRoute}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Route
            </Button>
          ) : (
            <Button
              onClick={openGoogleMapsRoute}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Google Maps
            </Button>
          )}
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeLocations.length}</p>
                <p className="text-xs text-gray-400">Stops Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalQuantity} kg</p>
                <p className="text-xs text-gray-400">Total to Collect</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completedPickups.length}</p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">~45 min</p>
                <p className="text-xs text-gray-400">Est. Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView
            locations={activeLocations}
            showRoute={true}
            onLocationSelect={(loc) => setSelectedPickup(loc as typeof mockLocations[0])}
          />
        </div>

        {/* Selected Pickup Details / QR Code */}
        <div className="space-y-4">
          {selectedPickup ? (
            <>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{selectedPickup.name}</CardTitle>
                    {selectedPickup.urgency && (
                      <Badge
                        className={
                          selectedPickup.urgency === "HIGH"
                            ? "bg-red-500/10 text-red-400"
                            : selectedPickup.urgency === "MEDIUM"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }
                      >
                        {selectedPickup.urgency}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {selectedPickup.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Package className="w-4 h-4" />
                      {selectedPickup.quantity} kg
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-400">
                      <Clock className="w-4 h-4" />
                      {selectedPickup.timeRemaining}
                    </div>
                  </div>

                  {routeStarted && !completedPickups.includes(selectedPickup.id) && (
                    <Button
                      onClick={() => handleCompletePickup(selectedPickup.id)}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* QR Code for selected pickup */}
              <QRCodeGenerator
                data={{
                  type: "pickup",
                  id: selectedPickup.id,
                  title: selectedPickup.name,
                  description: `Pickup ${selectedPickup.quantity}kg from ${selectedPickup.address}`,
                  location: {
                    lat: selectedPickup.lat,
                    lng: selectedPickup.lng,
                    address: selectedPickup.address,
                  },
                  contact: selectedPickup.phone
                    ? { name: selectedPickup.name, phone: selectedPickup.phone }
                    : undefined,
                  quantity: selectedPickup.quantity,
                }}
              />
            </>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <Truck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Select a location to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
