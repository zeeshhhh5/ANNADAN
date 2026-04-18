import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  stores,
  addBid,
  updateBid,
  getBidsByListing,
  getBidsByBidder,
  getBidsForDonor,
  getUserById,
  updateListing,
  addNotification,
  addCollection,
  type Bid,
  type UserRole,
} from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const status = searchParams.get("status");

    let bids: Bid[];

    if (session.user.role === "DONOR") {
      bids = getBidsForDonor(session.user.id);
    } else if (listingId) {
      bids = getBidsByListing(listingId);
    } else {
      bids = getBidsByBidder(session.user.id);
    }

    // Filter by status if provided
    if (status) {
      bids = bids.filter(b => b.status === status);
    }

    // Enrich bids with listing info
    const enrichedBids = bids.map(bid => {
      const listing = stores.listings.get(bid.listingId);
      return {
        ...bid,
        listing: listing ? {
          id: listing.id,
          title: listing.title,
          category: listing.category,
          quantityKg: listing.quantityKg,
          images: listing.images,
          status: listing.status,
          bestBefore: listing.bestBefore,
          address: listing.address,
        } : null,
      };
    });

    return NextResponse.json({ success: true, data: enrichedBids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["NGO", "BENEFICIARY", "COLLECTOR"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "You cannot place bids" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { listingId, bidAmount, message, isUrgent } = body;

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: "Listing ID is required" },
        { status: 400 }
      );
    }

    const listing = stores.listings.get(listingId);

    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    if (!["ACTIVE", "BIDDING"].includes(listing.status)) {
      return NextResponse.json(
        { success: false, error: "This listing is no longer accepting bids" },
        { status: 400 }
      );
    }

    // Check for existing pending bid
    const existingBids = getBidsByListing(listingId);
    const existingBid = existingBids.find(
      b => b.bidderId === session.user.id && b.status === "PENDING"
    );

    if (existingBid) {
      return NextResponse.json(
        { success: false, error: "You already have a pending bid on this listing" },
        { status: 400 }
      );
    }

    // Get user organization name
    const user = getUserById(session.user.id);
    const organizationName = user?.organization?.name;

    const bid = addBid({
      listingId,
      bidderId: session.user.id,
      bidderName: session.user.name,
      bidderRole: session.user.role as UserRole,
      bidderOrganization: organizationName,
      bidAmount: bidAmount || undefined,
      message: message || undefined,
      isUrgent: isUrgent || false,
      status: "PENDING",
    });

    return NextResponse.json(
      { success: true, data: bid, message: "Bid placed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place bid" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bidId, action } = body;

    if (!bidId || !action) {
      return NextResponse.json(
        { success: false, error: "Bid ID and action are required" },
        { status: 400 }
      );
    }

    const bid = stores.bids.get(bidId);
    if (!bid) {
      return NextResponse.json(
        { success: false, error: "Bid not found" },
        { status: 404 }
      );
    }

    const listing = stores.listings.get(bid.listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    // Only donor can accept/reject bids on their listings
    if (session.user.role === "DONOR" && listing.donorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You can only manage bids on your own listings" },
        { status: 403 }
      );
    }

    if (action === "accept") {
      // Accept this bid
      updateBid(bidId, { status: "ACCEPTED", respondedAt: new Date() });

      // Reject all other pending bids on this listing
      const otherBids = getBidsByListing(bid.listingId);
      otherBids.forEach(b => {
        if (b.id !== bidId && b.status === "PENDING") {
          updateBid(b.id, { status: "REJECTED", respondedAt: new Date() });
          
          // Notify rejected bidders
          addNotification({
            userId: b.bidderId,
            type: "BID_REJECTED",
            title: "Bid Not Selected",
            message: `Your bid on "${listing.title}" was not selected`,
            data: { bidId: b.id, listingId: listing.id },
            read: false,
          });
        }
      });

      // Update listing status
      updateListing(listing.id, { 
        status: "ASSIGNED",
        assignedTo: bid.bidderRole === "COLLECTOR" ? bid.bidderId : undefined,
        assignedNgoId: bid.bidderRole === "NGO" ? bid.bidderId : undefined,
      });

      // Create collection if collector accepted
      if (bid.bidderRole === "COLLECTOR") {
        addCollection({
          listingId: listing.id,
          listingTitle: listing.title,
          collectorId: bid.bidderId,
          collectorName: bid.bidderName,
          donorId: listing.donorId,
          donorName: listing.donorName,
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: "SCHEDULED",
          photos: [],
          address: listing.address,
          lat: listing.lat,
          lng: listing.lng,
        });
      }

      // Notify accepted bidder
      addNotification({
        userId: bid.bidderId,
        type: "BID_ACCEPTED",
        title: "Bid Accepted!",
        message: `Your bid on "${listing.title}" has been accepted`,
        data: { bidId, listingId: listing.id },
        read: false,
      });

      return NextResponse.json({
        success: true,
        message: "Bid accepted successfully",
      });
    } else if (action === "reject") {
      updateBid(bidId, { status: "REJECTED", respondedAt: new Date() });

      // Notify rejected bidder
      addNotification({
        userId: bid.bidderId,
        type: "BID_REJECTED",
        title: "Bid Rejected",
        message: `Your bid on "${listing.title}" was rejected`,
        data: { bidId, listingId: listing.id },
        read: false,
      });

      return NextResponse.json({
        success: true,
        message: "Bid rejected",
      });
    } else if (action === "cancel") {
      // Only bidder can cancel their own bid
      if (bid.bidderId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "You can only cancel your own bids" },
          { status: 403 }
        );
      }

      updateBid(bidId, { status: "CANCELLED" });

      return NextResponse.json({
        success: true,
        message: "Bid cancelled",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update bid" },
      { status: 500 }
    );
  }
}
