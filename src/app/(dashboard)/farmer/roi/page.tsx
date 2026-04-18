"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Calculator,
  Leaf,
  DollarSign,
  Sprout,
} from "lucide-react";

export default function FarmerROIPage() {
  const [inputs, setInputs] = useState({
    wasteKg: 1000,
    wasteCostPerKg: 2,
    fertilizerCostPerKg: 15,
    landAcres: 5,
  });

  const calculations = {
    wasteCost: inputs.wasteKg * inputs.wasteCostPerKg,
    compostOutput: inputs.wasteKg * 0.3,
    fertilizerSaved: inputs.wasteKg * 0.3 * inputs.fertilizerCostPerKg,
    carbonCredits: (inputs.wasteKg * 2.5) / 1000,
    carbonValue: ((inputs.wasteKg * 2.5) / 1000) * 150,
    totalSavings: 0,
    roi: 0,
  };

  calculations.totalSavings = calculations.fertilizerSaved + calculations.carbonValue - calculations.wasteCost;
  calculations.roi = ((calculations.totalSavings / calculations.wasteCost) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">ROI Calculator</h1>
        <p className="text-gray-400 mt-1">Calculate your return on investment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Organic Waste (kg/month)</Label>
              <Input
                type="number"
                value={inputs.wasteKg}
                onChange={(e) => setInputs({ ...inputs, wasteKg: parseInt(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Waste Cost (₹/kg)</Label>
              <Input
                type="number"
                value={inputs.wasteCostPerKg}
                onChange={(e) => setInputs({ ...inputs, wasteCostPerKg: parseFloat(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Chemical Fertilizer Cost (₹/kg)</Label>
              <Input
                type="number"
                value={inputs.fertilizerCostPerKg}
                onChange={(e) => setInputs({ ...inputs, fertilizerCostPerKg: parseFloat(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Land Area (acres)</Label>
              <Input
                type="number"
                value={inputs.landAcres}
                onChange={(e) => setInputs({ ...inputs, landAcres: parseFloat(e.target.value) || 0 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Projected Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Waste Purchase Cost</span>
                <span className="text-red-400 font-medium">-₹{calculations.wasteCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Compost Output</span>
                <span className="text-white font-medium">{calculations.compostOutput.toFixed(0)} kg</span>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fertilizer Savings</span>
                <span className="text-green-400 font-medium">+₹{calculations.fertilizerSaved.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Carbon Credits Earned</span>
                <span className="text-white font-medium">{calculations.carbonCredits.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Carbon Credit Value</span>
                <span className="text-green-400 font-medium">+₹{calculations.carbonValue.toFixed(0)}</span>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Net Savings</span>
                <span className={`text-2xl font-bold ${calculations.totalSavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{calculations.totalSavings.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">ROI</span>
                <span className={`text-2xl font-bold ${calculations.roi >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {calculations.roi.toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Tips to Maximize ROI</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <Sprout className="w-6 h-6 text-green-400 mb-2" />
              <h4 className="text-white font-medium">Quality Compost</h4>
              <p className="text-sm text-gray-400 mt-1">Higher quality compost means better crop yields</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <Leaf className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-white font-medium">Carbon Credits</h4>
              <p className="text-sm text-gray-400 mt-1">Trade credits for additional income</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400 mb-2" />
              <h4 className="text-white font-medium">Bulk Orders</h4>
              <p className="text-sm text-gray-400 mt-1">Order in bulk for better waste prices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
