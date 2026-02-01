'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { useChatStore } from '@/store/useChatStore';

export default function DashboardPage() {
    const currentUser = useChatStore((state) => state.currentUser);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mb-8">
                Here's what's happening with your support tickets today.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-slate-900 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Active Chats</h3>
                    </div>
                    <div className="text-3xl font-bold">2</div>
                    <p className="text-sm text-gray-500 mt-1">Total active conversations</p>
                </div>

                {/* Placeholders for other stats */}
                <div className="rounded-xl border bg-white p-6 shadow-sm opacity-60">
                    <h3 className="font-semibold text-gray-500 mb-2">Resolved Tickets</h3>
                    <div className="text-3xl font-bold text-gray-400">0</div>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
                <h2 className="text-xl font-semibold mb-2">Ready to help your customers?</h2>
                <p className="text-gray-500 mb-6">Jump into the chat interface to answer questions.</p>
                <Link href="/dashboard/chats">
                    <Button size="lg">
                        Go to Chats <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
