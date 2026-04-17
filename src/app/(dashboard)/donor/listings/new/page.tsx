"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Clock,
  Leaf,
  Upload,
  MapPin,
  AlertCircle,
  Snowflake,
  CheckCircle,
  X,
  Camera,
} from "lucide-react";
import { FOOD_CATEGORIES } from "@/types";

const ALLERGENS = [
  "Nuts",
  "Dairy",
  "Gluten",
  "Eggs",
  "Seafood",
  "Soy",
  "Sesame",
];

export default function NewListingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [shelfLife, setShelfLife] = useState<{
    hoursRemaining: number;
    status: string;
    freezeAdvisory: string | null;
    color: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "" as string,
      quantityKg: 0,
      servings: 0,
      preparedAt: "",
      bestBefore: "",
      canFreeze: false,
      isVegetarian: true,
      freeForDecomposition: true,
      allergens: [] as string[],
      cuisineType: "",
      images: [] as string[],
      address: "",
      lat: 0,
      lng: 0,
      pickupInstructions: "",
    },
  });

  const preparedAt = watch("preparedAt");
  const bestBefore = watch("bestBefore");
  const category = watch("category");
  const quantityKg = watch("quantityKg");

  useEffect(() => {
    if (preparedAt && bestBefore) {
      const now = new Date();
      const bestBeforeDate = new Date(bestBefore);
      const hoursRemaining = Math.max(
        0,
        (bestBeforeDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      let status = "fresh";
      let color = "green";

      if (hoursRemaining <= 0) {
        status = "expired";
        color = "red";
      } else if (hoursRemaining <= 2) {
        status = "expiring_soon";
        color = "orange";
      } else if (hoursRemaining <= 6) {
        status = "good";
        color = "yellow";
      }

      const freezeAdvisory =
        hoursRemaining > 0 && hoursRemaining <= 4
          ? "Freeze now to extend shelf life by 24-72 hours"
          : null;

      setShelfLife({
        hoursRemaining: Math.round(hoursRemaining * 10) / 10,
        status,
        freezeAdvisory,
        color,
      });
    }
  }, [preparedAt, bestBefore]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("lat", position.coords.latitude);
          setValue("lng", position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, [setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setImages((prev) => [...prev, base64]);
          setValue("images", [...images, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue("images", newImages);
  };

  const toggleAllergen = (allergen: string) => {
    const newAllergens = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter((a) => a !== allergen)
      : [...selectedAllergens, allergen];
    setSelectedAllergens(newAllergens);
    setValue("allergens", newAllergens);
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images,
          allergens: selectedAllergens,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create listing");
      }

      toast.success("Listing created successfully!");
      router.push("/donor/listings");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getShelfLifeColor = (status: string) => {
    const colors: Record<string, string> = {
      fresh: "bg-green-500",
      good: "bg-yellow-500",
      expiring_soon: "bg-orange-500",
      expired: "bg-red-500",
    };
    return colors[status] || colors.fresh;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Post Food Listing</h1>
        <p className="text-gray-400 mt-1">
          Share your surplus food and help reduce waste
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Food Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Biryani - 50 servings"
                  {...register("title")}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">
                  Category *
                </Label>
                <Select onValueChange={(value) => setValue("category", value as any)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {FOOD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-400 text-sm">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the food, ingredients, etc."
                {...register("description")}
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantityKg" className="text-gray-300">
                  Quantity (kg) *
                </Label>
                <Input
                  id="quantityKg"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 25"
                  {...register("quantityKg", { valueAsNumber: true })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.quantityKg && (
                  <p className="text-red-400 text-sm">{errors.quantityKg.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings" className="text-gray-300">
                  Estimated Servings
                </Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder="e.g., 50"
                  {...register("servings", { valueAsNumber: true })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisineType" className="text-gray-300">
                  Cuisine Type
                </Label>
                <Input
                  id="cuisineType"
                  placeholder="e.g., Indian, Chinese"
                  {...register("cuisineType")}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isVegetarian"
                  defaultChecked
                  onCheckedChange={(checked) => setValue("isVegetarian", checked)}
                />
                <Label htmlFor="isVegetarian" className="text-gray-300">
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="canFreeze"
                  onCheckedChange={(checked) => setValue("canFreeze", checked)}
                />
                <Label htmlFor="canFreeze" className="text-gray-300">
                  Can be frozen
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shelf Life */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Shelf Life & Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preparedAt" className="text-gray-300">
                  Prepared At *
                </Label>
                <Input
                  id="preparedAt"
                  type="datetime-local"
                  {...register("preparedAt")}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.preparedAt && (
                  <p className="text-red-400 text-sm">{errors.preparedAt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bestBefore" className="text-gray-300">
                  Best Before *
                </Label>
                <Input
                  id="bestBefore"
                  type="datetime-local"
                  {...register("bestBefore")}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.bestBefore && (
                  <p className="text-red-400 text-sm">{errors.bestBefore.message}</p>
                )}
              </div>
            </div>

            {/* Shelf Life Display */}
            {shelfLife && (
              <div
                className={`p-4 rounded-lg border ${
                  shelfLife.status === "expired"
                    ? "bg-red-500/10 border-red-500/30"
                    : shelfLife.status === "expiring_soon"
                    ? "bg-orange-500/10 border-orange-500/30"
                    : "bg-green-500/10 border-green-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getShelfLifeColor(
                        shelfLife.status
                      )} animate-pulse`}
                    />
                    <div>
                      <p className="text-white font-medium">
                        {shelfLife.status === "expired"
                          ? "Expired"
                          : `${shelfLife.hoursRemaining} hours remaining`}
                      </p>
                      <p className="text-sm text-gray-400">
                        Status: {shelfLife.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  {shelfLife.freezeAdvisory && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <Snowflake className="w-5 h-5" />
                      <span className="text-sm">{shelfLife.freezeAdvisory}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allergens */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Allergens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => (
                <Badge
                  key={allergen}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    selectedAllergens.includes(allergen)
                      ? "bg-orange-500/20 border-orange-500 text-orange-400"
                      : "border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                  onClick={() => toggleAllergen(allergen)}
                >
                  {selectedAllergens.includes(allergen) && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {allergen}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              Food Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Food ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Location */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              Pickup Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">
                Pickup Address *
              </Label>
              <Textarea
                id="address"
                placeholder="Enter full pickup address"
                {...register("address")}
                className="bg-gray-800 border-gray-700 text-white"
              />
              {errors.address && (
                <p className="text-red-400 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupInstructions" className="text-gray-300">
                Pickup Instructions
              </Label>
              <Textarea
                id="pickupInstructions"
                placeholder="Any special instructions for pickup (e.g., use back entrance, ask for manager)"
                {...register("pickupInstructions")}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Free Decomposition */}
        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Free Decomposition Service
                    </h3>
                    <p className="text-gray-300 mt-1">
                      Instead of paying for waste disposal, donate your food and earn carbon credits!
                    </p>
                    {quantityKg > 0 && (
                      <p className="text-green-400 font-medium mt-2">
                        Estimated savings: ₹{(quantityKg * 5).toFixed(0)} | Potential credits:{" "}
                        {((quantityKg * 2.5) / 1000).toFixed(3)}
                      </p>
                    )}
                  </div>
                  <Switch
                    defaultChecked
                    onCheckedChange={(checked) => setValue("freeForDecomposition", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 border-gray-700 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
}
