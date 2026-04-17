import mongoose, { Schema, Model } from "mongoose";

export type CollectionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ICollection {
  _id: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  collectorId: mongoose.Types.ObjectId;
  ngoId?: mongoose.Types.ObjectId;
  scheduledAt: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  status: CollectionStatus;
  totalKgCollected?: number;
  edibleKg?: number;
  wasteKg?: number;
  qualityNotes?: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "FoodListing",
      required: true,
    },
    collectorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    pickedUpAt: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
    totalKgCollected: Number,
    edibleKg: Number,
    wasteKg: Number,
    qualityNotes: String,
    photos: [String],
  },
  {
    timestamps: true,
  }
);

CollectionSchema.index({ collectorId: 1, status: 1 });
CollectionSchema.index({ listingId: 1 });

const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
