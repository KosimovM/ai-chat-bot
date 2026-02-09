"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { motion } from "framer-motion";
import { User, Mail, Shield, UserCog, LogOut, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(false);

    if (!user) {
        // In a real app this would be handled by middleware or layout check
        // But for now purely UI
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar / Tabs */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full md:w-64 space-y-2"
                >
                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <Button
                                variant={activeTab === "general" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setActiveTab("general")}
                            >
                                <UserCog className="mr-2 h-4 w-4" />
                                General
                            </Button>
                            <Button
                                variant={activeTab === "security" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setActiveTab("security")}
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                Security
                            </Button>
                            <div className="pt-2 border-t">
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Content Area */}
                <div className="flex-1 w-full">
                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your photo and personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border group">
                                            <span className="text-3xl font-bold text-muted-foreground">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            {/* Hover overlay for upload */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera className="text-white h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">{user.name}</h3>
                                            <p className="text-sm text-muted-foreground">{user.role || "User"}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input defaultValue={user.name} className="pl-9" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input defaultValue={user.email} className="pl-9" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Manage your password and account security.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Current Password</label>
                                        <Input type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">New Password</label>
                                        <Input type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Confirm New Password</label>
                                        <Input type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSave} isLoading={isLoading}>Update Password</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
