"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Recycle,
  Package,
  Truck,
  Factory,
  Leaf,
  TrendingUp,
  Plus,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

interface WasteRecord {
  id: string;
  type: string;
  quantityKg: number;
  source: string;
  destination: string;
  status: string;
  carbonCredits: number;
  date: string;
}

export default function WasteManagementPage() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([
    {
      id: "1",
      type: "Organic Waste",
      quantityKg: 50,
      source: "Multiple Pickups",
      destination: "Biogas Plant",
      status: "DELIVERED",
      carbonCredits: 2.5,
      date: new Date().toISOString(),
    },
    {
      id: "2",
      type: "Food Scraps",
      quantityKg: 30,
      source: "Restaurant Collection",
      destination: "Composting Facility",
      status: "IN_TRANSIT",
      carbonCredits: 1.5,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      type: "Vegetable Waste",
      quantityKg: 45,
      source: "Market Collection",
      destination: "Biogas Plant",
      status: "DELIVERED",
      carbonCredits: 2.25,
      date: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "Organic Waste",
    quantityKg: "",
    destination: "Biogas Plant",
  });

  const stats = {
    totalWaste: wasteRecords.reduce((sum, r) => sum + r.quantityKg, 0),
    biogasDelivered: wasteRecords.filter(r => r.destination === "Biogas Plant").reduce((sum, r) => sum + r.quantityKg, 0),
    compostDelivered: wasteRecords.filter(r => r.destination === "Composting Facility").reduce((sum, r) => sum + r.quantityKg, 0),
    carbonCredits: wasteRecords.reduce((sum, r) => sum + r.carbonCredits, 0),
  };

  const handleSubmit = async () => {
    if (!formData.quantityKg || parseInt(formData.quantityKg) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const quantity = parseInt(formData.quantityKg);
      const carbonCredits = formData.destination === "Biogas Plant" 
        ? quantity * 0.065 
        : quantity * 0.05;

      const newRecord: WasteRecord = {
        id: Date.now().toString(),
        type: formData.type,
        quantityKg: quantity,
        source: "Collection",
        destination: formData.destination,
        status: "IN_TRANSIT",
        carbonCredits: parseFloat(carbonCredits.toFixed(2)),
        date: new Date().toISOString(),
      };

      setWasteRecords([newRecord, ...wasteRecords]);
      setShowForm(false);
      setFormData({ type: "Organic Waste", quantityKg: "", destination: "Biogas Plant" });

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Delivery Logged!</p>
            <p className="text-sm text-gray-400">{quantity}kg to {formData.destination}. +{carbonCredits.toFixed(2)} carbon credits</p>
          </div>
        </div>
      );
    } catch (error) {
      toast.error("Failed to log delivery");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400",
      IN_TRANSIT: "bg-blue-500/10 text-blue-400",
      DELIVERED: "bg-green-500/10 text-green-400",
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Waste Management</h1>
          <p className="text-gray-400 mt-1">Track organic waste processing</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Waste Delivery
        </Button>
      </div>

      {/* Log Delivery Form */}
      {showForm && (
        <Card className="bg-gray-900 border-green-500/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Log Waste Delivery</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Waste Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                >
                  <option>Organic Waste</option>
                  <option>Food Scraps</option>
                  <option>Vegetable Waste</option>
                  <option>Mixed Organic</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-300">Quantity (kg)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.quantityKg}
                  onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Destination</Label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                >
                  <option>Biogas Plant</option>
                  <option>Composting Facility</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Estimated credits: +{(parseInt(formData.quantityKg || "0") * (formData.destination === "Biogas Plant" ? 0.065 : 0.05)).toFixed(2)}
              </p>
              <Button onClick={handleSubmit} disabled={submitting} className="bg-green-500 hover:bg-green-600">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-2" />
                    Log Delivery
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Waste Processed</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalWaste} kg</p>
              </div>
              <Recycle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">To Biogas Plants</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.biogasDelivered} kg</p>
              </div>
              <Factory className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">To Composting</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.compostDelivered} kg</p>
              </div>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carbon Credits Earned</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.carbonCredits}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waste Records */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Waste Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{record.type}</h3>
                      <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {record.quantityKg} kg → {record.destination}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">+{record.carbonCredits} credits</p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Earn More Carbon Credits</h3>
              <p className="text-gray-300 mt-1">
                Deliver organic waste to biogas plants to earn 30% more carbon credits compared to regular composting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
