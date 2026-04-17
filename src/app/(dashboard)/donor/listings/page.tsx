import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Package } from "lucide-react";

export default async function DonorListingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "DONOR") {
    redirect("/dashboard");
  }

  // Fetch listings from API
  const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/listings?donorId=${session.user.id}`, {
    cache: "no-store",
  });

  const data = await response.json();
  const listings = data.success ? data.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Food Listings</h1>
          <p className="text-gray-400 mt-1">Manage your food donations</p>
        </div>
        <Link href="/donor/listings/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No listings yet</h3>
            <p className="text-gray-400 mb-4">Create your first food listing to start donating</p>
            <Link href="/donor/listings/new">
              <Button className="bg-green-600 hover:bg-green-700">
                Create Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing: any) => (
            <Card key={listing.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{listing.title}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{listing.description}</p>
                  </div>
                  <Badge
                    variant={listing.status === "ACTIVE" ? "default" : "secondary"}
                    className={
                      listing.status === "ACTIVE"
                        ? "bg-green-600"
                        : listing.status === "ASSIGNED"
                        ? "bg-blue-600"
                        : "bg-gray-600"
                    }
                  >
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
                    <p className="text-gray-500">Category</p>
                    <p className="text-white font-medium">{listing.category}</p>
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
