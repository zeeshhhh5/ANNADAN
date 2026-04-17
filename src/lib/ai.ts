import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FoodClassification {
  category: string;
  cuisineType: string;
  isVegetarian: boolean;
  allergens: string[];
  estimatedServings: number;
  tags: string[];
  confidence: number;
}

export async function classifyFoodImage(
  imageUrl: string
): Promise<FoodClassification> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a food classification expert. Analyze the food image and return a JSON object with:
- category: one of COOKED_MEALS, RAW_VEGETABLES, FRUITS, DAIRY, BAKERY, BEVERAGES, PACKAGED, MIXED, OTHER
- cuisineType: the cuisine type (Indian, Chinese, Italian, etc.)
- isVegetarian: boolean
- allergens: array of common allergens present (nuts, dairy, gluten, eggs, seafood, soy)
- estimatedServings: estimated number of servings
- tags: array of descriptive tags
- confidence: confidence score 0-1

Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
            {
              type: "text",
              text: "Classify this food item.",
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("Food classification error:", error);
    return {
      category: "OTHER",
      cuisineType: "Unknown",
      isVegetarian: true,
      allergens: [],
      estimatedServings: 1,
      tags: [],
      confidence: 0,
    };
  }
}

interface MatchResult {
  listingId: string;
  score: number;
  reasons: string[];
}

export async function matchNGORequirements(
  requirement: {
    foodCategory: string;
    quantityKg: number;
    urgency: string;
    description?: string;
    lat?: number;
    lng?: number;
  },
  listings: Array<{
    id: string;
    title: string;
    category: string;
    quantityKg: number;
    description?: string;
    lat: number;
    lng: number;
    hoursRemaining: number;
  }>
): Promise<MatchResult[]> {
  if (listings.length === 0) return [];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a food matching expert for a food redistribution platform. 
Given an NGO's food requirement and available listings, rank the listings by relevance.
Consider: food category match, quantity, urgency, proximity, and freshness.
Return a JSON array of objects with: listingId, score (0-100), reasons (array of strings).
Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: JSON.stringify({ requirement, listings }),
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "[]";
    return JSON.parse(content);
  } catch (error) {
    console.error("Matching error:", error);
    return listings.map((l) => ({
      listingId: l.id,
      score: l.category === requirement.foodCategory ? 70 : 30,
      reasons: ["Basic category matching"],
    }));
  }
}

export async function generateImpactSummary(
  stats: {
    mealsDelivered: number;
    kgDiverted: number;
    co2Saved: number;
    creditsEarned: number;
  }
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a brief, inspiring 2-3 sentence impact summary for a food redistribution platform user based on their stats.",
        },
        {
          role: "user",
          content: JSON.stringify(stats),
        },
      ],
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || "Thank you for making a difference!";
  } catch (error) {
    return `You've helped deliver ${stats.mealsDelivered} meals and saved ${stats.co2Saved.toFixed(1)} kg of CO2!`;
  }
}
