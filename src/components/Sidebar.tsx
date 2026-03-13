'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, UserCog, LogOut, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/Button';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/chats', label: 'Conversations', icon: MessageSquare },
    { href: '/profile', label: 'Settings', icon: Settings },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-card border-r border-border/40 p-6 flex flex-col z-50 transition-transform duration-500 ease-in-out lg:translate-x-0 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand Logo */}
                <div className="flex items-center gap-3 px-2 mb-12">
                    <div className="h-11 w-11 rounded-[1.25rem] bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-xl shadow-slate-900/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Sparkles className="text-white dark:text-slate-900 h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight leading-none block">Antigravity</span>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1.5 block">AI Workspace</span>
                    </div>
                </div>

                {/* Primary Navigation */}
                <div className="flex-1 space-y-8">
                    <div>
                        <p className="px-4 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] mb-4">Main Menu</p>
                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group relative',
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-slate-900 group-hover:scale-110 transition-all")} />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Secondary Navigation / Teams (Placeholder) */}
                    <div>
                        <p className="px-4 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] mb-4">Teams</p>
                        <div className="space-y-1.5">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                                Marketing
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                <div className="h-2 w-2 rounded-full bg-purple-400" />
                                Engineering
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-6 border-t border-border/50">
                    <div className="bg-muted/50 p-4 rounded-2xl mb-4 border border-border/50 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-xs font-bold">Pro Account</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[70%] group-hover:w-[75%] transition-all duration-700" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">1.4k / 2.0k tokens used</p>
                    </div>
                    
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 font-bold px-4"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        </>
    );
}
