import * as React from 'react';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                'flex w-full gap-3 mb-4',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            <div
                className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-transform duration-200 hover:scale-105',
                    isUser
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-muted border-border text-muted-foreground'
                )}
            >
                {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>

            <div className={cn('flex flex-col max-w-[85%] sm:max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
                <div className={cn(
                    'px-4 py-3 text-sm transition-all duration-200 shadow-sm',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none'
                        : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-none'
                )}>
                    <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                    </p>
                </div>
                <span className="text-[11px] text-muted-foreground mt-1.5 px-1 font-medium italic">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
