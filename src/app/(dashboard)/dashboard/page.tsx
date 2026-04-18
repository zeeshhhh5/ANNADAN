import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DonorDashboard } from "@/components/dashboard/donor-dashboard";
import { NGODashboard } from "@/components/dashboard/ngo-dashboard";
import { CollectorDashboard } from "@/components/dashboard/collector-dashboard";
import { BeneficiaryDashboard } from "@/components/dashboard/beneficiary-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { FarmerDashboard } from "@/components/dashboard/farmer-dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  const dashboardComponents: Record<string, React.ComponentType> = {
    ADMIN: AdminDashboard,
    DONOR: DonorDashboard,
    NGO: NGODashboard,
    COLLECTOR: CollectorDashboard,
    FARMER: FarmerDashboard,
    BENEFICIARY: BeneficiaryDashboard,
  };

  const DashboardComponent = dashboardComponents[role] || DonorDashboard;

  return <DashboardComponent />;
}
