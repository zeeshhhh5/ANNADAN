"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  TrendingUp,
  Wallet,
  Leaf,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function EarningsPage() {
  const { data: session } = useSession();
  const [downloading, setDownloading] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  const stats = {
    totalEarnings: 15750,
    thisMonth: 3250,
    carbonCredits: 45,
    pendingPayout: 1500,
  };

  const transactions = [
    { id: "1", type: "Collection", amount: 500, date: new Date().toISOString(), status: "COMPLETED" },
    { id: "2", type: "Carbon Credit Sale", amount: 750, date: new Date(Date.now() - 86400000).toISOString(), status: "COMPLETED" },
    { id: "3", type: "Collection", amount: 350, date: new Date(Date.now() - 172800000).toISOString(), status: "COMPLETED" },
    { id: "4", type: "Biogas Delivery", amount: 600, date: new Date(Date.now() - 259200000).toISOString(), status: "PENDING" },
    { id: "5", type: "Collection", amount: 450, date: new Date(Date.now() - 345600000).toISOString(), status: "COMPLETED" },
  ];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { generateCollectorEarningsPDF } = await import("@/lib/pdf-generator");
      const doc = generateCollectorEarningsPDF(
        { ...stats, transactions },
        session?.user?.name || "Collector"
      );
      doc.save(`AnnaDaan_Earnings_Statement_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Statement downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download statement");
    } finally {
      setDownloading(false);
    }
  };

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Payout Requested!</p>
            <p className="text-sm text-gray-400">₹{stats.pendingPayout} will be transferred within 2-3 business days</p>
          </div>
        </div>
      );
    } catch (error) {
      toast.error("Failed to request payout");
    } finally {
      setRequestingPayout(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Earnings</h1>
          <p className="text-gray-400 mt-1">Track your income and payouts</p>
        </div>
        <Button 
          className="bg-green-500 hover:bg-green-600" 
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download Statement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.thisMonth.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carbon Credits</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.carbonCredits}</p>
                <p className="text-xs text-gray-400 mt-1">₹{stats.carbonCredits * 150} value</p>
              </div>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Payout</p>
                <p className="text-3xl font-bold text-white mt-1">₹{stats.pendingPayout.toLocaleString()}</p>
              </div>
              <Truck className="w-8 h-8 text-yellow-400" />
            </div>
            <Button 
              size="sm" 
              className="w-full mt-4 bg-green-500 hover:bg-green-600"
              onClick={handleRequestPayout}
              disabled={requestingPayout || stats.pendingPayout === 0}
            >
              {requestingPayout ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Request Payout"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type.includes("Carbon") ? "bg-green-500/10" : "bg-blue-500/10"
                  }`}>
                    {tx.type.includes("Carbon") ? (
                      <Leaf className="w-5 h-5 text-green-400" />
                    ) : (
                      <Truck className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.type}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+₹{tx.amount}</p>
                  <Badge className={tx.status === "COMPLETED" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Food Collections", amount: 8500, percentage: 54 },
              { label: "Carbon Credit Sales", amount: 4500, percentage: 29 },
              { label: "Biogas Deliveries", amount: 2750, percentage: 17 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white">₹{item.amount.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
