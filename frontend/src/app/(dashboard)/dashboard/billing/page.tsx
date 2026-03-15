"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, Zap, Rocket, Crown, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for exploring our AI capabilities.",
        features: ["50 messages/month", "Standard AI model", "Basic dashboard", "Community support"],
        icon: Zap,
        color: "bg-slate-500",
        planKey: "FREE"
    },
    {
        name: "Starter",
        price: "$19",
        description: "Ideal for small projects and solo founders.",
        features: ["500 messages/month", "Advanced AI model", "Detailed analytics", "Priority support", "Custom widget branding"],
        icon: Rocket,
        color: "bg-primary",
        popular: true,
        planKey: "STARTER"
    },
    {
        name: "Pro",
        price: "$49",
        description: "Scale your business with unlimited power.",
        features: ["Unlimited messages", "Gpt-4o Premium Model", "Remove widget branding", "API access", "24/7 Dedicated support", "Custom training"],
        icon: Crown,
        color: "bg-amber-500",
        planKey: "PRO"
    }
];

export default function BillingPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleUpgrade = async (planKey: string) => {
        if (planKey === 'FREE') return;
        
        setIsLoading(planKey);
        try {
            const response = await api.post('/billing/create-checkout', { plan: planKey });
            if (response.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black tracking-tight mb-2">Subscription & Plans</h1>
                <p className="text-muted-foreground font-medium text-lg">Choose the perfect plan for your customer support needs.</p>
            </div>

            {/* Current Plan Card */}
            <Card className="border-none shadow-2xl shadow-black/5 bg-slate-900 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 bg-primary/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-700" />
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-primary">
                            Current Status
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tight">
                            You are currently on the <span className="text-primary">{user?.subscription?.plan || 'FREE'}</span> plan
                        </h2>
                        <p className="text-slate-400 font-medium max-w-lg">
                            Your billing cycle is monthly. Next payment scheduled for April 13, 2026.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center min-w-[200px] backdrop-blur-sm">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Usage</div>
                        <div className="text-4xl font-black">12/50</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-2 tracking-tighter uppercase">Messages this month</div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                            <div className="w-[24%] h-full bg-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrent = user?.subscription?.plan === plan.planKey || (!user?.subscription?.plan && plan.planKey === 'FREE');
                    
                    return (
                        <Card 
                            key={plan.name} 
                            className={cn(
                                "border-2 rounded-[2.5rem] p-4 flex flex-col transition-all duration-500 hover:-translate-y-2 relative overflow-hidden",
                                plan.popular ? "border-primary shadow-2xl shadow-primary/10" : "border-border/50 shadow-xl shadow-black/5 hover:border-primary/20",
                                isCurrent && "border-green-500/50 bg-green-500/5 dark:bg-green-500/10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                            )}
                            
                            <CardHeader className="space-y-4 pt-4 px-6 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl", plan.color)}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    {plan.popular && (
                                        <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full px-4">Most Popular</span>
                                    )}
                                    {isCurrent && (
                                        <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full px-4">active</span>
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
                                    <CardDescription className="text-base font-medium mt-1">{plan.description}</CardDescription>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="text-muted-foreground font-bold">/mo</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 px-6 space-y-4">
                                <div className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 group/feat">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover/feat:scale-110 transition-transform">
                                                <Check className="h-3.5 w-3.5 text-primary stroke-[3]" />
                                            </div>
                                            <span className="text-sm font-semibold text-muted-foreground group-hover/feat:text-foreground transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-6 px-4 pb-4">
                                <Button 
                                    className={cn(
                                        "w-full h-14 rounded-2xl text-base font-bold transition-all active:scale-95 group",
                                        isCurrent ? "bg-slate-100 text-slate-400 hover:bg-slate-100 dark:bg-white/5 dark:text-white/20" : plan.popular ? "shadow-xl shadow-primary/20" : ""
                                    )}
                                    disabled={isCurrent || !!isLoading}
                                    onClick={() => handleUpgrade(plan.planKey)}
                                >
                                    {isLoading === plan.planKey ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : isCurrent ? (
                                        "Current Plan"
                                    ) : (
                                        <>Upgrade Plan <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Support / Guarantee */}
            <div className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center text-primary border border-border/50">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black italic">Business Guarantee</h4>
                        <p className="text-muted-foreground font-medium max-w-md">
                            All plans are subject to our terms of service. You can cancel your subscription at any time with no hidden fees.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="h-12 rounded-xl px-8 font-bold border-2 whitespace-nowrap">
                    Read FAQ & Terms
                </Button>
            </div>
        </div>
    );
}
