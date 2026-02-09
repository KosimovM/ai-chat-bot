'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, UserCog, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/Button';

const navItems = [
    { href: '/dashboard/chats', label: 'Chats', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: UserCog },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 border-r bg-card/50 backdrop-blur-xl p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground font-bold text-lg">AI</span>
                </div>
                <span className="text-xl font-bold tracking-tight">SupportBot</span>
            </div>

            <nav className="space-y-1.5 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <Button
                variant="ghost"
                onClick={handleLogout}
                className="justify-start gap-3 mt-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                <LogOut className="h-5 w-5" />
                Logout
            </Button>
        </aside>
    );
}

