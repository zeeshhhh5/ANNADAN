"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  Navigation,
  Route,
  Clock,
  Package,
  Phone,
  ExternalLink,
  Loader2,
  Locate,
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: "pickup" | "delivery" | "ngo" | "biogas" | "donor";
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  quantity?: number;
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timeRemaining?: string;
}

interface MapViewProps {
  locations: Location[];
  currentLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  onLocationSelect?: (location: Location) => void;
}

export function MapView({
  locations,
  currentLocation,
  showRoute = false,
  onLocationSelect,
}: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    currentLocation || null
  );
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<Location[]>([]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
          toast.success("Location updated!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
          setLoadingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation not supported");
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
  }, [currentLocation, getCurrentLocation]);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Optimize route using nearest neighbor algorithm
  const optimizeRoute = useCallback(() => {
    if (!userLocation || locations.length === 0) return;

    const unvisited = [...locations];
    const route: Location[] = [];
    let currentPos = userLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      unvisited.forEach((loc, index) => {
        const distance = calculateDistance(currentPos.lat, currentPos.lng, loc.lat, loc.lng);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      const nearest = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearest);
      currentPos = { lat: nearest.lat, lng: nearest.lng };
    }

    setOptimizedRoute(route);
    toast.success(`Route optimized! ${route.length} stops`);
  }, [userLocation, locations]);

  // Open Google Maps with directions
  const openGoogleMapsDirections = (destination: Location) => {
    const origin = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const dest = `${destination.lat},${destination.lng}`;
    const url = origin
      ? `https://www.google.com/maps/dir/${origin}/${dest}`
      : `https://www.google.com/maps/search/?api=1&query=${dest}`;
    window.open(url, "_blank");
  };

  // Open Google Maps with full route
  const openFullRoute = () => {
    if (!userLocation || optimizedRoute.length === 0) return;

    const waypoints = optimizedRoute.map((loc) => `${loc.lat},${loc.lng}`).join("/");
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${waypoints}`;
    window.open(url, "_blank");
  };

  const getTypeColor = (type: Location["type"]) => {
    const colors = {
      pickup: "bg-green-500",
      delivery: "bg-blue-500",
      ngo: "bg-purple-500",
      biogas: "bg-orange-500",
      donor: "bg-yellow-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getUrgencyColor = (urgency?: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-500/10 text-gray-400",
      MEDIUM: "bg-yellow-500/10 text-yellow-400",
      HIGH: "bg-orange-500/10 text-orange-400",
      CRITICAL: "bg-red-500/10 text-red-400",
    };
    return colors[urgency || "MEDIUM"];
  };

  return (
    <div className="space-y-4">
      {/* Map Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              Route Map
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="border-gray-700 text-gray-300"
              >
                {loadingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Locate className="w-4 h-4" />
                )}
              </Button>
              {showRoute && locations.length > 1 && (
                <Button
                  size="sm"
                  onClick={optimizeRoute}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Route className="w-4 h-4 mr-1" />
                  Optimize
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder - In production, integrate with Leaflet or Google Maps */}
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400">Interactive Map</p>
                <p className="text-sm text-gray-500">{locations.length} locations</p>
                {userLocation && (
                  <p className="text-xs text-gray-600 mt-1">
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Location markers visualization */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {locations.slice(0, 5).map((loc, index) => (
                <div
                  key={loc.id}
                  className={`w-8 h-8 rounded-full ${getTypeColor(loc.type)} flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-110 transition-transform`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    onLocationSelect?.(loc);
                  }}
                >
                  {index + 1}
                </div>
              ))}
              {locations.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                  +{locations.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Open in Google Maps */}
          {optimizedRoute.length > 0 && (
            <Button
              onClick={openFullRoute}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Full Route in Google Maps
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Location List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            {optimizedRoute.length > 0 ? "Optimized Route" : "Locations"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(optimizedRoute.length > 0 ? optimizedRoute : locations).map((location, index) => (
            <div
              key={location.id}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedLocation?.id === location.id
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600"
              }`}
              onClick={() => {
                setSelectedLocation(location);
                onLocationSelect?.(location);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${getTypeColor(location.type)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{location.name}</h4>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {location.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {location.quantity && (
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {location.quantity} kg
                        </span>
                      )}
                      {location.timeRemaining && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Clock className="w-3 h-3" />
                          {location.timeRemaining}
                        </span>
                      )}
                      {userLocation && (
                        <span>
                          {calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            location.lat,
                            location.lng
                          ).toFixed(1)}{" "}
                          km
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {location.urgency && (
                    <Badge className={getUrgencyColor(location.urgency)}>
                      {location.urgency}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action buttons when selected */}
              {selectedLocation?.id === location.id && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMapsDirections(location);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  {location.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${location.phone}`, "_self");
                      }}
                      className="border-gray-700 text-gray-300"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple location picker for forms
export function LocationPicker({
  onLocationSelect,
  initialLocation,
}: {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}) {
  const [location, setLocation] = useState(initialLocation || null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(initialLocation?.address || "");

  const getCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocoding would go here in production
          const addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          setLocation({ lat, lng, address: addr });
          setAddress(addr);
          onLocationSelect({ lat, lng, address: addr });
          setLoading(false);
          toast.success("Location captured!");
        },
        (error) => {
          toast.error("Could not get location");
          setLoading(false);
        }
      );
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (location) {
      onLocationSelect({ ...location, address: newAddress });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter address or use current location"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>
        <Button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          variant="outline"
          className="border-gray-700"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Locate className="w-4 h-4" />
          )}
        </Button>
      </div>
      {location && (
        <p className="text-xs text-gray-500">
          Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
