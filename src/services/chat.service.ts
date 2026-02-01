import { Conversation, Message } from '@/types/chat';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ChatService = {
    async sendMessage(conversationId: string, content: string, senderId: string): Promise<Message> {
        // Simulate API call
        await delay(300); // Network delay for user message

        // In a real app, the backend would save the user message and return it.
        // For this mock, we just return the constructed message object to the store.
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        return userMessage;
    },

    async getAiResponse(conversationId: string, userContent: string): Promise<Message> {
        // Simulate AI processing delay
        await delay(1500);

        return {
            id: `msg-bot-${Date.now()}`,
            conversationId,
            senderId: 'bot-1',
            role: 'assistant',
            content: `Mock AI response to: "${userContent}"`,
            createdAt: new Date().toISOString(),
        };
    },

    async createConversation(userId: string): Promise<Conversation> {
        await delay(500);
        const newId = `conv-${Date.now()}`;
        return {
            id: newId,
            userId,
            title: 'New Conversation',
            lastMessageAt: new Date().toISOString(),
            messages: []
        };
    }
};
