'use client';

import * as React from 'react';
import { useChatStore } from '@/store/useChatStore';

export function Topbar() {
    const currentUser = useChatStore((state) => state.currentUser);

    if (!currentUser) return null; // Or skeleton

    return (
        <header className="h-16 border-b bg-white px-6 flex items-center justify-end">
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                    {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                            {currentUser.name.charAt(0)}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
