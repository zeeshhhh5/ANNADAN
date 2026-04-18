"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  User,
  Navigation,
  MessageCircle,
  ArrowLeft,
  Leaf,
} from "lucide-react";
import Link from "next/link";

// Mock data for shared items
const mockData: Record<string, Record<string, any>> = {
  listing: {
    "1": {
      id: "1",
      title: "Fresh Biryani - 50 servings",
      description: "Freshly prepared vegetable biryani from a wedding event. Best consumed within 4 hours.",
      quantity: 25,
      category: "COOKED_FOOD",
      location: {
        lat: 17.4239,
        lng: 78.4738,
        address: "Jubilee Hills, Hyderabad, Telangana",
      },
      contact: {
        name: "Taj Catering",
        phone: "+919876543210",
      },
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      carbonCredits: 2.5,
    },
  },
  pickup: {
    "1": {
      id: "1",
      title: "Vegetable Waste Collection",
      description: "Organic vegetable waste from restaurant. Ready for pickup.",
      quantity: 50,
      location: {
        lat: 17.4156,
        lng: 78.4347,
        address: "Banjara Hills, Hyderabad, Telangana",
      },
      contact: {
        name: "Green Restaurant",
        phone: "+919876543211",
      },
      carbonCredits: 5.0,
    },
  },
  donation: {
    "1": {
      id: "1",
      title: "Monthly Food Donation",
      description: "Regular monthly donation of surplus food items.",
      quantity: 100,
      mealsProvided: 400,
      carbonCredits: 10.0,
      donor: "ABC Corporation",
    },
  },
};

export default function SharePage() {
  const params = useParams();
  const type = params.type as string;
  const id = params.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from API
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const item = mockData[type]?.[id];
      setData(item || null);
      setLoading(false);
    };
    fetchData();
  }, [type, id]);

  const handleOpenMaps = () => {
    if (!data?.location) return;
    const { lat, lng } = data.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleWhatsApp = () => {
    if (!data?.contact?.phone) return;
    const phone = data.contact.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi, I'm interested in "${data.title}" listed on AnnaDaan.\n\nLocation: ${data.location?.address || "N/A"}\nQuantity: ${data.quantity} kg`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    if (!data?.contact?.phone) return;
    window.open(`tel:${data.contact.phone}`, "_self");
  };

  const getTimeRemaining = (expiresAt: string) => {
    const hours = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));
    if (hours === 0) return "< 1 hour";
    if (hours < 24) return `${hours} hours`;
    return `${Math.floor(hours / 24)} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Item Not Found</h2>
            <p className="text-gray-400 mb-6">
              This item may have been removed or is no longer available.
            </p>
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600">
                Go to AnnaDaan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
            {type.toUpperCase()}
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
              <Leaf className="w-4 h-4" />
              AnnaDaan
            </div>
            <CardTitle className="text-white text-xl">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            {data.description && (
              <p className="text-gray-400">{data.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {data.quantity && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-lg font-bold text-white">{data.quantity} kg</p>
                </div>
              )}
              {data.mealsProvided && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500">Meals</p>
                  <p className="text-lg font-bold text-white">{data.mealsProvided}</p>
                </div>
              )}
              {data.carbonCredits && (
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <p className="text-xs text-green-400">Carbon Credits</p>
                  <p className="text-lg font-bold text-green-400">{data.carbonCredits}</p>
                </div>
              )}
              {data.expiresAt && (
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <p className="text-xs text-orange-400">Time Left</p>
                  <p className="text-lg font-bold text-orange-400">
                    {getTimeRemaining(data.expiresAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            {data.location && (
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">{data.location.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {data.contact && (
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">{data.contact.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{data.contact.phone}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {data.location && (
                <Button
                  onClick={handleOpenMaps}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              )}
              
              {data.contact?.phone && (
                <>
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message on WhatsApp
                  </Button>
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Shared via AnnaDaan</p>
          <p className="text-xs mt-1">Reducing food waste, one meal at a time</p>
        </div>
      </div>
    </div>
  );
}
