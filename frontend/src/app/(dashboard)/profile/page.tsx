"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, UserCog, LogOut, Camera, Bell, ExternalLink, Key, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "../../../lib/utils";
import { useForm } from "react-hook-form";

type ProfileFormValues = {
    name: string;
    email: string;
    password?: string;
};

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        }
    });

    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const onUpdateProfile = async (data: ProfileFormValues) => {
        setIsLoading(true);
        try {
            await updateProfile(data);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: UserCog },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
                <p className="text-muted-foreground font-medium">Manage your profile, security, and notification preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation Sidebar */}
                <div className="w-full lg:w-72 shrink-0 space-y-4">
                    <Card className="border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm overflow-hidden p-2">
                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                                        {tab.label}
                                        {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/40 px-2 pb-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 rounded-2xl text-destructive hover:bg-destructive/10 h-12 font-bold px-4"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none bg-slate-900 text-white p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="font-bold relative z-10">{user.subscription?.plan === 'PRO' ? 'Pro Plan' : user.subscription?.plan === 'STARTER' ? 'Starter Plan' : 'Free Plan'}</h4>
                        <p className="text-xs text-slate-400 mt-1 mb-4 relative z-10">
                            {user.subscription?.plan === 'PRO' ? 'You have unlimited access' : 'Upgrade for more features'}
                        </p>
                        {user.subscription?.plan !== 'PRO' && (
                            <Button className="w-full h-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-bold relative z-10 transition-all active:scale-95">
                                Upgrade <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </Card>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {activeTab === "general" && (
                                <form onSubmit={handleSubmit(onUpdateProfile)}>
                                    <Card className="border-none shadow-2xl shadow-black/5 overflow-hidden">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-2xl font-black tracking-tight">Personal Details</CardTitle>
                                            <CardDescription className="text-base font-medium">This information will be displayed on your profile card.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-6 space-y-10">
                                            {/* Avatar Section */}
                                            <div className="flex flex-col sm:flex-row items-center gap-8 bg-muted/30 p-6 rounded-[2rem] border border-border/50">
                                                <div className="relative group">
                                                    <div className="h-28 w-28 rounded-[2.5rem] bg-background border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-4xl font-black text-primary/30 select-none">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                                            <Camera className="text-white h-8 w-8 scale-75 group-hover:scale-100 transition-transform duration-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center sm:text-left">
                                                    <h3 className="text-xl font-bold tracking-tight">{user.name}</h3>
                                                    <p className="text-sm font-medium text-muted-foreground mt-1">PNG or JPG. Size should be less than 5MB.</p>
                                                    <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                                                        <Button size="sm" type="button" className="rounded-xl px-5">Upload New</Button>
                                                        <Button variant="outline" type="button" size="sm" className="rounded-xl px-5 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">Remove</Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-8 sm:grid-cols-2">
                                                <Input
                                                    label="Full Name"
                                                    {...register("name", { required: "Name is required" })}
                                                    className="rounded-2xl h-12 font-semibold"
                                                    placeholder="Enter your name"
                                                    error={errors.name?.message}
                                                />
                                                <Input
                                                    label="Email Address"
                                                    {...register("email", { required: "Email is required" })}
                                                    className="rounded-2xl h-12 font-semibold"
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    error={errors.email?.message}
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-8 bg-muted/20 flex items-center justify-between border-t border-border/40">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Update your profile settings</p>
                                            <Button
                                                type="submit"
                                                isLoading={isLoading}
                                                className={cn(
                                                    "rounded-2xl h-12 px-10 font-bold transition-all w-full sm:w-auto",
                                                    isSaved ? "bg-green-500 hover:bg-green-600 scale-105" : ""
                                                )}
                                            >
                                                {isSaved ? <><Check className="mr-2 h-5 w-5" /> Saved Successfully</> : "Apply Changes"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            )}

                            {activeTab === "security" && (
                                <Card className="border-none shadow-2xl shadow-black/5">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-2xl font-black tracking-tight">Security & Credentials</CardTitle>
                                        <CardDescription className="text-base font-medium">Protect your workspace with modern security protocols.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6 space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                                    <Key className="h-7 w-7" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold">Password Management</h4>
                                                    <p className="text-sm text-muted-foreground font-medium">Ensure your password is at least 6 characters long and contains unique symbols.</p>
                                                </div>
                                            </div>

                                            <div className="grid gap-6 px-2">
                                                <Input label="New Password" type="password" className="rounded-2xl h-12" />
                                                <Input label="Confirm New Password" type="password" className="rounded-2xl h-12" />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-8 bg-muted/20 border-t border-border/40">
                                        <Button className="rounded-2xl h-12 px-10 font-bold w-full sm:w-auto">Update Security</Button>
                                    </CardFooter>
                                </Card>
                            )}

                            {activeTab === "notifications" && (
                                <Card className="border-none shadow-2xl shadow-black/5">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-2xl font-black tracking-tight">Notification Settings</CardTitle>
                                        <CardDescription className="text-base font-medium">Control how and when you want to be notified by AI.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6">
                                        <div className="flex items-center justify-center h-48 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border/50 text-muted-foreground font-bold italic">
                                            More settings coming soon in the next update...
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-8 bg-muted/20 border-t border-border/40 flex justify-end">
                                        <Button disabled className="rounded-2xl h-12 px-10 font-bold">Save Settings</Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
