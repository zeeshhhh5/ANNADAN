import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package } from "lucide-react";

export default async function NGOListingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "NGO") {
    redirect("/dashboard");
  }

  // Fetch available listings from API
  const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/listings`, {
    cache: "no-store",
  });

  const data = await response.json();
  const listings = data.success ? data.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Available Food Listings</h1>
        <p className="text-gray-400 mt-1">Browse available food donations</p>
      </div>

      {listings.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No listings available</h3>
            <p className="text-gray-400">Check back later for new food donations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing: any) => (
            <Card key={listing.id} className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{listing.title}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{listing.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {listing.category}
                      </Badge>
                      {listing.isVegetarian && (
                        <Badge className="bg-green-600">Vegetarian</Badge>
                      )}
                    </div>
                  </div>
                  <Badge className={listing.status === "ACTIVE" ? "bg-green-600" : "bg-blue-600"}>
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="text-white font-medium">{listing.quantityKg} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Servings</p>
                    <p className="text-white font-medium">{listing.servings || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Best Before</p>
                    <p className="text-white font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(listing.bestBefore).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-white font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {listing.address}
                    </p>
                  </div>
                </div>
                {listing.allergens && listing.allergens.length > 0 && (
                  <div className="mt-3">
                    <p className="text-gray-500 text-xs mb-1">Allergens:</p>
                    <div className="flex flex-wrap gap-1">
                      {listing.allergens.map((allergen: string) => (
                        <Badge key={allergen} variant="secondary" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <Button className="bg-green-600 hover:bg-green-700 w-full">
                    Request This Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
