import { create } from 'zustand';
import api from '../lib/api';
import { Message, Conversation } from '../types/chat';

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    isLoading: boolean;
    isTyping: boolean;
    error: string | null;

    fetchConversations: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    setActiveConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    addConversation: () => Promise<string>;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    isLoading: false,
    isTyping: false,
    error: null,

    fetchConversations: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/chats');
            // Ensure messages is always an array
            const conversations = response.data.map((c: any) => ({
                ...c,
                title: c.title || `Chat ${c.id.substring(0, 4)}`,
                messages: c.messages || []
            }));
            set({ conversations, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch conversations', isLoading: false });
        }
    },

    fetchMessages: async (chatId) => {
        set({ isLoading: true });
        try {
            const response = await api.get(`/chats/${chatId}/messages`);
            set((state) => ({
                conversations: state.conversations.map(c => 
                    c.id === chatId ? { ...c, messages: response.data } : c
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: 'Failed to fetch messages', isLoading: false });
        }
    },

    setActiveConversation: (id) => {
        set({ activeConversationId: id, error: null });
        const conv = get().conversations.find(c => c.id === id);
        if (conv && (!conv.messages || conv.messages.length === 0)) {
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
            conversations: state.conversations.map(c => 
                c.id === activeConversationId ? { ...c, messages: [...c.messages, userMsg] } : c
            ),
            isTyping: true,
            error: null,
        }));

        try {
            const response = await api.post(`/chats/${activeConversationId}/messages`, { content });
            const assistantMsg = response.data;

            set((state) => ({
                conversations: state.conversations.map(c => 
                    c.id === activeConversationId 
                        ? { ...c, messages: [...c.messages.filter(m => m.id !== tempId), userMsg, assistantMsg] } 
                        : c
                ),
                isTyping: false,
            }));
        } catch (error: any) {
            set({
                isTyping: false,
                error: error.response?.data?.message || 'Failed to send message'
            });
        }
    },

    addConversation: async () => {
        set({ isLoading: true });
        try {
            const response = await api.post('/chats');
            const newConv = {
                ...response.data,
                title: response.data.title || 'New Conversation',
                messages: []
            };
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
