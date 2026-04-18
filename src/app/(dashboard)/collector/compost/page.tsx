"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sprout,
  Leaf,
  Thermometer,
  Droplets,
  Clock,
  Package,
  TrendingUp,
  Plus,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

interface CompostBatch {
  id: string;
  name: string;
  inputKg: number;
  currentKg: number;
  stage: string;
  temperature: number;
  moisture: number;
  daysRemaining: number;
  startDate: string;
}

export default function CompostingPage() {
  const [batches, setBatches] = useState<CompostBatch[]>([
    {
      id: "1",
      name: "Batch #001",
      inputKg: 100,
      currentKg: 45,
      stage: "MATURING",
      temperature: 55,
      moisture: 60,
      daysRemaining: 14,
      startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "2",
      name: "Batch #002",
      inputKg: 80,
      currentKg: 80,
      stage: "ACTIVE",
      temperature: 65,
      moisture: 55,
      daysRemaining: 35,
      startDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "3",
      name: "Batch #003",
      inputKg: 120,
      currentKg: 30,
      stage: "READY",
      temperature: 25,
      moisture: 40,
      daysRemaining: 0,
      startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ]);

  const [showNewBatchForm, setShowNewBatchForm] = useState(false);
  const [newBatchKg, setNewBatchKg] = useState("");
  const [creating, setCreating] = useState(false);
  const [harvesting, setHarvesting] = useState<string | null>(null);

  const stats = {
    activeBatches: batches.filter(b => b.stage !== "READY").length,
    readyCompost: batches.filter(b => b.stage === "READY").reduce((sum, b) => sum + b.currentKg, 0),
    totalProcessed: 500,
    carbonCredits: 15,
  };

  const handleStartNewBatch = async () => {
    if (!newBatchKg || parseInt(newBatchKg) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBatch: CompostBatch = {
        id: Date.now().toString(),
        name: `Batch #${String(batches.length + 1).padStart(3, "0")}`,
        inputKg: parseInt(newBatchKg),
        currentKg: parseInt(newBatchKg),
        stage: "ACTIVE",
        temperature: 45,
        moisture: 50,
        daysRemaining: 45,
        startDate: new Date().toISOString(),
      };

      setBatches([newBatch, ...batches]);
      setShowNewBatchForm(false);
      setNewBatchKg("");
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">New Batch Started!</p>
            <p className="text-sm text-gray-400">{newBatch.name} with {newBatch.inputKg}kg of organic waste</p>
          </div>
        </div>
      );
    } catch (error) {
      toast.error("Failed to start new batch");
    } finally {
      setCreating(false);
    }
  };

  const handleHarvest = async (batchId: string) => {
    setHarvesting(batchId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const batch = batches.find(b => b.id === batchId);
      setBatches(batches.filter(b => b.id !== batchId));
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Compost Harvested!</p>
            <p className="text-sm text-gray-400">{batch?.currentKg}kg ready for sale or use. +{((batch?.currentKg || 0) * 0.05).toFixed(1)} carbon credits earned!</p>
          </div>
        </div>
      );
    } catch (error) {
      toast.error("Failed to harvest compost");
    } finally {
      setHarvesting(null);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-orange-500/10 text-orange-400",
      MATURING: "bg-yellow-500/10 text-yellow-400",
      READY: "bg-green-500/10 text-green-400",
    };
    return colors[stage] || colors.ACTIVE;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Composting</h1>
          <p className="text-gray-400 mt-1">Monitor your compost batches</p>
        </div>
        <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={() => setShowNewBatchForm(true)}
        >
          <Sprout className="w-4 h-4 mr-2" />
          Start New Batch
        </Button>
      </div>

      {/* New Batch Form */}
      {showNewBatchForm && (
        <Card className="bg-gray-900 border-green-500/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Start New Compost Batch</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewBatchForm(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-gray-300">Organic Waste Quantity (kg)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={newBatchKg}
                  onChange={(e) => setNewBatchKg(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <Button 
                onClick={handleStartNewBatch} 
                disabled={creating}
                className="bg-green-500 hover:bg-green-600"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Batch
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Expected output: ~{Math.floor(parseInt(newBatchKg || "0") * 0.3)}kg compost in 45 days
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Batches</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.activeBatches}</p>
              </div>
              <Sprout className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ready Compost</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.readyCompost} kg</p>
              </div>
              <Package className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Processed</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalProcessed} kg</p>
              </div>
              <Leaf className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carbon Credits</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.carbonCredits}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compost Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((batch) => (
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
                    {batch.currentKg}/{batch.inputKg} kg
                  </span>
                </div>
                <Progress 
                  value={(1 - batch.currentKg / batch.inputKg) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-gray-300">{batch.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{batch.moisture}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {batch.daysRemaining > 0 
                  ? `${batch.daysRemaining} days remaining`
                  : "Ready for harvest"}
              </div>

              {batch.stage === "READY" && (
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => handleHarvest(batch.id)}
                  disabled={harvesting === batch.id}
                >
                  {harvesting === batch.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Harvesting...
                    </>
                  ) : (
                    "Harvest Compost"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
