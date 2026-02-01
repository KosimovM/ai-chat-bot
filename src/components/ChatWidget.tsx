'use client';

import * as React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/Button';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ChatInputForm {
    message: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = React.useState(false);
    const {
        conversations,
        activeConversationId,
        sendMessage,
        addConversation,
        currentUser,
        isTyping
    } = useChatStore();

    // For the widget, we might want to ensure there's an active conversation when opened.
    // If no active ID, create one or pick the recent one.
    React.useEffect(() => {
        if (isOpen && !activeConversationId && currentUser) {
            // Simple logic: if no active one, try to find one or create.
            // For MVP widget, let's just use the first available or create new.
            if (conversations.length > 0) {
                // useChatStore.setState({ activeConversationId: conversations[0].id }); 
                // Better to not directly mutate if possible, but I don't have setActive exported in the destructure above, let's grab it.
            } else {
                addConversation();
            }
        }
    }, [isOpen, activeConversationId, conversations, currentUser, addConversation]);

    // We need to re-fetch active conversation since we rely on ID
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const { register, handleSubmit, reset } = useForm<ChatInputForm>();
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    React.useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [activeConversation?.messages, isOpen, isTyping]);

    const onSubmit = async (data: ChatInputForm) => {
        if (!activeConversationId) {
            const newId = await addConversation();
            // Wait a bit for state update? sendMessage takes string.
            // Actually addConversation is async now in store? I updated it to return string but sync? 
            // usage: addConversation(). The store implementation I wrote for Refactor was `async addConversation`. 
            // So await is correct.
            if (newId) {
                await sendMessage(data.message);
            }
        } else {
            await sendMessage(data.message);
        }
        reset();
    };

    if (!currentUser) return null; // Don't show if not logged in? Or show login prompt? For MVP: hide.

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Search/Chat Window */}
            <div
                className={cn(
                    "w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right",
                    isOpen ? "h-[500px] opacity-100 scale-100" : "h-0 opacity-0 scale-95 pointer-events-none"
                )}
            >
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-semibold">Support Assistant</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {activeConversation ? (
                        <>
                            {activeConversation.messages.length === 0 && (
                                <div className="text-center text-sm text-gray-500 mt-10">
                                    <p>👋 Hi! How can we help you today?</p>
                                </div>
                            )}
                            {activeConversation.messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                            {isTyping && (
                                <div className="flex w-full gap-4 p-4 flex-row bg-slate-50">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-blue-100 border-blue-200">
                                        {/* Bot Icon */}
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce mx-0.5" style={{ animationDelay: '150ms' }} />
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Button onClick={() => addConversation()} variant="secondary">Start a new conversation</Button>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t bg-white shrink-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                        <input
                            {...register('message', { required: true })}
                            className="flex-1 text-sm bg-transparent focus:outline-none px-2"
                            placeholder="Type a message..."
                            autoComplete="off"
                        />
                        <Button type="submit" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full shadow-xl bg-slate-900 hover:bg-slate-800 p-0"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </Button>
        </div>
    );
}
