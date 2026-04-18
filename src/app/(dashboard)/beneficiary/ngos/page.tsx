"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Users,
  Search,
  Navigation,
  Star,
} from "lucide-react";

interface NGO {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  servicesOffered: string[];
  operatingHours: string;
  beneficiariesServed: number;
  isOpen: boolean;
}

export default function NearbyNGOsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ngos] = useState<NGO[]>([
    {
      id: "1",
      name: "Food For All Foundation",
      address: "123 Main Street, Sector 15, Noida",
      phone: "+91 98765 43210",
      distance: "1.2 km",
      rating: 4.8,
      servicesOffered: ["Daily Meals", "Groceries", "Emergency Food"],
      operatingHours: "9 AM - 6 PM",
      beneficiariesServed: 500,
      isOpen: true,
    },
    {
      id: "2",
      name: "Helping Hands NGO",
      address: "456 Market Road, Mayur Vihar, Delhi",
      phone: "+91 87654 32109",
      distance: "2.5 km",
      rating: 4.5,
      servicesOffered: ["Weekly Rations", "Cooked Meals"],
      operatingHours: "10 AM - 5 PM",
      beneficiariesServed: 350,
      isOpen: true,
    },
    {
      id: "3",
      name: "Care Foundation",
      address: "789 Food Street, Laxmi Nagar, Delhi",
      phone: "+91 76543 21098",
      distance: "3.8 km",
      rating: 4.2,
      servicesOffered: ["Emergency Food", "Monthly Supplies"],
      operatingHours: "8 AM - 4 PM",
      beneficiariesServed: 200,
      isOpen: false,
    },
  ]);

  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Nearby NGOs</h1>
          <p className="text-gray-400 mt-1">Find food assistance near you</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Navigation className="w-4 h-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search NGOs by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-800 text-white"
        />
      </div>

      {/* NGO List */}
      <div className="space-y-4">
        {filteredNGOs.map((ngo) => (
          <Card key={ngo.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{ngo.name}</h3>
                      <Badge className={ngo.isOpen ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}>
                        {ngo.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{ngo.rating}</span>
                      <span className="text-gray-500">• {ngo.beneficiariesServed} served</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ngo.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        {ngo.distance}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {ngo.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {ngo.operatingHours}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ngo.servicesOffered.map((service) => (
                        <Badge key={service} variant="outline" className="border-gray-700 text-gray-300">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    Request Food
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    Get Directions
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
