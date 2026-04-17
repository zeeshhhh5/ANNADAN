import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bidSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const status = searchParams.get("status");

    const where: any = {};

    if (session.user.role === "DONOR") {
      const donorListings = await prisma.foodListing.findMany({
        where: { donorId: session.user.id },
        select: { id: true },
      });
      where.listingId = { in: donorListings.map((l: { id: string }) => l.id) };
    } else {
      where.bidderId = session.user.id;
    }

    if (listingId) {
      where.listingId = listingId;
    }

    if (status) {
      where.status = status;
    }

    const bids = await prisma.bid.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
            quantityKg: true,
            images: true,
            status: true,
            bestBefore: true,
          },
        },
        bidder: {
          select: {
            id: true,
            name: true,
            role: true,
            organization: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["NGO", "BENEFICIARY", "COLLECTOR"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "You cannot place bids" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = bidSchema.parse(body);

    const listing = await prisma.foodListing.findUnique({
      where: { id: validatedData.listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (!["ACTIVE", "BIDDING"].includes(listing.status)) {
      return NextResponse.json(
        { error: "This listing is no longer accepting bids" },
        { status: 400 }
      );
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        listingId: validatedData.listingId,
        bidderId: session.user.id,
        status: "PENDING",
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { error: "You already have a pending bid on this listing" },
        { status: 400 }
      );
    }

    const bid = await prisma.bid.create({
      data: {
        listingId: validatedData.listingId,
        bidderId: session.user.id,
        bidAmount: validatedData.bidAmount,
        message: validatedData.message,
        isUrgent: validatedData.isUrgent,
        status: "PENDING",
      },
      include: {
        listing: true,
        bidder: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    await prisma.foodListing.update({
      where: { id: validatedData.listingId },
      data: { status: "BIDDING" },
    });

    await prisma.notification.create({
      data: {
        userId: listing.donorId,
        type: "BID_RECEIVED",
        title: "New Bid Received",
        message: `${session.user.name} placed a bid on "${listing.title}"`,
        data: { bidId: bid.id, listingId: listing.id },
      },
    });

    return NextResponse.json(
      { message: "Bid placed successfully", bid },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating bid:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to place bid" },
      { status: 500 }
    );
  }
}
