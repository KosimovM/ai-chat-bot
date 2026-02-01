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

// ... (Mock Data omitted, assumes no change needed there for this block if targeting interface/sendMessage)
// Actually I need to be careful with replace_file_content target context. 
// Let's target the interface and the create call separately or use specific blocks.

// Block 1: Interface update

// Mock Data (Kept for initial state)
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

    login: (user) => set({ currentUser: user }),
    logout: () => set({ currentUser: null, activeConversationId: null }),

    setActiveConversation: (id) => set({ activeConversationId: id }),

    sendMessage: async (content) => {
        const { activeConversationId, currentUser, conversations } = get();
        if (!activeConversationId || !currentUser) return;

        // 1. Optimistic / User Message
        // Real app: call API first, then update UI. MVP: UI first (optimistic) or Service first.
        // Let's call service to get the "created" message object (mocking backend ID generation)

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
                isTyping: true, // Start showing typing indicator
            }));

            // 2. Get AI Response
            const aiMsg = await ChatService.getAiResponse(activeConversationId, content);

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
                isTyping: false, // Stop showing typing indicator
            }));
        } catch (error) {
            console.error('Failed to send message', error);
            set({ isTyping: false });
            // Handle error state later
        }
    },

    addConversation: async () => {
        const { currentUser } = get();
        if (!currentUser) return '';

        try {
            const newConv = await ChatService.createConversation(currentUser.id);
            set(state => ({
                conversations: [newConv, ...state.conversations],
                activeConversationId: newConv.id
            }));
            return newConv.id;
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}));
