'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/useChatStore';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/chats', label: 'Chats', icon: MessageSquare },
    // { href: '/dashboard/settings', label: 'Settings', icon: Settings }, // Not in scope for MVP 50? "Settings" mentioned in Sidebar list
];

export function Sidebar() {
    const pathname = usePathname();
    // We can use mock logout function from store if implemented, or just link to auth
    const logout = useChatStore(state => state.logout);

    return (
        <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white p-6 flex flex-col">
            <div className="flex items-center gap-2 px-2 mb-8">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="text-lg font-bold text-slate-900">SupportBot</span>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
                {/* Settings - adding conceptually even if page doesn't exist */}
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
            </nav>

            <button
                onClick={() => {
                    logout();
                    // In a real app, router.push('/auth/login')
                    window.location.href = '/auth/login';
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors mt-auto"
            >
                <LogOut className="h-5 w-5" />
                Logout
            </button>
        </aside>
    );
}
