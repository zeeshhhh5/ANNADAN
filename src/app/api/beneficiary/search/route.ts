import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores } from "@/lib/data-store";

// GET /api/beneficiary/search - Search available food
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "BENEFICIARY") {
      return NextResponse.json({ success: false, error: "Only beneficiaries can search food" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const vegetarian = searchParams.get("vegetarian");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "10");

    // Get active listings
    let listings = Array.from(stores.listings.values()).filter(
      (l) => l.status === "ACTIVE" && new Date(l.bestBefore) > new Date()
    );

    // Filter by category
    if (category) {
      listings = listings.filter((l) => l.category === category);
    }

    // Filter by vegetarian
    if (vegetarian === "true") {
      listings = listings.filter((l) => l.isVegetarian);
    }

    // Filter by location (simple distance calculation)
    if (lat !== 0 && lng !== 0) {
      listings = listings.filter((l) => {
        const distance = calculateDistance(lat, lng, l.lat, l.lng);
        return distance <= radius;
      });
    }

    // Sort by distance (if location provided) or by expiry
    if (lat !== 0 && lng !== 0) {
      listings.sort((a, b) => {
        const distA = calculateDistance(lat, lng, a.lat, a.lng);
        const distB = calculateDistance(lat, lng, b.lat, b.lng);
        return distA - distB;
      });
    } else {
      listings.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime());
    }

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error("Error searching food:", error);
    return NextResponse.json({ success: false, error: "Failed to search food" }, { status: 500 });
  }
}

// Haversine formula for distance calculation (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
