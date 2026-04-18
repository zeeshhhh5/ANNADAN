"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  Moon,
  Sun,
  Upload,
  Camera,
  MapPin,
  Building2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Key,
  Trash2,
  QrCode,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    avatar: "",
    role: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newBids: true,
    statusUpdates: true,
    marketing: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Load profile data from API
  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      
      if (data.success) {
        setProfile({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          organization: data.data.organization || "",
          address: data.data.address || "",
          city: data.data.city || "",
          state: data.data.state || "",
          pincode: data.data.pincode || "",
          avatar: data.data.avatar || "",
          role: data.data.role || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      
      const data = await res.json();
      
      if (data.success) {
        await update({ ...session, user: { ...session?.user, ...profile } });
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
        toast.success("Avatar uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings</p>
      </div>

      {/* Theme Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-sm text-gray-400">Switch between light and dark mode</p>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="border-gray-700 text-gray-300"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Profile Information
          </CardTitle>
          <div className="flex items-center gap-2">
            {profile.role && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {profile.role}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadProfile}
              disabled={loadingProfile}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loadingProfile ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full bg-gray-800" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-32 bg-gray-800" />
                  <Skeleton className="h-4 w-48 bg-gray-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 bg-gray-800" />
                ))}
              </div>
            </div>
          ) : (
            <>
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-green-500/20 text-green-400 text-2xl">
                {profile.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </div>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (max. 2MB)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Phone Number</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Organization</Label>
              <Input
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Your organization name"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400" />
              Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-300">Street Address</Label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">City</Label>
                <Input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Mumbai"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">State</Label>
                <Input
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Maharashtra"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Pincode</Label>
                <Input
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="400001"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={loading} className="bg-green-500 hover:bg-green-600">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          </>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Receive push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-400">Receive SMS alerts</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-4">
            <p className="text-gray-400 text-sm">Notification Types</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">New Bids</p>
                <p className="text-sm text-gray-400">When someone bids on your listing</p>
              </div>
              <Switch
                checked={notifications.newBids}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newBids: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Status Updates</p>
                <p className="text-sm text-gray-400">Collection and delivery updates</p>
              </div>
              <Switch
                checked={notifications.statusUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, statusUpdates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Marketing</p>
                <p className="text-sm text-gray-400">Tips, offers, and news</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="border-gray-700 text-gray-300">
            Change Password
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300">
            Enable Two-Factor Authentication
          </Button>
          <Button variant="outline" className="border-red-500/50 text-red-400">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
