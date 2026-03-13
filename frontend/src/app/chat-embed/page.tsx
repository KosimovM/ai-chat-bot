"use client";

import * as React from 'react';
import { ChatMessage } from '../../components/ChatMessage';
import { Button } from '../../components/Button';
import { Send, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInputForm {
    message: string;
}

export default function ChatEmbedPage() {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [chatId, setChatId] = React.useState<string | null>(null);
    const [isTyping, setIsTyping] = React.useState(false);
    const { register, handleSubmit, reset } = useForm<ChatInputForm>();
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Initialize an anonymous chat session
        const initChat = async () => {
            try {
                // In a real SaaS, you'd verify the website domain/key here
                // For MVP, we'll create a session-based or just a new chat
                const response = await api.post('/chats/public'); // Need to add this endpoint or use existing with some logic
                setChatId(response.data.id);
            } catch (error) {
                console.error('Failed to init widget chat', error);
            }
        };
        initChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const onSubmit = async (data: ChatInputForm) => {
        if (!data.message.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: data.message };
        setMessages(prev => [...prev, userMsg]);
        reset();
        setIsTyping(true);

        try {
            // If chatId is not set yet, we might need to handle it
            const response = await api.post(`/chats/${chatId || 'public'}/messages/public`, {
                content: data.message
            });
            setMessages(prev => [...prev, response.data]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: 'err',
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background border rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-slate-900 text-white flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-white/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">AI Support</h3>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <Sparkles className="h-10 w-10 mb-4 text-primary" />
                        <p className="text-sm font-medium">Hello! How can I help you today?</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                        "flex",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                        <div className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium",
                            msg.role === 'user'
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-card border rounded-tl-none shadow-sm"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-1 p-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <input
                        {...register('message')}
                        className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Write a message..."
                        autoComplete="off"
                        disabled={isTyping}
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={isTyping}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
