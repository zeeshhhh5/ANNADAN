import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, generateId, type FoodListing } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const donorId = searchParams.get("donorId");

    let listings = Array.from(stores.listings.values());

    // Filter by status
    if (status) {
      listings = listings.filter(l => l.status === status);
    } else {
      listings = listings.filter(l => ["ACTIVE", "ASSIGNED"].includes(l.status));
    }

    // Filter by category
    if (category) {
      listings = listings.filter(l => l.category === category);
    }

    // Filter by donor
    if (donorId) {
      listings = listings.filter(l => l.donorId === donorId);
    }

    // Filter expired
    const now = new Date();
    listings = listings.filter(l => new Date(l.bestBefore) > now);

    // Sort by newest first
    listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "DONOR") {
      return NextResponse.json({ success: false, error: "Only donors can create listings" }, { status: 403 });
    }

    const body = await request.json();
    const id = generateId("listing");

    const listing: FoodListing = {
      id,
      donorId: session.user.id,
      donorName: session.user.name,
      title: body.title,
      description: body.description,
      category: body.category,
      quantityKg: body.quantityKg,
      servings: body.servings,
      preparedAt: new Date(body.preparedAt),
      bestBefore: new Date(body.bestBefore),
      canFreeze: body.canFreeze || false,
      isVegetarian: body.isVegetarian !== false,
      allergens: body.allergens || [],
      cuisineType: body.cuisineType,
      images: body.images || [],
      address: body.address,
      lat: body.lat,
      lng: body.lng,
      pickupInstructions: body.pickupInstructions,
      status: "ACTIVE",
      carbonCredits: body.quantityKg * 0.5, // 0.5 credits per kg
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stores.listings.set(id, listing);

    return NextResponse.json({ success: true, data: listing, message: "Listing created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ success: false, error: "Failed to create listing" }, { status: 500 });
  }
}
