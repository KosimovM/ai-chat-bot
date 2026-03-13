'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { Menu, X, Search, Bell, Command, ChevronDown } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

export function Topbar({ onMenuClick, isMenuOpen }: { onMenuClick?: () => void; isMenuOpen?: boolean }) {
    const currentUser = useAuthStore((state) => state.user);

    return (
        <header className="h-20 border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-6 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden rounded-xl h-10 w-10 border bg-white shadow-sm"
                    onClick={onMenuClick}
                >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Search Bar / Command K */}
                <div className="hidden md:flex items-center bg-muted/50 border border-border/40 rounded-2xl px-4 py-2.5 w-full max-w-md group focus-within:bg-card focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                    <Search className="h-4 w-4 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search conversations, files, or tasks..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70 font-medium"
                    />
                    <div className="flex items-center gap-1.5 ml-2 border bg-white rounded-lg px-2 py-1 shadow-sm opacity-60 group-focus-within:opacity-100 transition-opacity">
                        <Command className="h-3 w-3" />
                        <span className="text-[10px] font-bold">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-slate-200 transition-colors">
                    <Button variant="ghost" size="icon" className="relative rounded-xl h-11 w-11 hover:bg-muted transition-all">
                        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                        <span className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full border-2 border-background shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                    </Button>
                    <ThemeToggle />
                </div>

                {currentUser && (
                    <Link href="/profile" className="flex items-center gap-4 group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{currentUser.name}</p>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{currentUser.role || 'Explorer'}</span>
                                <div className="h-1 w-1 rounded-full bg-green-500" />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="h-11 w-11 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-background shadow-xl shadow-black/5 group-hover:scale-110 group-hover:shadow-primary/20 transition-all duration-300">
                                {currentUser.avatarUrl ? (
                                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-white dark:text-slate-900 font-black text-sm">
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-background rounded-lg shadow-md border border-border/50 flex items-center justify-center">
                                <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </header>
    );
}
