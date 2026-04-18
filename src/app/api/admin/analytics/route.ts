import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores } from "@/lib/data-store";

// GET /api/admin/analytics - Platform analytics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const users = Array.from(stores.users.values());
    const listings = Array.from(stores.listings.values());
    const collections = Array.from(stores.collections.values());
    const credits = Array.from(stores.carbon.values());
    const distributions = Array.from(stores.distributions.values());

    // User statistics
    const userStats = {
      total: users.length,
      byRole: {
        ADMIN: users.filter((u) => u.role === "ADMIN").length,
        DONOR: users.filter((u) => u.role === "DONOR").length,
        NGO: users.filter((u) => u.role === "NGO").length,
        COLLECTOR: users.filter((u) => u.role === "COLLECTOR").length,
        FARMER: users.filter((u) => u.role === "FARMER").length,
        BENEFICIARY: users.filter((u) => u.role === "BENEFICIARY").length,
      },
      verified: users.filter((u) => u.isVerified).length,
      active: users.filter((u) => u.isActive).length,
      pendingKYC: users.filter((u) => u.kycStatus === "PENDING").length,
    };

    // Listing statistics
    const listingStats = {
      total: listings.length,
      byStatus: {
        ACTIVE: listings.filter((l) => l.status === "ACTIVE").length,
        BIDDING: listings.filter((l) => l.status === "BIDDING").length,
        ASSIGNED: listings.filter((l) => l.status === "ASSIGNED").length,
        COLLECTED: listings.filter((l) => l.status === "COLLECTED").length,
        DISTRIBUTED: listings.filter((l) => l.status === "DISTRIBUTED").length,
        EXPIRED: listings.filter((l) => l.status === "EXPIRED").length,
      },
      byCategory: listings.reduce((acc, l) => {
        acc[l.category] = (acc[l.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalKg: listings.reduce((sum, l) => sum + l.quantityKg, 0),
      totalServings: listings.reduce((sum, l) => sum + (l.servings || 0), 0),
    };

    // Collection statistics
    const collectionStats = {
      total: collections.length,
      byStatus: {
        SCHEDULED: collections.filter((c) => c.status === "SCHEDULED").length,
        IN_TRANSIT: collections.filter((c) => c.status === "IN_TRANSIT").length,
        PICKED_UP: collections.filter((c) => c.status === "PICKED_UP").length,
        SORTING: collections.filter((c) => c.status === "SORTING").length,
        COMPLETED: collections.filter((c) => c.status === "COMPLETED").length,
        CANCELLED: collections.filter((c) => c.status === "CANCELLED").length,
      },
      totalKgCollected: collections.reduce((sum, c) => sum + (c.totalKgCollected || 0), 0),
      edibleKg: collections.reduce((sum, c) => sum + (c.edibleKg || 0), 0),
      wasteKg: collections.reduce((sum, c) => sum + (c.wasteKg || 0), 0),
    };

    // Carbon credit statistics
    const carbonStats = {
      totalCredits: credits.reduce((sum, c) => sum + c.credits, 0),
      totalKgDiverted: credits.reduce((sum, c) => sum + c.kgDiverted, 0),
      totalCO2Saved: credits.reduce((sum, c) => sum + c.co2Saved, 0),
      byStatus: {
        PENDING: credits.filter((c) => c.status === "PENDING").length,
        APPROVED: credits.filter((c) => c.status === "APPROVED").length,
        MINTED: credits.filter((c) => c.status === "MINTED").length,
        LISTED: credits.filter((c) => c.status === "LISTED").length,
        SOLD: credits.filter((c) => c.status === "SOLD").length,
      },
    };

    // Distribution statistics
    const distributionStats = {
      total: distributions.length,
      totalMealsProvided: distributions.reduce((sum, d) => sum + d.mealsProvided, 0),
      totalBeneficiaries: distributions.reduce((sum, d) => sum + d.beneficiaryCount, 0),
    };

    // Impact metrics
    const impactMetrics = {
      mealsDelivered: distributionStats.totalMealsProvided,
      kgDiverted: carbonStats.totalKgDiverted,
      co2SavedKg: carbonStats.totalCO2Saved,
      creditsEarned: carbonStats.totalCredits,
      familiesHelped: distributionStats.totalBeneficiaries,
      equivalentTrees: Math.floor(carbonStats.totalCO2Saved / 21),
    };

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentActivity = {
      newUsers: users.filter((u) => new Date(u.createdAt) > sevenDaysAgo).length,
      newListings: listings.filter((l) => new Date(l.createdAt) > sevenDaysAgo).length,
      completedCollections: collections.filter(
        (c) => c.status === "COMPLETED" && c.completedAt && new Date(c.completedAt) > sevenDaysAgo
      ).length,
      newDistributions: distributions.filter(
        (d) => new Date(d.createdAt) > sevenDaysAgo
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        userStats,
        listingStats,
        collectionStats,
        carbonStats,
        distributionStats,
        impactMetrics,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
