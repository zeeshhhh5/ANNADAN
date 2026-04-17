const CO2_PER_KG_FOOD_WASTE = 2.5;
const CREDITS_PER_TONNE_CO2 = 1;
const BIOGAS_EFFICIENCY_MULTIPLIER = 1.3;

interface CarbonCalculation {
  kgDiverted: number;
  co2SavedKg: number;
  credits: number;
  equivalentTrees: number;
  equivalentCarMiles: number;
}

export function calculateCarbonCredits(
  kgDiverted: number,
  isBiogasProcessed: boolean = false
): CarbonCalculation {
  const multiplier = isBiogasProcessed ? BIOGAS_EFFICIENCY_MULTIPLIER : 1;
  const co2SavedKg = kgDiverted * CO2_PER_KG_FOOD_WASTE * multiplier;
  const co2SavedTonnes = co2SavedKg / 1000;
  const credits = co2SavedTonnes * CREDITS_PER_TONNE_CO2;

  const equivalentTrees = Math.round(co2SavedKg / 21);
  const equivalentCarMiles = Math.round(co2SavedKg / 0.404);

  return {
    kgDiverted,
    co2SavedKg: Math.round(co2SavedKg * 100) / 100,
    credits: Math.round(credits * 1000) / 1000,
    equivalentTrees,
    equivalentCarMiles,
  };
}

export function calculateCreditValue(
  credits: number,
  pricePerCredit: number = 15
): number {
  return Math.round(credits * pricePerCredit * 100) / 100;
}

export function formatCarbonImpact(calculation: CarbonCalculation): string {
  return `${calculation.co2SavedKg.toFixed(2)} kg CO2 saved (equivalent to ${calculation.equivalentTrees} trees planted)`;
}

export function getCarbonCreditTier(totalCredits: number): {
  tier: string;
  color: string;
  nextTier: string | null;
  creditsToNext: number;
} {
  if (totalCredits >= 100) {
    return { tier: "Platinum", color: "bg-purple-500", nextTier: null, creditsToNext: 0 };
  }
  if (totalCredits >= 50) {
    return { tier: "Gold", color: "bg-yellow-500", nextTier: "Platinum", creditsToNext: 100 - totalCredits };
  }
  if (totalCredits >= 20) {
    return { tier: "Silver", color: "bg-gray-400", nextTier: "Gold", creditsToNext: 50 - totalCredits };
  }
  if (totalCredits >= 5) {
    return { tier: "Bronze", color: "bg-orange-600", nextTier: "Silver", creditsToNext: 20 - totalCredits };
  }
  return { tier: "Starter", color: "bg-green-500", nextTier: "Bronze", creditsToNext: 5 - totalCredits };
}

export function calculateDecompositionSavings(
  kgWaste: number,
  marketDecompositionRate: number = 5
): number {
  return Math.round(kgWaste * marketDecompositionRate * 100) / 100;
}

export function calculateFarmerROI(
  organicWasteKg: number,
  pricePerKgOrganic: number,
  chemicalFertilizerPricePerKg: number = 25
): {
  organicCost: number;
  chemicalCost: number;
  savings: number;
  savingsPercentage: number;
} {
  const organicCost = organicWasteKg * pricePerKgOrganic;
  const equivalentChemicalKg = organicWasteKg * 0.3;
  const chemicalCost = equivalentChemicalKg * chemicalFertilizerPricePerKg;

  const savings = chemicalCost - organicCost;
  const savingsPercentage = chemicalCost > 0 ? (savings / chemicalCost) * 100 : 0;

  return {
    organicCost: Math.round(organicCost * 100) / 100,
    chemicalCost: Math.round(chemicalCost * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    savingsPercentage: Math.round(savingsPercentage * 10) / 10,
  };
}
