import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, generateId } from "@/lib/data-store";

// GET /api/donor/bids - Get bids on my listings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "DONOR") {
      return NextResponse.json({ success: false, error: "Only donors can view bids" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Get my listings
    const myListings = Array.from(stores.listings.values()).filter(
      (l) => l.donorId === session.user.id
    );
    const myListingIds = myListings.map((l) => l.id);

    // Get bids on my listings
    let bids = Array.from(stores.bids.values()).filter((b) =>
      myListingIds.includes(b.listingId)
    );

    // Filter by status
    if (status && ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"].includes(status)) {
      bids = bids.filter((b) => b.status === status);
    }

    // Sort by newest first
    bids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bids" }, { status: 500 });
  }
}

// POST /api/donor/bids/:id/accept - Accept a bid
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "DONOR") {
      return NextResponse.json({ success: false, error: "Only donors can accept bids" }, { status: 403 });
    }

    const body = await request.json();
    const { bidId } = body;

    if (!bidId) {
      return NextResponse.json({ success: false, error: "Bid ID is required" }, { status: 400 });
    }

    // Find bid
    const bid = Array.from(stores.bids.values()).find((b) => b.id === bidId);

    if (!bid) {
      return NextResponse.json({ success: false, error: "Bid not found" }, { status: 404 });
    }

    // Find listing
    const listing = Array.from(stores.listings.values()).find(
      (l) => l.id === bid.listingId
    );

    if (!listing) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    // Verify ownership
    if (listing.donorId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Not your listing" }, { status: 403 });
    }

    // Update bid status
    bid.status = "ACCEPTED";
    bid.updatedAt = new Date();
    stores.bids.set(bidId, bid);

    // Update listing status
    listing.status = "ASSIGNED";
    listing.assignedTo = bid.bidderId;
    listing.updatedAt = new Date();
    stores.listings.set(listing.id, listing);

    // Reject other pending bids on this listing
    const otherBids = Array.from(stores.bids.entries()).filter(
      ([_, b]) => b.listingId === listing.id && b.id !== bidId && b.status === "PENDING"
    );

    otherBids.forEach(([id, b]) => {
      b.status = "REJECTED";
      b.updatedAt = new Date();
      stores.bids.set(id, b);
    });

    return NextResponse.json({
      success: true,
      data: bid,
      message: "Bid accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting bid:", error);
    return NextResponse.json({ success: false, error: "Failed to accept bid" }, { status: 500 });
  }
}
