import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, generateId, type Collection } from "@/lib/data-store";

// GET /api/collector/pickups - Get available pickups
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "COLLECTOR") {
      return NextResponse.json({ success: false, error: "Only collectors can view pickups" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Get active listings not assigned to anyone
    let listings = Array.from(stores.listings.values()).filter(
      (l) => l.status === "ACTIVE" && new Date(l.bestBefore) > new Date()
    );

    // Get my assigned pickups
    const myCollections = Array.from(stores.collections.values()).filter(
      (c) => c.collectorId === session.user.id
    );

    const myCollectionIds = myCollections.map((c) => c.listingId);

    // Filter out listings I already have
    listings = listings.filter((l) => !myCollectionIds.includes(l.id));

    // Sort by urgency (expiring first)
    listings.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime());

    return NextResponse.json({
      success: true,
      data: listings,
      myCollections,
    });
  } catch (error) {
    console.error("Error fetching pickups:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch pickups" }, { status: 500 });
  }
}

// POST /api/collector/pickups/claim - Claim a pickup
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "COLLECTOR") {
      return NextResponse.json({ success: false, error: "Only collectors can claim pickups" }, { status: 403 });
    }

    const body = await request.json();
    const { listingId, scheduledAt } = body;

    if (!listingId) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    // Find listing
    const listing = Array.from(stores.listings.values()).find((l) => l.id === listingId);

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    if (listing.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Listing is not available" }, { status: 400 });
    }

    // Create collection record
    const collection: Collection = {
      id: generateId("collection"),
      listingId,
      collectorId: session.user.id,
      collectorName: session.user.name,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      status: "SCHEDULED",
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stores.collections.set(collection.id, collection);

    // Update listing status
    listing.status = "ASSIGNED";
    listing.assignedTo = session.user.id;
    listing.updatedAt = new Date();
    stores.listings.set(listing.id, listing);

    return NextResponse.json({
      success: true,
      data: collection,
      message: "Pickup claimed successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error claiming pickup:", error);
    return NextResponse.json({ success: false, error: "Failed to claim pickup" }, { status: 500 });
  }
}
