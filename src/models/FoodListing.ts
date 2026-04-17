import mongoose, { Schema, Model } from "mongoose";

export type FoodCategory =
  | "COOKED_MEALS"
  | "RAW_VEGETABLES"
  | "FRUITS"
  | "DAIRY"
  | "BAKERY"
  | "BEVERAGES"
  | "PACKAGED"
  | "MIXED"
  | "OTHER";

export type ListingStatus =
  | "ACTIVE"
  | "ASSIGNED"
  | "COLLECTED"
  | "DISTRIBUTED"
  | "EXPIRED"
  | "CANCELLED";

export interface IFoodListing {
  _id: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: FoodCategory;
  quantityKg: number;
  servings?: number;
  preparedAt: Date;
  bestBefore: Date;
  canFreeze: boolean;
  isVegetarian: boolean;
  allergens: string[];
  cuisineType?: string;
  images: string[];
  address: string;
  lat: number;
  lng: number;
  pickupInstructions?: string;
  status: ListingStatus;
  assignedTo?: mongoose.Types.ObjectId;
  collectedAt?: Date;
  distributedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FoodListingSchema = new Schema<IFoodListing>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: [
        "COOKED_MEALS",
        "RAW_VEGETABLES",
        "FRUITS",
        "DAIRY",
        "BAKERY",
        "BEVERAGES",
        "PACKAGED",
        "MIXED",
        "OTHER",
      ],
      required: true,
    },
    quantityKg: {
      type: Number,
      required: true,
      min: 0.1,
    },
    servings: Number,
    preparedAt: {
      type: Date,
      required: true,
    },
    bestBefore: {
      type: Date,
      required: true,
    },
    canFreeze: {
      type: Boolean,
      default: false,
    },
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    allergens: [String],
    cuisineType: String,
    images: [String],
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    pickupInstructions: String,
    status: {
      type: String,
      enum: ["ACTIVE", "ASSIGNED", "COLLECTED", "DISTRIBUTED", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    collectedAt: Date,
    distributedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
FoodListingSchema.index({ lat: 1, lng: 1 });
FoodListingSchema.index({ status: 1, bestBefore: 1 });
FoodListingSchema.index({ donorId: 1 });

const FoodListing: Model<IFoodListing> =
  mongoose.models.FoodListing || mongoose.model<IFoodListing>("FoodListing", FoodListingSchema);

export default FoodListing;
