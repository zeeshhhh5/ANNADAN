import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  organization?: {
    name: string;
    type: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "DONOR", "NGO", "COLLECTOR", "BENEFICIARY"],
      default: "DONOR",
    },
    avatar: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    organization: {
      name: String,
      type: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
