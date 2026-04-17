"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconColor = "text-green-400",
}: StatsCardProps) {
  return (
    <Card className={cn("bg-gray-900 border-gray-800", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gray-800"
            )}
          >
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
