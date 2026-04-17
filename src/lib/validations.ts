import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["DONOR", "NGO", "COLLECTOR", "FARMER", "BENEFICIARY"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  type: z.string().min(1, "Organization type is required"),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode is required"),
  registrationNumber: z.string().optional(),
  fssaiLicense: z.string().optional(),
  panNumber: z.string().optional(),
  gstNumber: z.string().optional(),
});

export const foodListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.enum([
    "COOKED_MEALS",
    "RAW_VEGETABLES",
    "FRUITS",
    "DAIRY",
    "BAKERY",
    "BEVERAGES",
    "PACKAGED",
    "MIXED",
    "OTHER",
  ]),
  quantityKg: z.number().min(0.1, "Quantity must be at least 0.1 kg"),
  servings: z.number().optional(),
  preparedAt: z.string().or(z.date()),
  bestBefore: z.string().or(z.date()),
  canFreeze: z.boolean().default(false),
  isVegetarian: z.boolean().default(true),
  allergens: z.array(z.string()).default([]),
  cuisineType: z.string().optional(),
  images: z.array(z.string()).default([]),
  address: z.string().min(5, "Pickup address is required"),
  lat: z.number(),
  lng: z.number(),
  pickupInstructions: z.string().optional(),
  freeForDecomposition: z.boolean().default(true),
});

export const bidSchema = z.object({
  listingId: z.string(),
  bidAmount: z.number().optional(),
  message: z.string().optional(),
  isUrgent: z.boolean().default(false),
});

export const ngoRequirementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  foodCategory: z.enum([
    "COOKED_MEALS",
    "RAW_VEGETABLES",
    "FRUITS",
    "DAIRY",
    "BAKERY",
    "BEVERAGES",
    "PACKAGED",
    "MIXED",
    "OTHER",
  ]),
  quantityKg: z.number().min(0.1, "Quantity must be at least 0.1 kg"),
  servingsNeeded: z.number().optional(),
  neededBy: z.string().or(z.date()),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  description: z.string().optional(),
  pickupRadius: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const collectionSchema = z.object({
  listingId: z.string(),
  scheduledAt: z.string().or(z.date()),
  qualityNotes: z.string().optional(),
});

export const wasteOrderSchema = z.object({
  wasteType: z.enum(["EDIBLE", "ORGANIC_COMPOST", "BIOGAS_SUITABLE", "MIXED"]),
  wasteKg: z.number().min(0.1),
  pricePerKg: z.number().optional(),
  description: z.string().optional(),
  pickupAddress: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const footpathLogSchema = z.object({
  listingId: z.string().optional(),
  portionsServed: z.number().min(1, "At least 1 portion must be served"),
  location: z.string().min(3, "Location is required"),
  lat: z.number(),
  lng: z.number(),
  notes: z.string().optional(),
});

export const carbonTradeSchema = z.object({
  creditId: z.string(),
  creditsBought: z.number().min(0.001),
  companyName: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OrganizationInput = z.infer<typeof organizationSchema>;
export type FoodListingInput = z.infer<typeof foodListingSchema>;
export type BidInput = z.infer<typeof bidSchema>;
export type NGORequirementInput = z.infer<typeof ngoRequirementSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type WasteOrderInput = z.infer<typeof wasteOrderSchema>;
export type FootpathLogInput = z.infer<typeof footpathLogSchema>;
export type CarbonTradeInput = z.infer<typeof carbonTradeSchema>;
