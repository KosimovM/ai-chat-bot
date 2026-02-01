import { create } from 'zustand';
import { Conversation, Message, User } from '@/types/chat';
import { ChatService } from '@/services/chat.service';

interface ChatState {
    currentUser: User | null;
    conversations: Conversation[];
    activeConversationId: string | null;
    isTyping: boolean;
    error: string | null;

    // Actions
    login: (user: User) => void;
    logout: () => void;
    setActiveConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    addConversation: () => Promise<string>;
    clearError: () => void;
}

// Mock Data
const MOCK_USER: User = {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

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
    currentUser: MOCK_USER,
    conversations: MOCK_CONVERSATIONS,
    activeConversationId: null,
    isTyping: false,
    error: null,

    login: (user) => set({ currentUser: user, error: null }),
    logout: () => set({ currentUser: null, activeConversationId: null, error: null }),

    setActiveConversation: (id) => set({ activeConversationId: id, error: null }),
    clearError: () => set({ error: null }),

    sendMessage: async (content) => {
        const { activeConversationId, currentUser } = get();
        if (!activeConversationId || !currentUser) return;

        set({ error: null });

        try {
            // Optimistic update? Or wait for service? 
            // Creating message locally for immediate feedback is better UX usually, but
            // for now sticking to "Service driven" to prove separation. 
            // The service returns the user message object (simulating backend creation).
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

            // Get Updated History
            const currentConversations = get().conversations;
            const activeConv = currentConversations.find(c => c.id === activeConversationId);
            const history = activeConv ? activeConv.messages : [];

            // Pass history to service
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
        const { currentUser } = get();
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
