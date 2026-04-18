"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Users,
  Eye,
} from "lucide-react";

interface KYCRequest {
  id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  organizationName?: string;
  documentType: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function KYCVerificationPage() {
  const [requests] = useState<KYCRequest[]>([
    {
      id: "1",
      userName: "Raj Hotels",
      userEmail: "raj@hotels.com",
      userRole: "DONOR",
      organizationName: "Raj Hotels Pvt Ltd",
      documentType: "GST Certificate",
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    },
    {
      id: "2",
      userName: "Food Care NGO",
      userEmail: "contact@foodcare.org",
      userRole: "NGO",
      organizationName: "Food Care Foundation",
      documentType: "NGO Registration",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      status: "PENDING",
    },
    {
      id: "3",
      userName: "Green Collectors",
      userEmail: "info@greencollect.com",
      userRole: "COLLECTOR",
      organizationName: "Green Collectors Co",
      documentType: "Business License",
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      status: "APPROVED",
    },
  ]);

  const stats = {
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
    total: requests.length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400",
      APPROVED: "bg-green-500/10 text-green-400",
      REJECTED: "bg-red-500/10 text-red-400",
    };
    return colors[status] || colors.PENDING;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      DONOR: "bg-blue-500/10 text-blue-400",
      NGO: "bg-purple-500/10 text-purple-400",
      COLLECTOR: "bg-orange-500/10 text-orange-400",
    };
    return colors[role] || "bg-gray-500/10 text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
        <p className="text-gray-400 mt-1">Review and verify user documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Requests */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-white">{request.userName}</h3>
                      <Badge className={getRoleColor(request.userRole)}>{request.userRole}</Badge>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">{request.userEmail}</p>
                    <p className="text-sm text-gray-500">
                      {request.organizationName} • {request.documentType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {request.status === "PENDING" && (
                    <>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
