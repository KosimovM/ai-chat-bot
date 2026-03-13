import { create } from 'zustand';
import api from '../lib/api';

export interface Message {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
}

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Record<string, Message[]>;
    isLoading: boolean;
    isTyping: boolean;
    error: string | null;

    fetchConversations: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    setActiveConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    createConversation: () => Promise<string>;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    messages: {},
    isLoading: false,
    isTyping: false,
    error: null,

    fetchConversations: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/chats');
            set({ conversations: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch conversations', isLoading: false });
        }
    },

    fetchMessages: async (chatId) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/chats/${chatId}/messages`);
            set((state) => ({
                messages: { ...state.messages, [chatId]: response.data },
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: 'Failed to fetch messages', isLoading: false });
        }
    },

    setActiveConversation: (id) => {
        set({ activeConversationId: id, error: null });
        if (!get().messages[id]) {
            get().fetchMessages(id);
        }
    },

    clearError: () => set({ error: null }),

    sendMessage: async (content) => {
        const { activeConversationId } = get();
        if (!activeConversationId) return;

        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            conversationId: activeConversationId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({
            messages: {
                ...state.messages,
                [activeConversationId]: [...(state.messages[activeConversationId] || []), userMsg],
            },
            isTyping: true,
            error: null,
        }));

        try {
            const response = await api.post(`/chats/${activeConversationId}/messages`, { content });
            const assistantMsg = response.data;

            set((state) => ({
                messages: {
                    ...state.messages,
                    [activeConversationId]: [...(state.messages[activeConversationId] || []), assistantMsg],
                },
                isTyping: false,
            }));
        } catch (error: any) {
            set({
                isTyping: false,
                error: error.response?.data?.message || 'Failed to send message'
            });
        }
    },

    createConversation: async () => {
        set({ isLoading: true });
        try {
            const response = await api.post('/chats');
            const newConv = response.data;
            set((state) => ({
                conversations: [newConv, ...state.conversations],
                activeConversationId: newConv.id,
                isLoading: false,
            }));
            return newConv.id;
        } catch (error: any) {
            set({ error: 'Failed to create conversation', isLoading: false });
            return '';
        }
    },
}));
