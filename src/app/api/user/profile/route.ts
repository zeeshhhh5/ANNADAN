import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, updateUser, saveData } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        organization: user.organization?.name || "",
        address: user.organization?.address || "",
        city: user.organization?.city || "",
        state: user.organization?.state || "",
        pincode: user.organization?.pincode || "",
        avatar: user.avatar || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, organization, address, city, state, pincode, avatar } = body;

    const user = getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile
    const updates: any = {
      name: name || user.name,
      phone: phone,
      avatar: avatar || user.avatar,
      updatedAt: new Date(),
    };
    
    if (!user.organization) {
      updates.organization = {
        name: "",
        type: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      };
    } else {
      updates.organization = { ...user.organization };
    }

    updates.organization.name = organization || updates.organization.name;
    updates.organization.address = address || updates.organization.address;
    updates.organization.city = city || updates.organization.city;
    updates.organization.state = state || updates.organization.state;
    updates.organization.pincode = pincode || updates.organization.pincode;

    const updatedUser = updateUser(user.id, updates);
    await saveData();

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        organization: updatedUser.organization?.name,
        address: updatedUser.organization?.address,
        city: updatedUser.organization?.city,
        state: updatedUser.organization?.state,
        pincode: updatedUser.organization?.pincode,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
