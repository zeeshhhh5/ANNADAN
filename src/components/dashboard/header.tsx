"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const { data: session } = useSession();
  const [notificationCount] = useState(3);

  return (
    <header className="sticky top-0 z-30 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 flex items-center justify-between">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="lg:hidden p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-gray-900 border-gray-800">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search listings, users, orders..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 outline-none">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {notificationCount}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="p-4 flex flex-col items-start gap-1 cursor-pointer">
                <p className="text-sm text-white">New bid received on your listing</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 flex flex-col items-start gap-1 cursor-pointer">
                <p className="text-sm text-white">Your KYC has been approved</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 flex flex-col items-start gap-1 cursor-pointer">
                <p className="text-sm text-white">Carbon credits earned: 2.5</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </DropdownMenuItem>
            </div>
            <div className="p-2 border-t border-gray-800">
              <Button variant="ghost" className="w-full text-green-400 hover:text-green-300">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Info */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-white">{session?.user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">
            {session?.user?.role?.toLowerCase().replace("_", " ")}
          </p>
        </div>
      </div>
    </header>
  );
}
