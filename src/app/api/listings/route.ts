import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  stores,
  addListing,
  updateListing,
  getActiveListings,
  getListingsByDonor,
  getBidCountForListing,
  type FoodListing,
  type FoodCategory,
} from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const donorId = searchParams.get("donorId");
    const limit = searchParams.get("limit");

    let listings: FoodListing[];

    if (donorId) {
      listings = getListingsByDonor(donorId);
    } else {
      listings = getActiveListings();
    }

    // Filter by status
    if (status) {
      listings = listings.filter(l => l.status === status);
    }

    // Filter by category
    if (category) {
      listings = listings.filter(l => l.category === category);
    }

    // Apply limit
    if (limit) {
      listings = listings.slice(0, parseInt(limit));
    }

    // Enrich with bid counts
    const enrichedListings = listings.map(listing => ({
      ...listing,
      bidCount: getBidCountForListing(listing.id),
    }));

    return NextResponse.json({ success: true, data: enrichedListings });
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

    if (session.user.role !== "DONOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Only donors can create listings" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.category || !body.quantityKg || !body.address) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, category, quantityKg, address" },
        { status: 400 }
      );
    }

    const listing = addListing({
      donorId: session.user.id,
      donorName: session.user.name,
      title: body.title,
      description: body.description || undefined,
      category: body.category as FoodCategory,
      quantityKg: parseFloat(body.quantityKg),
      servings: body.servings ? parseInt(body.servings) : undefined,
      preparedAt: body.preparedAt ? new Date(body.preparedAt) : new Date(),
      bestBefore: body.bestBefore ? new Date(body.bestBefore) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      canFreeze: body.canFreeze || false,
      isVegetarian: body.isVegetarian !== false,
      allergens: body.allergens || [],
      cuisineType: body.cuisineType || undefined,
      images: body.images || [],
      address: body.address,
      lat: body.lat || 0,
      lng: body.lng || 0,
      pickupInstructions: body.pickupInstructions || undefined,
      status: "ACTIVE",
      carbonCredits: parseFloat(body.quantityKg) * 0.5, // 0.5 credits per kg
      freeForDecomposition: body.freeForDecomposition !== false,
    });

    return NextResponse.json({ success: true, data: listing, message: "Listing created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ success: false, error: "Failed to create listing" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    const listing = stores.listings.get(id);
    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    // Only owner or admin can update
    if (listing.donorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "You can only update your own listings" }, { status: 403 });
    }

    const updatedListing = updateListing(id, updates);

    return NextResponse.json({ success: true, data: updatedListing, message: "Listing updated" });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ success: false, error: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    const listing = stores.listings.get(id);
    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    // Only owner or admin can delete
    if (listing.donorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "You can only delete your own listings" }, { status: 403 });
    }

    // Soft delete by changing status
    updateListing(id, { status: "CANCELLED" });

    return NextResponse.json({ success: true, message: "Listing cancelled" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ success: false, error: "Failed to delete listing" }, { status: 500 });
  }
}
