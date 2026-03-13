'use client';

import * as React from 'react';
import { useChatStore } from '../store/useChatStore';
import { ChatMessage } from './ChatMessage';
import { Button } from './Button';
import { Send, MessageCircle, X, Sparkles, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

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
        isTyping
    } = useChatStore();
    const currentUser = useAuthStore(state => state.user);

    React.useEffect(() => {
        if (isOpen && !activeConversationId && currentUser) {
            if (conversations.length === 0) {
                addConversation();
            }
        }
    }, [isOpen, activeConversationId, conversations, currentUser, addConversation]);

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
        if (!data.message.trim()) return;

        if (!activeConversationId) {
            const newId = await addConversation();
            if (newId) {
                await sendMessage(data.message);
            }
        } else {
            await sendMessage(data.message);
        }
        reset();
    };

    if (!currentUser) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[600px] max-h-[calc(100vh-120px)] bg-card rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden flex flex-col pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-slate-50/50 custom-scrollbar">
                            {activeConversation ? (
                                <>
                                    {(!activeConversation.messages || activeConversation.messages.length === 0) && (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6 animate-in fade-in zoom-in duration-500">
                                            <div className="h-16 w-16 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary mb-2">
                                                <MessageCircle className="h-8 w-8" />
                                            </div>
                                            <h4 className="text-xl font-black tracking-tight">Hey there! 👋</h4>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                                How can I help you accelerate your workflow today? I'm ready for anything!
                                            </p>
                                        </div>
                                    )}
                                    {activeConversation.messages?.map((msg) => (
                                        <ChatMessage key={msg.id} message={msg} />
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-2 mb-4">
                                            <div className="flex gap-1">
                                                <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="text-[10px] font-bold tracking-widest uppercase">Thinking</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Button onClick={() => addConversation()} variant="default" className="rounded-2xl h-12 shadow-xl shadow-primary/20">
                                        Open Conversation
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-5 border-t bg-card shrink-0">
                            <form onSubmit={handleSubmit(onSubmit)} className="relative group">
                                <div className="flex items-center gap-2 bg-muted rounded-[1.5rem] p-1.5 pr-2 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-background shadow-inner transition-all duration-300">
                                    <input
                                        {...register('message', { required: true })}
                                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/60 font-medium"
                                        placeholder="Send a message..."
                                        autoComplete="off"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl shadow-md bg-primary hover:scale-110 active:scale-95 shadow-primary/30 transition-all"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-16 w-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-500 pointer-events-auto",
                    isOpen
                        ? "bg-slate-900 shadow-slate-900/40 rotate-180"
                        : "bg-primary shadow-primary/40"
                )}
            >
                {isOpen ? (
                    <X className="h-7 w-7 text-white" />
                ) : (
                    <MessageCircle className="h-7 w-7 text-white" />
                )}
            </motion.button>
        </div>
    );
}
