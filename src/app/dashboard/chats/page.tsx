'use client';

import * as React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/Button';
import { Send, Plus, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface ChatInputForm {
    message: string;
}

export default function ChatsPage() {
    const { conversations, activeConversationId, setActiveConversation, sendMessage, addConversation, isTyping } = useChatStore();
    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    const { register, handleSubmit, reset } = useForm<ChatInputForm>();
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages, isTyping]);

    // Set initial active conversation if none
    React.useEffect(() => {
        if (!activeConversationId && conversations.length > 0) {
            setActiveConversation(conversations[0].id);
        }
    }, [activeConversationId, conversations, setActiveConversation]);


    const onSubmit = async (data: ChatInputForm) => {
        if (!activeConversationId) return;
        if (!data.message.trim()) return;

        await sendMessage(data.message);
        reset();
    };

    const handleNewChat = () => {
        addConversation();
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* Sidebar - Conversation List */}
            <div className="w-80 flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Messages</h2>
                    <Button size="icon" variant="ghost" onClick={handleNewChat} className="h-8 w-8 p-0" title="New Chat">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {conversations.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 mt-10 p-4">
                            No conversations yet. Start a new one!
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg text-sm transition-colors flex items-start gap-3",
                                    activeConversationId === conv.id ? "bg-slate-100" : "hover:bg-slate-50"
                                )}
                            >
                                <MessageSquare className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                                <div className="overflow-hidden">
                                    <p className={cn("font-medium truncate", activeConversationId === conv.id ? "text-slate-900" : "text-slate-700")}>
                                        {conv.title}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-1">
                                        {conv.messages[conv.messages.length - 1]?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        )))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b bg-slate-50/50">
                            <h3 className="font-semibold">{activeConversation.title}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeConversation.messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                            {isTyping && (
                                <div className="flex w-full gap-4 p-4 flex-row bg-white">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-blue-100 border-blue-200">
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce mx-0.5" style={{ animationDelay: '150ms' }} />
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <div className="flex flex-col max-w-[80%] items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 italic">
                                            Typing...
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t bg-gray-50">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
                                <input
                                    {...register('message')}
                                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="Type your message..."
                                    autoComplete="off"
                                />
                                <Button type="submit" disabled={isTyping}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                        <MessageSquare className="h-12 w-12 text-slate-300" />
                        <p>Select a conversation to start chatting</p>
                        <Button onClick={handleNewChat} variant="secondary">Start New Chat</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
