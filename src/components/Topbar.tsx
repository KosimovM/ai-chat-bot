'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export function Topbar() {
    const currentUser = useAuthStore((state) => state.user);

    return (
        <header className="h-16 border-b bg-card/50 backdrop-blur-xl px-6 flex items-center justify-end sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-4">
                <ThemeToggle />

                {currentUser && (
                    <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{currentUser.email}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                            {currentUser.avatarUrl ? (
                                <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-primary font-bold">
                                    {currentUser.name.charAt(0)}
                                </span>
                            )}
                        </div>
                    </Link>
                )}
            </div>
        </header>
    );
}

