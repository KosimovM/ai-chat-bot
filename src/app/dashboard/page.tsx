'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Zap, Users, BarChart3, Star } from 'lucide-react';
import { Button } from '@/components/Button';
import { useChatStore } from '@/store/useChatStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function DashboardPage() {
    const currentUser = useChatStore((state) => state.currentUser);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 sm:p-12 text-white shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        Welcome back, <span className="text-primary-foreground underline decoration-primary/40 underline-offset-8">{currentUser?.name || 'Explorer'}</span>!
                    </h1>
                    <p className="text-slate-400 text-lg sm:text-xl font-medium mb-8 leading-relaxed">
                        Your AI-powered assistant is ready to help. Check your recent conversations or start a new quest today.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/dashboard/chats">
                            <Button size="lg" className="rounded-xl h-12 px-8">
                                Resume Chats <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-12 px-8 transition-colors">
                            View Analytics
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Active Chats
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">12</div>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <span className="text-green-500">+2.5%</span> from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Total Users
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">1,284</div>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <span className="text-green-500">+12%</span> active today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            AI Score
                        </CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Star className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">4.9/5.0</div>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            Highly satisfied users
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Featured */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Upgrade to Pro
                        </CardTitle>
                        <CardDescription>
                            Get access to advanced AI models and priority support.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 transition-all duration-300">
                            Explore Plans
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            Usage Reports
                        </CardTitle>
                        <CardDescription>
                            See how many tokens you've used this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[65%] rounded-full transition-all duration-1000 group-hover:w-[70%]" />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">6.5k / 10k tokens</span>
                            <span className="text-xs font-bold text-primary">65% used</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
