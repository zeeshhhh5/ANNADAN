"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sprout,
  Leaf,
  Thermometer,
  Droplets,
  Clock,
  Package,
  TrendingUp,
  Plus,
} from "lucide-react";

export default function FarmerCompostPage() {
  const compostBatches = [
    {
      id: "1",
      name: "Field A - Batch 1",
      inputKg: 500,
      outputKg: 150,
      stage: "READY",
      daysRemaining: 0,
      startDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    {
      id: "2",
      name: "Field B - Batch 1",
      inputKg: 300,
      outputKg: 0,
      stage: "COMPOSTING",
      daysRemaining: 20,
      startDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
  ];

  const stats = {
    totalInput: 1800,
    totalOutput: 540,
    activeBatches: 2,
    readyToUse: 150,
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      COMPOSTING: "bg-yellow-500/10 text-yellow-400",
      MATURING: "bg-blue-500/10 text-blue-400",
      READY: "bg-green-500/10 text-green-400",
    };
    return colors[stage] || colors.COMPOSTING;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Composting</h1>
          <p className="text-gray-400 mt-1">Manage your compost production</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Start New Batch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Input</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalInput} kg</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Compost Produced</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalOutput} kg</p>
              </div>
              <Sprout className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Batches</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.activeBatches}</p>
              </div>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ready to Use</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.readyToUse} kg</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compost Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {compostBatches.map((batch) => (
          <Card key={batch.id} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{batch.name}</CardTitle>
                <Badge className={getStageColor(batch.stage)}>{batch.stage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">
                    {batch.stage === "READY" ? "Complete" : `${batch.daysRemaining} days left`}
                  </span>
                </div>
                <Progress
                  value={batch.stage === "READY" ? 100 : ((45 - batch.daysRemaining) / 45) * 100}
                  className="h-2 bg-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Input</p>
                  <p className="text-white font-medium">{batch.inputKg} kg</p>
                </div>
                <div>
                  <p className="text-gray-400">Expected Output</p>
                  <p className="text-white font-medium">{Math.floor(batch.inputKg * 0.3)} kg</p>
                </div>
              </div>

              {batch.stage === "READY" && (
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Apply to Field
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Card */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Benefits of Composting</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Soil Health", desc: "Improves soil structure and fertility" },
              { title: "Cost Savings", desc: "Reduce fertilizer costs by up to 50%" },
              { title: "Sustainability", desc: "Earn carbon credits for eco-friendly farming" },
            ].map((benefit) => (
              <div key={benefit.title} className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-medium">{benefit.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
