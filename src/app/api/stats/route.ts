import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getDonorStats,
  getNgoStats,
  getCollectorStats,
  getAdminStats,
  getNotificationsByUser,
  getUnreadNotificationCount,
} from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "dashboard";

    let stats;

    switch (session.user.role) {
      case "DONOR":
        stats = getDonorStats(session.user.id);
        break;
      case "NGO":
        stats = getNgoStats(session.user.id);
        break;
      case "COLLECTOR":
      case "FARMER":
        stats = getCollectorStats(session.user.id);
        break;
      case "ADMIN":
        stats = getAdminStats();
        break;
      default:
        stats = {};
    }

    // Add notification count
    const unreadNotifications = getUnreadNotificationCount(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        unreadNotifications,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
