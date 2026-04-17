export type UserRole = "ADMIN" | "DONOR" | "NGO" | "COLLECTOR" | "BENEFICIARY";

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

export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DashboardStats {
  totalListings: number;
  activeBids: number;
  kgDiverted: number;
  mealsDelivered: number;
  co2Saved: number;
  creditsEarned: number;
}

export interface FoodListingWithDonor {
  id: string;
  title: string;
  description: string | null;
  category: FoodCategory;
  quantityKg: number;
  servings: number | null;
  preparedAt: Date;
  bestBefore: Date;
  freezeHoursRemaining: number | null;
  canFreeze: boolean;
  isVegetarian: boolean;
  allergens: string[];
  cuisineType: string | null;
  images: string[];
  lat: number;
  lng: number;
  address: string;
  pickupInstructions: string | null;
  status: ListingStatus;
  aiTags: string[];
  freeForDecomposition: boolean;
  decompositionSavings: number | null;
  createdAt: Date;
  donor: {
    id: string;
    name: string;
    avatar: string | null;
    organization: {
      name: string;
      city: string;
    } | null;
  };
  _count: {
    bids: number;
  };
}

export interface BidWithDetails {
  id: string;
  listingId: string;
  bidderId: string;
  bidAmount: number | null;
  message: string | null;
  status: BidStatus;
  isUrgent: boolean;
  createdAt: Date;
  listing: {
    id: string;
    title: string;
    category: FoodCategory;
    quantityKg: number;
    images: string[];
    status: ListingStatus;
  };
  bidder: {
    id: string;
    name: string;
    role: UserRole;
    organization: {
      name: string;
    } | null;
  };
}

export interface NGORequirementWithMatches {
  id: string;
  title: string;
  foodCategory: FoodCategory;
  quantityKg: number;
  servingsNeeded: number | null;
  neededBy: Date;
  urgency: UrgencyLevel;
  description: string | null;
  isActive: boolean;
  fulfilledKg: number;
  createdAt: Date;
  matchedListings?: FoodListingWithDonor[];
}

export interface CollectionWithDetails {
  id: string;
  listingId: string;
  collectorId: string;
  scheduledAt: Date;
  pickedUpAt: Date | null;
  completedAt: Date | null;
  status: string;
  routeData: unknown;
  qualityCheckPhotos: string[];
  qualityNotes: string | null;
  totalKgCollected: number | null;
  edibleKg: number | null;
  wasteKg: number | null;
  listing: FoodListingWithDonor;
}

export interface CarbonCreditSummary {
  totalCredits: number;
  pendingCredits: number;
  soldCredits: number;
  totalEarnings: number;
  currentPrice: number;
}

export interface ImpactSummary {
  mealsDelivered: number;
  kgDiverted: number;
  co2SavedKg: number;
  creditsEarned: number;
  equivalentTrees: number;
  familiesHelped: number;
}

export const FOOD_CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: "COOKED_MEALS", label: "Cooked Meals" },
  { value: "RAW_VEGETABLES", label: "Raw Vegetables" },
  { value: "FRUITS", label: "Fruits" },
  { value: "DAIRY", label: "Dairy Products" },
  { value: "BAKERY", label: "Bakery Items" },
  { value: "BEVERAGES", label: "Beverages" },
  { value: "PACKAGED", label: "Packaged Food" },
  { value: "MIXED", label: "Mixed Items" },
  { value: "OTHER", label: "Other" },
];

export const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: "LOW", label: "Low", color: "bg-gray-500" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-500" },
  { value: "HIGH", label: "High", color: "bg-orange-500" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-500" },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrator",
  DONOR: "Food Donor",
  NGO: "NGO / Charity",
  COLLECTOR: "Collector / Farmer",
  BENEFICIARY: "Beneficiary",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: "Platform administrators",
  DONOR: "Hotels, restaurants, events sharing surplus food",
  NGO: "Organizations distributing food to those in need",
  COLLECTOR: "Collect food waste, manage organic waste & composting",
  BENEFICIARY: "Individuals seeking food assistance",
};
