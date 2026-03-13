import { create } from 'zustand';
import { Conversation, Message, User } from '@/types/chat';
import { ChatService } from '@/services/chat.service';
import { useAuthStore } from './useAuthStore';

interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    isTyping: boolean;
    error: string | null;

    setActiveConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    addConversation: () => Promise<string>;
    clearError: () => void;
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        userId: 'user-1',
        title: 'Refund Request',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        messages: [
            {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'user-1',
                role: 'user',
                content: 'Hi, I would like to request a refund for my last order.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
                id: 'msg-2',
                conversationId: 'conv-1',
                senderId: 'bot-1',
                role: 'assistant',
                content: 'I can help with that. Could you please provide your order number?',
                createdAt: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
            },
        ],
    },
];

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: MOCK_CONVERSATIONS,
    activeConversationId: null,
    isTyping: false,
    error: null,

    setActiveConversation: (id) => set({ activeConversationId: id, error: null }),
    clearError: () => set({ error: null }),

    sendMessage: async (content) => {
        const { activeConversationId } = get();
        const currentUser = useAuthStore.getState().user;
        
        if (!activeConversationId || !currentUser) {
            set({ error: 'You must be logged in to send messages.' });
            return;
        }

        set({ error: null });

        try {
           const userMsg = await ChatService.sendMessage(activeConversationId, content, currentUser.id);

            set((state) => ({
                conversations: state.conversations.map((c) => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: [...c.messages, userMsg],
                            lastMessageAt: userMsg.createdAt,
                        };
                    }
                    return c;
                }),
                isTyping: true,
            }));

            const currentConversations = get().conversations;
            const activeConv = currentConversations.find(c => c.id === activeConversationId);
            const history = activeConv ? activeConv.messages : [];

            const aiMsg = await ChatService.getAiResponse(activeConversationId, content, history);

            set((state) => ({
                conversations: state.conversations.map((c) => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: [...c.messages, aiMsg],
                            lastMessageAt: aiMsg.createdAt,
                        };
                    }
                    return c;
                }),
                isTyping: false,
            }));
        } catch (error) {
            console.error('Failed to send message', error);
            set({ isTyping: false, error: 'Failed to send message. Please try again.' });
        }
    },

    addConversation: async () => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return '';

        try {
            const newConv = await ChatService.createConversation(currentUser.id);
            set(state => ({
                conversations: [newConv, ...state.conversations],
                activeConversationId: newConv.id,
                error: null
            }));
            return newConv.id;
        } catch (error) {
            console.error(error);
            set({ error: 'Failed to create conversation.' });
            return '';
        }
    }
}));
