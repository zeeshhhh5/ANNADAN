import { NextRequest, NextResponse } from "next/server";
import { addUser, type UserRole } from "@/lib/data-store";
import { stores } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ success: false, error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!["ADMIN", "DONOR", "NGO", "COLLECTOR", "FARMER", "BENEFICIARY"].includes(body.role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    const email = body.email.toLowerCase();

    // Check if already registered
    if (stores.users.has(email)) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 });
    }

    // Add user - addUser handles password hashing internally
    const user = await addUser(email, body.password, body.name, body.role as UserRole, body.organization);

    console.log(`[Auth] User registered: ${email} as ${body.role}`);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
