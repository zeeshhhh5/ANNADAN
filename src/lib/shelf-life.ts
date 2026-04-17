type FoodCategory =
  | "COOKED_MEALS"
  | "RAW_VEGETABLES"
  | "FRUITS"
  | "DAIRY"
  | "BAKERY"
  | "BEVERAGES"
  | "PACKAGED"
  | "MIXED"
  | "OTHER";

interface ShelfLifeResult {
  hoursRemaining: number;
  status: "fresh" | "good" | "expiring_soon" | "expired";
  freezeAdvisory: string | null;
  freezeExtensionHours: number;
  safeToServe: boolean;
  displayText: string;
  color: string;
}

const CATEGORY_SHELF_LIFE: Record<FoodCategory, { roomTemp: number; frozen: number }> = {
  COOKED_MEALS: { roomTemp: 4, frozen: 72 },
  RAW_VEGETABLES: { roomTemp: 24, frozen: 168 },
  FRUITS: { roomTemp: 48, frozen: 336 },
  DAIRY: { roomTemp: 2, frozen: 48 },
  BAKERY: { roomTemp: 24, frozen: 168 },
  BEVERAGES: { roomTemp: 8, frozen: 0 },
  PACKAGED: { roomTemp: 168, frozen: 720 },
  MIXED: { roomTemp: 4, frozen: 48 },
  OTHER: { roomTemp: 4, frozen: 24 },
};

export function calculateShelfLife(
  preparedAt: Date,
  bestBefore: Date,
  category: FoodCategory,
  canFreeze: boolean = true
): ShelfLifeResult {
  const now = new Date();
  const hoursRemaining = Math.max(
    0,
    (bestBefore.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  const categoryConfig = CATEGORY_SHELF_LIFE[category];
  const freezeExtensionHours = canFreeze ? categoryConfig.frozen : 0;

  let status: ShelfLifeResult["status"];
  let color: string;
  let safeToServe = true;

  if (hoursRemaining <= 0) {
    status = "expired";
    color = "red";
    safeToServe = false;
  } else if (hoursRemaining <= 2) {
    status = "expiring_soon";
    color = "orange";
  } else if (hoursRemaining <= categoryConfig.roomTemp * 0.5) {
    status = "good";
    color = "yellow";
  } else {
    status = "fresh";
    color = "green";
  }

  let freezeAdvisory: string | null = null;
  if (canFreeze && hoursRemaining > 0 && hoursRemaining <= 4 && freezeExtensionHours > 0) {
    freezeAdvisory = `Freeze now to extend shelf life by ${freezeExtensionHours} hours`;
  }

  const displayText = formatShelfLifeDisplay(hoursRemaining, status);

  return {
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    status,
    freezeAdvisory,
    freezeExtensionHours,
    safeToServe,
    displayText,
    color,
  };
}

function formatShelfLifeDisplay(hours: number, status: string): string {
  if (status === "expired") {
    return "Expired";
  }

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min remaining`;
  }

  if (hours < 24) {
    return `${Math.round(hours)}h remaining`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}d ${remainingHours}h remaining`;
}

export function getShelfLifeColor(status: ShelfLifeResult["status"]): string {
  const colors = {
    fresh: "bg-green-500",
    good: "bg-yellow-500",
    expiring_soon: "bg-orange-500",
    expired: "bg-red-500",
  };
  return colors[status];
}

export function estimateBestBefore(
  preparedAt: Date,
  category: FoodCategory
): Date {
  const config = CATEGORY_SHELF_LIFE[category];
  const bestBefore = new Date(preparedAt);
  bestBefore.setHours(bestBefore.getHours() + config.roomTemp);
  return bestBefore;
}

export function calculateServingsFromKg(
  quantityKg: number,
  category: FoodCategory
): number {
  const servingsPerKg: Record<FoodCategory, number> = {
    COOKED_MEALS: 4,
    RAW_VEGETABLES: 6,
    FRUITS: 8,
    DAIRY: 10,
    BAKERY: 8,
    BEVERAGES: 4,
    PACKAGED: 5,
    MIXED: 4,
    OTHER: 4,
  };
  return Math.round(quantityKg * servingsPerKg[category]);
}
