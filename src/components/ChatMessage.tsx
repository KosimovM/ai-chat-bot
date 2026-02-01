import * as React from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                'flex w-full gap-4 p-4',
                isUser ? 'flex-row-reverse' : 'flex-row',
                isUser ? 'bg-white' : 'bg-slate-50' // Slight contrast
            )}
        >
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                    isUser ? 'bg-slate-100' : 'bg-blue-100 border-blue-200'
                )}
            >
                {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-blue-600" />}
            </div>

            <div className={cn('flex flex-col max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                        {isUser ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div className={cn(
                    'mt-1 text-sm text-gray-700 whitespace-pre-wrap',
                    // Optional bubble styles if requested, but description said "Message user/bot visually different" which I did with alignment/icons/bg.
                    // Let's add bubble style for better look.
                    isUser ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm px-4 py-2' : 'bg-white border rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm'
                )}>
                    {/* Override text color for bubble */}
                    <p className={isUser ? 'text-white' : 'text-gray-800'}>{message.content}</p>
                </div>
            </div>
        </div>
    );
}
