'use client';

import * as React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/Button';
import { Send, Plus, MessageSquare, Search, MoreVertical, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ChatInputForm {
    message: string;
}

export default function ChatsPage() {
    const { conversations, activeConversationId, setActiveConversation, sendMessage, addConversation, isTyping, error } = useChatStore();
    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    const { register, handleSubmit, reset } = useForm<ChatInputForm>();
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages, isTyping]);

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

    return (
        <div className="flex h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">
            {/* Conversations Sidebar */}
            <div className="hidden md:flex w-80 flex-col rounded-[2rem] border bg-card shadow-xl shadow-black/5 overflow-hidden">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-xl tracking-tight">Messages</h2>
                        <Button size="icon" variant="secondary" onClick={() => addConversation()} className="h-9 w-9 rounded-xl">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            placeholder="Search chats..." 
                            className="w-full bg-muted/50 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                                <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl text-sm transition-all duration-200 flex items-start gap-3 group",
                                    activeConversationId === conv.id 
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors",
                                    activeConversationId === conv.id ? "bg-white/20 border-white/30" : "bg-muted group-hover:bg-background border-transparent"
                                )}>
                                    <MessageSquare className={cn("h-5 w-5", activeConversationId === conv.id ? "text-white" : "text-muted-foreground")} />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="font-bold truncate max-w-[120px]">
                                            {conv.title}
                                        </p>
                                        <span className={cn("text-[10px] whitespace-nowrap opacity-70", activeConversationId === conv.id ? "text-white" : "")}>
                                            12:45 PM
                                        </span>
                                    </div>
                                    <p className={cn("text-xs truncate italic opacity-80", activeConversationId === conv.id ? "text-white/90" : "text-muted-foreground")}>
                                        {conv.messages[conv.messages.length - 1]?.content || "Started a new conversation..."}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col rounded-[2rem] border bg-card shadow-xl shadow-black/5 overflow-hidden relative">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b bg-card/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-none">{activeConversation.title}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">AI Assistant Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-slate-50/30">
                            {activeConversation.messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-2 mb-4">
                                    <div className="flex gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-xs font-semibold tracking-widest uppercase">AI is thinking</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t bg-card">
                            <form onSubmit={handleSubmit(onSubmit)} className="relative group">
                                {error && (
                                    <div className="absolute bottom-full mb-4 left-0 right-0 animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-destructive/10 text-destructive text-xs font-bold px-4 py-2 rounded-xl border border-destructive/20 shadow-sm flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
                                            {error}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 bg-muted rounded-[1.5rem] p-2 pr-3 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-background shadow-inner transition-all duration-300">
                                    <input
                                        {...register('message')}
                                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/60 font-medium"
                                        placeholder="Ask me anything..."
                                        autoComplete="off"
                                        disabled={isTyping}
                                    />
                                    <Button 
                                        type="submit" 
                                        disabled={isTyping} 
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 rounded-xl transition-all duration-300 shadow-md",
                                            isTyping ? "bg-muted" : "bg-primary hover:scale-110 active:scale-95 shadow-primary/30"
                                        )}
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground/50 mt-3 text-center font-medium tracking-tight uppercase">
                                    Press <kbd className="bg-muted px-1 rounded border shadow-sm">Enter</kbd> to send • AI can make mistakes
                                </p>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center mb-8 border-2 border-primary/10 shadow-inner">
                            <MessageSquare className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-3">Your Space is Ready</h3>
                        <p className="text-muted-foreground max-w-sm mb-10 font-medium leading-relaxed">
                            Select a conversation from the left or start a fresh new journey with our assistant.
                        </p>
                        <Button 
                            onClick={() => addConversation()} 
                            size="lg" 
                            className="rounded-2xl h-14 px-10 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Start New Chat
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
