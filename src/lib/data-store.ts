// Core Data Store - In-Memory Fast Storage System with JSON Persistence
// Using HashMaps for O(1) operations with file-based backup

import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "FARMER" | "BENEFICIARY";

// Data file path for persistence
const DATA_FILE = path.join(process.cwd(), "data", "store.json");

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
    lat?: number;
    lng?: number;
  };
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED";
  kycDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userStore = new Map<string, User>();
const userByIdStore = new Map<string, User>(); // Secondary index by ID

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
    organization: {
      name: "Grand Hotel",
      type: "Hotel",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      lat: 19.076,
      lng: 72.8777,
    },
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
    organization: {
      name: "Food For All Foundation",
      type: "NGO",
      address: "456 Charity Lane",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
    },
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
    id: "user_farmer",
    name: "Demo Farmer",
    email: "farmer@demo.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
    role: "FARMER",
    isVerified: true,
    isActive: true,
    organization: {
      name: "Green Farms",
      type: "Farm",
      address: "789 Rural Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
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
  | "BIDDING"
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
  assignedNgoId?: string;
  carbonCredits?: number;
  freeForDecomposition?: boolean;
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
    description: "Leftover from corporate event, still hot and fresh. Chicken and vegetable biryani available.",
    category: "COOKED_MEALS",
    quantityKg: 25,
    servings: 50,
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    bestBefore: new Date(Date.now() + 6 * 60 * 60 * 1000),
    canFreeze: true,
    isVegetarian: false,
    allergens: ["Nuts"],
    cuisineType: "Indian",
    images: [],
    address: "123 Main Street, Mumbai",
    lat: 19.076,
    lng: 72.8777,
    pickupInstructions: "Ask for manager at reception",
    status: "ACTIVE",
    carbonCredits: 12.5,
    freeForDecomposition: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "listing_2",
    donorId: "user_donor",
    donorName: "Demo Donor",
    title: "Fresh Vegetables - Mixed",
    description: "Assorted vegetables from restaurant kitchen - carrots, potatoes, onions, tomatoes",
    category: "RAW_VEGETABLES",
    quantityKg: 15,
    servings: 30,
    preparedAt: new Date(),
    bestBefore: new Date(Date.now() + 24 * 60 * 60 * 1000),
    canFreeze: false,
    isVegetarian: true,
    allergens: [],
    cuisineType: "Mixed",
    images: [],
    address: "456 Market Road, Mumbai",
    lat: 19.082,
    lng: 72.881,
    status: "ACTIVE",
    carbonCredits: 7.5,
    freeForDecomposition: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "listing_3",
    donorId: "user_donor",
    donorName: "Demo Donor",
    title: "Bakery Items - Bread & Pastries",
    description: "Day-old bread, croissants, and pastries. Still fresh and edible.",
    category: "BAKERY",
    quantityKg: 8,
    servings: 40,
    preparedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    bestBefore: new Date(Date.now() + 12 * 60 * 60 * 1000),
    canFreeze: true,
    isVegetarian: true,
    allergens: ["Gluten", "Dairy"],
    cuisineType: "Continental",
    images: [],
    address: "789 Baker Street, Mumbai",
    lat: 19.088,
    lng: 72.875,
    status: "BIDDING",
    carbonCredits: 4,
    freeForDecomposition: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// ==================== BID STORE ====================
export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  bidderRole: UserRole;
  bidderOrganization?: string;
  bidAmount?: number;
  message?: string;
  status: BidStatus;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

const bidStore = new Map<string, Bid>();

// Demo bids
const demoBids: Bid[] = [
  {
    id: "bid_1",
    listingId: "listing_1",
    bidderId: "user_ngo",
    bidderName: "Demo NGO",
    bidderRole: "NGO",
    bidderOrganization: "Food For All Foundation",
    message: "We can distribute this to 50 families in our area. Please accept our bid.",
    status: "PENDING",
    isUrgent: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "bid_2",
    listingId: "listing_3",
    bidderId: "user_ngo",
    bidderName: "Demo NGO",
    bidderRole: "NGO",
    bidderOrganization: "Food For All Foundation",
    message: "Perfect for our morning breakfast program!",
    status: "PENDING",
    isUrgent: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "bid_3",
    listingId: "listing_1",
    bidderId: "user_collector",
    bidderName: "Demo Collector",
    bidderRole: "COLLECTOR",
    message: "I can pick this up and distribute to footpath dwellers in the area.",
    status: "PENDING",
    isUrgent: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// ==================== COLLECTION STORE ====================
export type CollectionStatus = "SCHEDULED" | "IN_TRANSIT" | "PICKED_UP" | "SORTING" | "COMPLETED" | "CANCELLED";

export interface Collection {
  id: string;
  listingId: string;
  listingTitle: string;
  collectorId: string;
  collectorName: string;
  ngoId?: string;
  ngoName?: string;
  donorId: string;
  donorName: string;
  scheduledAt: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  status: CollectionStatus;
  totalKgCollected?: number;
  edibleKg?: number;
  wasteKg?: number;
  qualityNotes?: string;
  photos: string[];
  address: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
}

const collectionStore = new Map<string, Collection>();

// ==================== CARBON CREDIT STORE ====================
export type CreditStatus = "PENDING" | "APPROVED" | "MINTED" | "LISTED" | "SOLD";

export interface CarbonCredit {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  listingId?: string;
  listingTitle?: string;
  credits: number;
  kgDiverted: number;
  co2Saved: number;
  status: CreditStatus;
  pricePerCredit?: number;
  approvedAt?: Date;
  approvedBy?: string;
  mintedAt?: Date;
  tradedAt?: Date;
  buyerId?: string;
  buyerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const carbonStore = new Map<string, CarbonCredit>();

// Demo carbon credits
const demoCarbonCredits: CarbonCredit[] = [
  {
    id: "carbon_1",
    actorId: "user_donor",
    actorName: "Demo Donor",
    actorRole: "DONOR",
    listingId: "listing_completed_1",
    listingTitle: "Previous Donation - Rice & Dal",
    credits: 5.5,
    kgDiverted: 22,
    co2Saved: 55,
    status: "MINTED",
    pricePerCredit: 150,
    approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    mintedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "carbon_2",
    actorId: "user_donor",
    actorName: "Demo Donor",
    actorRole: "DONOR",
    credits: 3.2,
    kgDiverted: 12.8,
    co2Saved: 32,
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// ==================== DISTRIBUTION STORE ====================
export interface Distribution {
  id: string;
  ngoId: string;
  ngoName: string;
  listingId: string;
  listingTitle: string;
  collectionId?: string;
  beneficiaryCount: number;
  distributedAt: Date;
  mealsProvided: number;
  location: string;
  lat?: number;
  lng?: number;
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
  mealsReceived: number;
  lastServedAt?: Date;
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
  title: string;
  category?: FoodCategory;
  quantityKg: number;
  servingsNeeded?: number;
  neededBy: Date;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description?: string;
  status: "ACTIVE" | "FULFILLED" | "CANCELLED" | "EXPIRED";
  fulfilledKg: number;
  lat?: number;
  lng?: number;
  pickupRadius?: number;
  createdAt: Date;
  updatedAt: Date;
}

const requestStore = new Map<string, FoodRequest>();

// Demo requests
const demoRequests: FoodRequest[] = [
  {
    id: "request_1",
    ngoId: "user_ngo",
    ngoName: "Demo NGO",
    title: "Cooked Meals for Evening Distribution",
    category: "COOKED_MEALS",
    quantityKg: 50,
    servingsNeeded: 100,
    neededBy: new Date(Date.now() + 6 * 60 * 60 * 1000),
    urgency: "HIGH",
    description: "Need cooked meals for evening distribution to homeless shelter",
    status: "ACTIVE",
    fulfilledKg: 25,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "request_2",
    ngoId: "user_ngo",
    ngoName: "Demo NGO",
    title: "Fruits for Children's Home",
    category: "FRUITS",
    quantityKg: 20,
    servingsNeeded: 50,
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000),
    urgency: "MEDIUM",
    description: "Fresh fruits needed for children's nutrition program",
    status: "ACTIVE",
    fulfilledKg: 0,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// ==================== WASTE ORDER STORE ====================
export type WasteType = "EDIBLE" | "ORGANIC_COMPOST" | "BIOGAS_SUITABLE" | "MIXED";
export type WasteOrderStatus = "AVAILABLE" | "BIDDING" | "SOLD" | "DELIVERED" | "CANCELLED";

export interface WasteOrder {
  id: string;
  collectorId: string;
  collectorName: string;
  wasteType: WasteType;
  wasteKg: number;
  pricePerKg?: number;
  totalAmount?: number;
  description?: string;
  images: string[];
  pickupAddress: string;
  lat?: number;
  lng?: number;
  status: WasteOrderStatus;
  buyerId?: string;
  buyerName?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const wasteOrderStore = new Map<string, WasteOrder>();

// ==================== NOTIFICATION STORE ====================
export type NotificationType =
  | "BID_RECEIVED"
  | "BID_ACCEPTED"
  | "BID_REJECTED"
  | "LISTING_MATCHED"
  | "COLLECTION_SCHEDULED"
  | "COLLECTION_COMPLETED"
  | "CREDIT_EARNED"
  | "CREDIT_SOLD"
  | "KYC_APPROVED"
  | "KYC_REJECTED"
  | "REQUIREMENT_MATCHED"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const notificationStore = new Map<string, Notification>();

// ==================== IMPACT LOG STORE ====================
export interface ImpactLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  mealsDelivered: number;
  kgDiverted: number;
  co2SavedKg: number;
  creditsEarned: number;
  date: Date;
  metadata?: Record<string, unknown>;
}

const impactLogStore = new Map<string, ImpactLog>();

// ==================== API HELPERS ====================

let idCounter = Date.now();

export function generateId(prefix: string): string {
  idCounter++;
  return `${prefix}_${idCounter}_${Math.random().toString(36).substr(2, 6)}`;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getUserById(id: string): User | undefined {
  return userByIdStore.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  return userStore.get(email.toLowerCase());
}

export async function addUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  organization?: User["organization"]
): Promise<User> {
  const id = generateId("user");
  const hashedPassword = await hashPassword(password);
  const user: User = {
    id,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    isVerified: role === "BENEFICIARY",
    isActive: true,
    organization,
    kycStatus: role === "BENEFICIARY" ? "APPROVED" : "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  userStore.set(email.toLowerCase(), user);
  userByIdStore.set(id, user);
  scheduleSave();
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const user = userByIdStore.get(id);
  if (!user) return null;
  
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  userStore.set(user.email.toLowerCase(), updatedUser);
  userByIdStore.set(id, updatedUser);
  scheduleSave();
  return updatedUser;
}

// ==================== LISTING HELPERS ====================

export function addListing(listing: Omit<FoodListing, "id" | "createdAt" | "updatedAt">): FoodListing {
  const id = generateId("listing");
  const newListing: FoodListing = {
    ...listing,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  listingStore.set(id, newListing);
  scheduleSave();
  return newListing;
}

export function updateListing(id: string, updates: Partial<FoodListing>): FoodListing | null {
  const listing = listingStore.get(id);
  if (!listing) return null;
  
  const updatedListing = { ...listing, ...updates, updatedAt: new Date() };
  listingStore.set(id, updatedListing);
  scheduleSave();
  return updatedListing;
}

export function getListingsByDonor(donorId: string): FoodListing[] {
  return Array.from(listingStore.values()).filter(l => l.donorId === donorId);
}

export function getActiveListings(): FoodListing[] {
  const now = new Date();
  return Array.from(listingStore.values())
    .filter(l => ["ACTIVE", "BIDDING"].includes(l.status) && new Date(l.bestBefore) > now)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==================== BID HELPERS ====================

export function addBid(bid: Omit<Bid, "id" | "createdAt" | "updatedAt">): Bid {
  const id = generateId("bid");
  const newBid: Bid = {
    ...bid,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  bidStore.set(id, newBid);
  
  // Update listing status to BIDDING
  const listing = listingStore.get(bid.listingId);
  if (listing && listing.status === "ACTIVE") {
    updateListing(bid.listingId, { status: "BIDDING" });
  }
  
  // Create notification for donor
  if (listing) {
    addNotification({
      userId: listing.donorId,
      type: "BID_RECEIVED",
      title: "New Bid Received",
      message: `${bid.bidderName} placed a bid on "${listing.title}"`,
      data: { bidId: id, listingId: listing.id },
      read: false,
    });
  }
  
  scheduleSave();
  return newBid;
}

export function updateBid(id: string, updates: Partial<Bid>): Bid | null {
  const bid = bidStore.get(id);
  if (!bid) return null;
  
  const updatedBid = { ...bid, ...updates, updatedAt: new Date() };
  bidStore.set(id, updatedBid);
  scheduleSave();
  return updatedBid;
}

export function getBidsByListing(listingId: string): Bid[] {
  return Array.from(bidStore.values())
    .filter(b => b.listingId === listingId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBidsByBidder(bidderId: string): Bid[] {
  return Array.from(bidStore.values())
    .filter(b => b.bidderId === bidderId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBidsForDonor(donorId: string): Bid[] {
  const donorListingIds = new Set(
    Array.from(listingStore.values())
      .filter(l => l.donorId === donorId)
      .map(l => l.id)
  );
  return Array.from(bidStore.values())
    .filter(b => donorListingIds.has(b.listingId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBidCountForListing(listingId: string): number {
  return Array.from(bidStore.values()).filter(b => b.listingId === listingId && b.status === "PENDING").length;
}

// ==================== COLLECTION HELPERS ====================

export function addCollection(collection: Omit<Collection, "id" | "createdAt" | "updatedAt">): Collection {
  const id = generateId("collection");
  const newCollection: Collection = {
    ...collection,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  collectionStore.set(id, newCollection);
  scheduleSave();
  return newCollection;
}

export function updateCollection(id: string, updates: Partial<Collection>): Collection | null {
  const collection = collectionStore.get(id);
  if (!collection) return null;
  
  const updatedCollection = { ...collection, ...updates, updatedAt: new Date() };
  collectionStore.set(id, updatedCollection);
  scheduleSave();
  return updatedCollection;
}

export function getCollectionsByCollector(collectorId: string): Collection[] {
  return Array.from(collectionStore.values())
    .filter(c => c.collectorId === collectorId)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
}

// ==================== CARBON CREDIT HELPERS ====================

export function addCarbonCredit(credit: Omit<CarbonCredit, "id" | "createdAt" | "updatedAt">): CarbonCredit {
  const id = generateId("carbon");
  const newCredit: CarbonCredit = {
    ...credit,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  carbonStore.set(id, newCredit);
  scheduleSave();
  return newCredit;
}

export function getCarbonCreditsByActor(actorId: string): CarbonCredit[] {
  return Array.from(carbonStore.values())
    .filter(c => c.actorId === actorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCarbonCreditSummary(actorId: string): { total: number; pending: number; minted: number; sold: number; earnings: number } {
  const credits = getCarbonCreditsByActor(actorId);
  return {
    total: credits.reduce((sum, c) => sum + c.credits, 0),
    pending: credits.filter(c => c.status === "PENDING").reduce((sum, c) => sum + c.credits, 0),
    minted: credits.filter(c => ["MINTED", "LISTED"].includes(c.status)).reduce((sum, c) => sum + c.credits, 0),
    sold: credits.filter(c => c.status === "SOLD").reduce((sum, c) => sum + c.credits, 0),
    earnings: credits.filter(c => c.status === "SOLD").reduce((sum, c) => sum + (c.credits * (c.pricePerCredit || 0)), 0),
  };
}

// ==================== REQUEST HELPERS ====================

export function addRequest(request: Omit<FoodRequest, "id" | "createdAt" | "updatedAt">): FoodRequest {
  const id = generateId("request");
  const newRequest: FoodRequest = {
    ...request,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  requestStore.set(id, newRequest);
  scheduleSave();
  return newRequest;
}

export function updateRequest(id: string, updates: Partial<FoodRequest>): FoodRequest | null {
  const request = requestStore.get(id);
  if (!request) return null;
  
  const updatedRequest = { ...request, ...updates, updatedAt: new Date() };
  requestStore.set(id, updatedRequest);
  scheduleSave();
  return updatedRequest;
}

export function getRequestsByNgo(ngoId: string): FoodRequest[] {
  return Array.from(requestStore.values())
    .filter(r => r.ngoId === ngoId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getActiveRequests(): FoodRequest[] {
  const now = new Date();
  return Array.from(requestStore.values())
    .filter(r => r.status === "ACTIVE" && new Date(r.neededBy) > now)
    .sort((a, b) => {
      const urgencyOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
}

// ==================== NOTIFICATION HELPERS ====================

export function addNotification(notification: Omit<Notification, "id" | "createdAt">): Notification {
  const id = generateId("notif");
  const newNotification: Notification = {
    ...notification,
    id,
    createdAt: new Date(),
  };
  notificationStore.set(id, newNotification);
  scheduleSave();
  return newNotification;
}

export function getNotificationsByUser(userId: string): Notification[] {
  return Array.from(notificationStore.values())
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationRead(id: string): void {
  const notification = notificationStore.get(id);
  if (notification) {
    notification.read = true;
    notificationStore.set(id, notification);
    scheduleSave();
  }
}

export function getUnreadNotificationCount(userId: string): number {
  return Array.from(notificationStore.values()).filter(n => n.userId === userId && !n.read).length;
}

// ==================== WASTE ORDER HELPERS ====================

export function addWasteOrder(order: Omit<WasteOrder, "id" | "createdAt" | "updatedAt">): WasteOrder {
  const id = generateId("waste");
  const newOrder: WasteOrder = {
    ...order,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  wasteOrderStore.set(id, newOrder);
  scheduleSave();
  return newOrder;
}

export function getAvailableWasteOrders(): WasteOrder[] {
  return Array.from(wasteOrderStore.values())
    .filter(o => ["AVAILABLE", "BIDDING"].includes(o.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==================== STATS HELPERS ====================

export function getDonorStats(donorId: string) {
  const listings = getListingsByDonor(donorId);
  const activeListings = listings.filter(l => ["ACTIVE", "BIDDING"].includes(l.status));
  const completedListings = listings.filter(l => ["COLLECTED", "DISTRIBUTED"].includes(l.status));
  const bids = getBidsForDonor(donorId);
  const pendingBids = bids.filter(b => b.status === "PENDING");
  const carbonSummary = getCarbonCreditSummary(donorId);
  
  return {
    totalListings: listings.length,
    activeListings: activeListings.length,
    completedListings: completedListings.length,
    totalBids: bids.length,
    pendingBids: pendingBids.length,
    totalKgDonated: completedListings.reduce((sum, l) => sum + l.quantityKg, 0),
    carbonCredits: carbonSummary.total,
    carbonEarnings: carbonSummary.earnings,
    co2Saved: completedListings.reduce((sum, l) => sum + l.quantityKg * 2.5, 0),
    mealsProvided: completedListings.reduce((sum, l) => sum + (l.servings || 0), 0),
  };
}

export function getNgoStats(ngoId: string) {
  const requests = getRequestsByNgo(ngoId);
  const activeRequests = requests.filter(r => r.status === "ACTIVE");
  const bids = getBidsByBidder(ngoId);
  const acceptedBids = bids.filter(b => b.status === "ACCEPTED");
  const distributions = Array.from(distributionStore.values()).filter(d => d.ngoId === ngoId);
  
  return {
    totalRequests: requests.length,
    activeRequests: activeRequests.length,
    totalBids: bids.length,
    acceptedBids: acceptedBids.length,
    pendingBids: bids.filter(b => b.status === "PENDING").length,
    totalDistributions: distributions.length,
    mealsDistributed: distributions.reduce((sum, d) => sum + d.mealsProvided, 0),
    beneficiariesServed: new Set(distributions.flatMap(d => d.beneficiaryCount)).size || distributions.reduce((sum, d) => sum + d.beneficiaryCount, 0),
  };
}

export function getCollectorStats(collectorId: string) {
  const collections = getCollectionsByCollector(collectorId);
  const completedCollections = collections.filter(c => c.status === "COMPLETED");
  const carbonSummary = getCarbonCreditSummary(collectorId);
  
  return {
    totalCollections: collections.length,
    completedCollections: completedCollections.length,
    scheduledCollections: collections.filter(c => c.status === "SCHEDULED").length,
    totalKgCollected: completedCollections.reduce((sum, c) => sum + (c.totalKgCollected || 0), 0),
    edibleKg: completedCollections.reduce((sum, c) => sum + (c.edibleKg || 0), 0),
    wasteKg: completedCollections.reduce((sum, c) => sum + (c.wasteKg || 0), 0),
    carbonCredits: carbonSummary.total,
    impactScore: completedCollections.length * 50 + completedCollections.reduce((sum, c) => sum + (c.totalKgCollected || 0), 0) * 2,
  };
}

export function getAdminStats() {
  const users = Array.from(userStore.values());
  const listings = Array.from(listingStore.values());
  const collections = Array.from(collectionStore.values());
  const carbonCredits = Array.from(carbonStore.values());
  
  return {
    totalUsers: users.length,
    usersByRole: {
      DONOR: users.filter(u => u.role === "DONOR").length,
      NGO: users.filter(u => u.role === "NGO").length,
      COLLECTOR: users.filter(u => u.role === "COLLECTOR").length,
      FARMER: users.filter(u => u.role === "FARMER").length,
      BENEFICIARY: users.filter(u => u.role === "BENEFICIARY").length,
    },
    pendingKyc: users.filter(u => u.kycStatus === "PENDING").length,
    totalListings: listings.length,
    activeListings: listings.filter(l => ["ACTIVE", "BIDDING"].includes(l.status)).length,
    completedListings: listings.filter(l => ["COLLECTED", "DISTRIBUTED"].includes(l.status)).length,
    totalCollections: collections.length,
    completedCollections: collections.filter(c => c.status === "COMPLETED").length,
    totalCarbonCredits: carbonCredits.reduce((sum, c) => sum + c.credits, 0),
    pendingCarbonCredits: carbonCredits.filter(c => c.status === "PENDING").reduce((sum, c) => sum + c.credits, 0),
    totalKgDiverted: listings.filter(l => ["COLLECTED", "DISTRIBUTED"].includes(l.status)).reduce((sum, l) => sum + l.quantityKg, 0),
    totalMeals: listings.filter(l => ["COLLECTED", "DISTRIBUTED"].includes(l.status)).reduce((sum, l) => sum + (l.servings || 0), 0),
  };
}

// ==================== PERSISTENCE ====================

let saveTimeout: NodeJS.Timeout | null = null;

function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveData(), 1000); // Debounce saves
}

function serializeMap<T>(map: Map<string, T>): Record<string, T> {
  const obj: Record<string, T> = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

function deserializeMap<T>(obj: Record<string, T> | undefined): Map<string, T> {
  const map = new Map<string, T>();
  if (obj) {
    Object.entries(obj).forEach(([key, value]) => {
      map.set(key, value);
    });
  }
  return map;
}

export function saveData(): void {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const data = {
      users: serializeMap(userStore),
      listings: serializeMap(listingStore),
      bids: serializeMap(bidStore),
      collections: serializeMap(collectionStore),
      carbon: serializeMap(carbonStore),
      distributions: serializeMap(distributionStore),
      beneficiaries: serializeMap(beneficiaryStore),
      compost: serializeMap(compostStore),
      requests: serializeMap(requestStore),
      wasteOrders: serializeMap(wasteOrderStore),
      notifications: serializeMap(notificationStore),
      impactLogs: serializeMap(impactLogStore),
      savedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("[DataStore] Data saved successfully");
  } catch (error) {
    console.error("[DataStore] Error saving data:", error);
  }
}

export function loadData(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      
      // Clear existing data
      userStore.clear();
      userByIdStore.clear();
      listingStore.clear();
      bidStore.clear();
      collectionStore.clear();
      carbonStore.clear();
      distributionStore.clear();
      beneficiaryStore.clear();
      compostStore.clear();
      requestStore.clear();
      wasteOrderStore.clear();
      notificationStore.clear();
      impactLogStore.clear();
      
      // Load from file
      if (data.users) {
        Object.entries(data.users).forEach(([key, value]) => {
          const user = value as User;
          userStore.set(key, user);
          userByIdStore.set(user.id, user);
        });
      }
      
      if (data.listings) {
        Object.entries(data.listings).forEach(([key, value]) => {
          listingStore.set(key, value as FoodListing);
        });
      }
      
      if (data.bids) {
        Object.entries(data.bids).forEach(([key, value]) => {
          bidStore.set(key, value as Bid);
        });
      }
      
      if (data.collections) {
        Object.entries(data.collections).forEach(([key, value]) => {
          collectionStore.set(key, value as Collection);
        });
      }
      
      if (data.carbon) {
        Object.entries(data.carbon).forEach(([key, value]) => {
          carbonStore.set(key, value as CarbonCredit);
        });
      }
      
      if (data.requests) {
        Object.entries(data.requests).forEach(([key, value]) => {
          requestStore.set(key, value as FoodRequest);
        });
      }
      
      if (data.wasteOrders) {
        Object.entries(data.wasteOrders).forEach(([key, value]) => {
          wasteOrderStore.set(key, value as WasteOrder);
        });
      }
      
      if (data.notifications) {
        Object.entries(data.notifications).forEach(([key, value]) => {
          notificationStore.set(key, value as Notification);
        });
      }
      
      console.log(`[DataStore] Data loaded successfully (saved at: ${data.savedAt})`);
      return;
    }
  } catch (error) {
    console.error("[DataStore] Error loading data:", error);
  }
  
  // Initialize with demo data if no saved data
  initializeDemoData();
}

function initializeDemoData(): void {
  console.log("[DataStore] Initializing with demo data...");
  
  // Initialize users
  demoUsers.forEach((u) => {
    userStore.set(u.email.toLowerCase(), u);
    userByIdStore.set(u.id, u);
  });
  
  // Initialize listings
  demoListings.forEach((l) => listingStore.set(l.id, l));
  
  // Initialize bids
  demoBids.forEach((b) => bidStore.set(b.id, b));
  
  // Initialize carbon credits
  demoCarbonCredits.forEach((c) => carbonStore.set(c.id, c));
  
  // Initialize requests
  demoRequests.forEach((r) => requestStore.set(r.id, r));
  
  // Save initial data
  saveData();
}

// Initialize on module load
loadData();

// ==================== EXPORT STORES ====================

export const stores = {
  users: userStore,
  usersById: userByIdStore,
  listings: listingStore,
  bids: bidStore,
  collections: collectionStore,
  carbon: carbonStore,
  distributions: distributionStore,
  beneficiaries: beneficiaryStore,
  compost: compostStore,
  requests: requestStore,
  wasteOrders: wasteOrderStore,
  notifications: notificationStore,
  impactLogs: impactLogStore,
};

export type Stores = typeof stores;

