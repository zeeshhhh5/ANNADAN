import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stores, generateId, hashPassword, type User } from "@/lib/data-store";

// GET /api/admin/users - List all users with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let users = Array.from(stores.users.values());

    // Filter by role
    if (role && ["ADMIN", "DONOR", "NGO", "COLLECTOR", "BENEFICIARY"].includes(role)) {
      users = users.filter((u) => u.role === role);
    }

    // Filter by status
    if (status === "active") {
      users = users.filter((u) => u.isActive);
    } else if (status === "inactive") {
      users = users.filter((u) => !u.isActive);
    }

    // Filter by verification
    if (status === "verified") {
      users = users.filter((u) => u.isVerified);
    } else if (status === "unverified") {
      users = users.filter((u) => !u.isVerified);
    }

    // Sort by newest first
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Limit results
    users = users.slice(0, limit);

    // Remove passwords from response
    const safeUsers = users.map(({ password, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      data: safeUsers,
      count: safeUsers.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ success: false, error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!["ADMIN", "DONOR", "NGO", "COLLECTOR", "BENEFICIARY"].includes(body.role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    const email = body.email.toLowerCase();

    // Check if user exists
    if (stores.users.has(email)) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 });
    }

    // Create user
    const hashedPassword = await hashPassword(body.password);
    const user: User = {
      id: generateId("user"),
      name: body.name,
      email,
      password: hashedPassword,
      phone: body.phone,
      role: body.role,
      isVerified: body.isVerified || false,
      isActive: true,
      organization: body.organization,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stores.users.set(email, user);

    // Remove password from response
    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: "User created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
