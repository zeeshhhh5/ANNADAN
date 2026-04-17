import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Package, Truck } from "lucide-react";

export default async function CollectorPickupsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "COLLECTOR") {
    redirect("/dashboard");
  }

  // Fetch available pickups from API
  const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/collector/pickups`, {
    cache: "no-store",
  });

  const data = await response.json();
  const availablePickups = data.success ? data.data : [];
  const myCollections = data.success ? data.myCollections : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Available Pickups</h1>
        <p className="text-gray-400 mt-1">Claim and manage food collection pickups</p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">My Active Collections</h2>
          {myCollections.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-gray-400">No active collections</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myCollections.map((collection: any) => (
                <Card key={collection.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Collection #{collection.id.slice(-6)}</CardTitle>
                      <Badge className={collection.status === "SCHEDULED" ? "bg-blue-600" : "bg-green-600"}>
                        {collection.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Scheduled</p>
                        <p className="text-white font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(collection.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      {collection.completedAt && (
                        <div>
                          <p className="text-gray-500">Completed</p>
                          <p className="text-white font-medium">{new Date(collection.completedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Available for Pickup</h2>
          {availablePickups.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No pickups available</h3>
                <p className="text-gray-400">Check back later for new food donations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {availablePickups.map((listing: any) => (
                <Card key={listing.id} className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{listing.title}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{listing.description}</p>
                      </div>
                      <Badge className="bg-green-600">{listing.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="text-white font-medium">{listing.quantityKg} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Best Before</p>
                        <p className="text-white font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(listing.bestBefore).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-white font-medium flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {listing.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Donor</p>
                        <p className="text-white font-medium">{listing.donorName}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="bg-green-600 hover:bg-green-700 w-full">
                        <Truck className="w-4 h-4 mr-2" />
                        Claim Pickup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
