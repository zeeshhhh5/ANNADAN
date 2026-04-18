import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, addRequest, updateRequest, getRequestsByNgo } from "@/lib/data-store";

// GET /api/ngo/requests - Get my requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "NGO") {
      return NextResponse.json({ success: false, error: "Only NGOs can view requests" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let requests = getRequestsByNgo(session.user.id);

    // Filter by status
    if (status && ["ACTIVE", "FULFILLED", "CANCELLED", "EXPIRED"].includes(status)) {
      requests = requests.filter((r) => r.status === status);
    }

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 });
  }
}

// POST /api/ngo/requests - Create new request
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "NGO") {
      return NextResponse.json({ success: false, error: "Only NGOs can create requests" }, { status: 403 });
    }

    const body = await request.json();

    // Validation
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }
    if (!body.quantityKg || body.quantityKg <= 0) {
      return NextResponse.json({ success: false, error: "Quantity must be positive" }, { status: 400 });
    }
    if (!body.neededBy) {
      return NextResponse.json({ success: false, error: "Needed by date is required" }, { status: 400 });
    }
    if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(body.urgency)) {
      return NextResponse.json({ success: false, error: "Invalid urgency level" }, { status: 400 });
    }

    const newRequest = addRequest({
      ngoId: session.user.id,
      ngoName: session.user.name,
      title: body.title,
      category: body.category,
      quantityKg: body.quantityKg,
      servingsNeeded: body.servingsNeeded,
      neededBy: new Date(body.neededBy),
      urgency: body.urgency,
      description: body.description,
      status: "ACTIVE",
      fulfilledKg: 0,
      lat: body.lat,
      lng: body.lng,
      pickupRadius: body.pickupRadius,
    });

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: "Request created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json({ success: false, error: "Failed to create request" }, { status: 500 });
  }
}

// PUT /api/ngo/requests - Update request
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "NGO") {
      return NextResponse.json({ success: false, error: "Only NGOs can update requests" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Request ID is required" }, { status: 400 });
    }

    const existingRequest = stores.requests.get(id);
    if (!existingRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    if (existingRequest.ngoId !== session.user.id) {
      return NextResponse.json({ success: false, error: "You can only update your own requests" }, { status: 403 });
    }

    const updatedRequest = updateRequest(id, updates);

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: "Request updated successfully",
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ success: false, error: "Failed to update request" }, { status: 500 });
  }
}
