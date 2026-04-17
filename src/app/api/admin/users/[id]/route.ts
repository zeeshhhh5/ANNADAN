import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, hashPassword } from "@/lib/data-store";

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    // Find user by ID
    const user = Array.from(stores.users.values()).find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await request.json();

    // Find user
    const userEntry = Array.from(stores.users.entries()).find(([_, u]) => u.id === userId);

    if (!userEntry) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const [email, user] = userEntry;

    // Update user
    const updatedUser = {
      ...user,
      name: body.name || user.name,
      phone: body.phone !== undefined ? body.phone : user.phone,
      role: body.role || user.role,
      isVerified: body.isVerified !== undefined ? body.isVerified : user.isVerified,
      isActive: body.isActive !== undefined ? body.isActive : user.isActive,
      organization: body.organization || user.organization,
      kycStatus: body.kycStatus || user.kycStatus,
      kycDocuments: body.kycDocuments || user.kycDocuments,
      updatedAt: new Date(),
    };

    // Hash new password if provided
    if (body.password) {
      updatedUser.password = await hashPassword(body.password);
    }

    stores.users.set(email, updatedUser);

    // Remove password from response
    const { password, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Deactivate user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    // Find user
    const userEntry = Array.from(stores.users.entries()).find(([_, u]) => u.id === userId);

    if (!userEntry) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const [email, user] = userEntry;

    // Deactivate user (soft delete)
    user.isActive = false;
    user.updatedAt = new Date();
    stores.users.set(email, user);

    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json({ success: false, error: "Failed to deactivate user" }, { status: 500 });
  }
}
