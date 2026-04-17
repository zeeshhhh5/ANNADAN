import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/annadan";

// User Schema (simplified for seeding)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: String,
  isVerified: Boolean,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@annadan.com" },
      {
        name: "Admin User",
        email: "admin@annadan.com",
        password: adminPassword,
        role: "ADMIN",
        isVerified: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log("Admin user created:", adminUser.email);

    // Create demo users for each role
    const demoUsers = [
      { name: "Demo Donor", email: "donor@demo.com", role: "DONOR" },
      { name: "Demo NGO", email: "ngo@demo.com", role: "NGO" },
      { name: "Demo Collector", email: "collector@demo.com", role: "COLLECTOR" },
      { name: "Demo Beneficiary", email: "beneficiary@demo.com", role: "BENEFICIARY" },
    ];

    const demoPassword = await bcrypt.hash("demo123", 12);

    for (const user of demoUsers) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          ...user,
          password: demoPassword,
          isVerified: true,
          isActive: true,
        },
        { upsert: true, new: true }
      );
      console.log(`Demo user created: ${user.email}`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log("\nDemo Accounts:");
    console.log("- admin@annadan.com / admin123 (Admin)");
    console.log("- donor@demo.com / demo123 (Donor)");
    console.log("- ngo@demo.com / demo123 (NGO)");
    console.log("- collector@demo.com / demo123 (Collector)");
    console.log("- beneficiary@demo.com / demo123 (Beneficiary)");

  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
