import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "BID_RECEIVED",
    title: "New Bid Received",
    message: "Food Care NGO placed a bid on your listing 'Biryani - 50 servings'",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "BID_ACCEPTED",
    title: "Bid Accepted!",
    message: "Your bid on 'Fresh Vegetables Mix' has been accepted",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    type: "COLLECTION_SCHEDULED",
    title: "Collection Scheduled",
    message: "Pickup scheduled for tomorrow at 10:00 AM",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    type: "CARBON_CREDIT",
    title: "Carbon Credits Earned",
    message: "You earned 2.5 carbon credits from your recent donation",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "5",
    type: "SYSTEM",
    title: "Welcome to AnnaDaan!",
    message: "Thank you for joining our mission to reduce food waste",
    read: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, markAllRead } = await request.json();

    // In a real app, this would update the database
    return NextResponse.json({
      success: true,
      message: markAllRead ? "All notifications marked as read" : "Notification updated",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
