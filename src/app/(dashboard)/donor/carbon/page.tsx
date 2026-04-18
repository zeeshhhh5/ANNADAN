"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Leaf,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  RefreshCw,
  Download,
  Loader2,
} from "lucide-react";

interface CarbonCredit {
  id: string;
  amount: number;
  source: string;
  status: "PENDING" | "VERIFIED" | "TRADED";
  createdAt: string;
  listingTitle?: string;
}

// Mock credits data
const mockCreditsHistory: CarbonCredit[] = [
  { id: "1", amount: 2.5, source: "Food Donation", status: "VERIFIED", createdAt: new Date().toISOString(), listingTitle: "Biryani - 50 servings" },
  { id: "2", amount: 1.8, source: "Food Donation", status: "VERIFIED", createdAt: new Date(Date.now() - 86400000).toISOString(), listingTitle: "Fresh Vegetables Mix" },
  { id: "3", amount: 3.2, source: "Food Donation", status: "PENDING", createdAt: new Date(Date.now() - 172800000).toISOString(), listingTitle: "Cooked Rice & Dal" },
  { id: "4", amount: 1.2, source: "Food Donation", status: "TRADED", createdAt: new Date(Date.now() - 259200000).toISOString(), listingTitle: "Bread & Pastries" },
  { id: "5", amount: 2.0, source: "Food Donation", status: "VERIFIED", createdAt: new Date(Date.now() - 345600000).toISOString(), listingTitle: "Fruit Basket" },
];

export default function CarbonCreditsPage() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [stats, setStats] = useState({
    totalCredits: 0,
    pendingCredits: 0,
    tradedCredits: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        
        // Use mock data with fallbacks
        const totalCredits = data.data?.carbonCredits || 10.7;
        const pendingCredits = mockCreditsHistory.filter(c => c.status === "PENDING").reduce((sum, c) => sum + c.amount, 0);
        const tradedCredits = mockCreditsHistory.filter(c => c.status === "TRADED").reduce((sum, c) => sum + c.amount, 0);
        
        setStats({
          totalCredits,
          pendingCredits,
          tradedCredits,
          totalValue: totalCredits * 150,
        });
        
        setCredits(mockCreditsHistory);
      } catch (error) {
        console.error("Error fetching carbon data:", error);
        // Set mock data on error
        setStats({
          totalCredits: 10.7,
          pendingCredits: 3.2,
          tradedCredits: 1.2,
          totalValue: 1605,
        });
        setCredits(mockCreditsHistory);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { generateCarbonCreditPDF } = await import("@/lib/pdf-generator");
      const doc = generateCarbonCreditPDF(
        { ...stats, credits },
        session?.user?.name || "Donor"
      );
      doc.save(`AnnaDaan_Carbon_Credits_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Statement downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download statement");
    } finally {
      setDownloading(false);
    }
  };

  const handleTrade = () => {
    toast.info("Carbon credit trading marketplace coming soon!");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      VERIFIED: "bg-green-500/10 text-green-400 border-green-500/20",
      TRADED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return colors[status] || colors.PENDING;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-gray-800" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Credits</h1>
          <p className="text-gray-400 mt-1">Track and trade your carbon credits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-gray-300" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </Button>
          <Button className="bg-green-500 hover:bg-green-600" onClick={handleTrade}>
            <Wallet className="w-4 h-4 mr-2" />
            Trade Credits
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Credits</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalCredits.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Verification</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.pendingCredits.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Credits Traded</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.tradedCredits.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Info */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Current Market Rate</h3>
              <p className="text-gray-300 mt-1">Carbon credits are trading at ₹150 per credit</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-bold text-green-400">₹150</p>
                <p className="text-sm text-green-300 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +5% this week
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Credits History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {credits.map((credit) => (
              <div
                key={credit.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{credit.listingTitle}</p>
                    <p className="text-sm text-gray-400">{credit.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
                  <div className="text-right">
                    <p className="font-bold text-white">+{credit.amount}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(credit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
