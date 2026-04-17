// Core Data Store - In-Memory Fast Storage System
// Using HashMaps for O(1) operations

import bcrypt from "bcryptjs";

export type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY";

// ==================== USER STORE ====================
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  organization?: {
    name: string;
    type: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED";
  kycDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userStore = new Map<string, User>();

// Demo users (pre-hashed passwords)
const demoUsers: User[] = [
  {
    id: "user_admin",
    name: "Admin User",
    email: "admin@annadan.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.V4ferBqKzPQK2G", // admin123
    role: "ADMIN",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_donor",
    name: "Demo Donor",
    email: "donor@demo.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    role: "DONOR",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_ngo",
    name: "Demo NGO",
    email: "ngo@demo.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    role: "NGO",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_collector",
    name: "Demo Collector",
    email: "collector@demo.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    role: "COLLECTOR",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user_beneficiary",
    name: "Demo Beneficiary",
    email: "beneficiary@demo.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    role: "BENEFICIARY",
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Initialize demo users
demoUsers.forEach((u) => userStore.set(u.email.toLowerCase(), u));

// ==================== LISTING STORE ====================
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

export interface FoodListing {
  id: string;
  donorId: string;
  donorName: string;
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
  assignedTo?: string; // collectorId
  carbonCredits?: number;
  createdAt: Date;
  updatedAt: Date;
}

const listingStore = new Map<string, FoodListing>();

// Demo listings
const demoListings: FoodListing[] = [
  {
    id: "listing_1",
    donorId: "user_donor",
    donorName: "Demo Donor",
    title: "Fresh Biryani - 50 servings",
    description: "Leftover from corporate event, still hot and fresh",
    category: "COOKED_MEALS",
    quantityKg: 25,
    servings: 50,
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    bestBefore: new Date(Date.now() + 6 * 60 * 60 * 1000),
    canFreeze: true,
    isVegetarian: false,
    allergens: ["Nuts"],
    images: [],
    address: "123 Main Street, Mumbai",
    lat: 19.076,
    lng: 72.8777,
    status: "ACTIVE",
    carbonCredits: 12.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "listing_2",
    donorId: "user_donor",
    donorName: "Demo Donor",
    title: "Fresh Vegetables - Mixed",
    description: "Assorted vegetables from restaurant kitchen",
    category: "RAW_VEGETABLES",
    quantityKg: 15,
    servings: 30,
    preparedAt: new Date(),
    bestBefore: new Date(Date.now() + 24 * 60 * 60 * 1000),
    canFreeze: false,
    isVegetarian: true,
    allergens: [],
    images: [],
    address: "456 Market Road, Mumbai",
    lat: 19.082,
    lng: 72.881,
    status: "ACTIVE",
    carbonCredits: 7.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

demoListings.forEach((l) => listingStore.set(l.id, l));

// ==================== BID STORE ====================
export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  bidderRole: string;
  bidAmount?: number;
  message?: string;
  status: BidStatus;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bidStore = new Map<string, Bid>();

// ==================== COLLECTION STORE ====================
export type CollectionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Collection {
  id: string;
  listingId: string;
  collectorId: string;
  collectorName: string;
  ngoId?: string;
  ngoName?: string;
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

const collectionStore = new Map<string, Collection>();

// ==================== CARBON CREDIT STORE ====================
export interface CarbonCredit {
  id: string;
  userId: string;
  userName: string;
  listingId: string;
  credits: number;
  kgDiverted: number;
  co2Saved: number;
  status: "PENDING" | "VERIFIED" | "TRADED";
  tradedAt?: Date;
  price?: number;
  createdAt: Date;
}

const carbonStore = new Map<string, CarbonCredit>();

// ==================== DISTRIBUTION STORE ====================
export interface Distribution {
  id: string;
  ngoId: string;
  ngoName: string;
  listingId: string;
  beneficiaryIds: string[];
  beneficiaryNames: string[];
  distributedAt: Date;
  mealsProvided: number;
  notes?: string;
  photos: string[];
  createdAt: Date;
}

const distributionStore = new Map<string, Distribution>();

// ==================== BENEFICIARY STORE ====================
export interface Beneficiary {
  id: string;
  ngoId: string;
  name: string;
  phone?: string;
  address: string;
  familySize: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const beneficiaryStore = new Map<string, Beneficiary>();

// ==================== COMPOST BATCH STORE ====================
export interface CompostBatch {
  id: string;
  collectorId: string;
  collectorName: string;
  wasteKg: number;
  startDate: Date;
  endDate?: Date;
  status: "ACTIVE" | "COMPLETED";
  compostKg?: number;
  earnings?: number;
  createdAt: Date;
  updatedAt: Date;
}

const compostStore = new Map<string, CompostBatch>();

// ==================== REQUEST STORE ====================
export interface FoodRequest {
  id: string;
  ngoId: string;
  ngoName: string;
  category?: FoodCategory;
  quantityKg: number;
  servingsNeeded?: number;
  neededBy: Date;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description?: string;
  status: "ACTIVE" | "FULFILLED" | "CANCELLED";
  fulfilledKg: number;
  createdAt: Date;
  updatedAt: Date;
}

const requestStore = new Map<string, FoodRequest>();

// ==================== API HELPERS ====================

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function addUser(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<string> {
  const id = generateId("user");
  const user: User = {
    id,
    name,
    email: email.toLowerCase(),
    password,
    role,
    isVerified: role === "BENEFICIARY",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  stores.users.set(email.toLowerCase(), user);
  return id;
}

// ==================== EXPORT STORES ====================

export const stores = {
  users: userStore,
  listings: listingStore,
  bids: bidStore,
  collections: collectionStore,
  carbon: carbonStore,
  distributions: distributionStore,
  beneficiaries: beneficiaryStore,
  compost: compostStore,
  requests: requestStore,
};

export type Stores = typeof stores;
