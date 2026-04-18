"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  familySize: number;
  status: "ACTIVE" | "INACTIVE";
  lastServed?: string;
  totalMealsReceived: number;
}

export default function BeneficiariesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [beneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      address: "Sector 15, Noida",
      familySize: 4,
      status: "ACTIVE",
      lastServed: new Date(Date.now() - 86400000).toISOString(),
      totalMealsReceived: 45,
    },
    {
      id: "2",
      name: "Sunita Devi",
      phone: "+91 87654 32109",
      address: "Mayur Vihar, Delhi",
      familySize: 3,
      status: "ACTIVE",
      lastServed: new Date(Date.now() - 172800000).toISOString(),
      totalMealsReceived: 32,
    },
    {
      id: "3",
      name: "Mohammed Ali",
      phone: "+91 76543 21098",
      address: "Laxmi Nagar, Delhi",
      familySize: 5,
      status: "INACTIVE",
      totalMealsReceived: 18,
    },
  ]);

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: beneficiaries.length,
    active: beneficiaries.filter((b) => b.status === "ACTIVE").length,
    totalMeals: beneficiaries.reduce((sum, b) => sum + b.totalMealsReceived, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Beneficiaries</h1>
          <p className="text-gray-400 mt-1">Manage people you serve</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Beneficiaries</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Meals Served</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalMeals}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search beneficiaries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-800 text-white"
        />
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-4">
        {filteredBeneficiaries.map((beneficiary) => (
          <Card key={beneficiary.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{beneficiary.name}</h3>
                      <Badge
                        className={
                          beneficiary.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                        }
                      >
                        {beneficiary.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {beneficiary.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {beneficiary.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Family of {beneficiary.familySize}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {beneficiary.totalMealsReceived} meals received
                      {beneficiary.lastServed && (
                        <> • Last served {new Date(beneficiary.lastServed).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
