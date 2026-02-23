import axios from 'axios';
import { Message, Conversation, User } from '@/types/chat';

// Delay helper retained but unused unless we want artificial smooth loaders
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ChatService = {
    async sendMessage(conversationId: string, content: string, senderId: string): Promise<Message> {


        // 1. Create User Message (Optimistic)
        const userMessage: Message = {
            id: `msg-${Date.now()}`, // Temporary ID
            conversationId,
            senderId,
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };

        return userMessage; // We return this immediately for UI display
    },

    async getAiResponse(conversationId: string, userContent: string, history: Message[] = []): Promise<Message> {
        try {
            // Prepare messages for API (History + New Message)
            // Note: In a real robust app, we'd pass the whole history array. 
            // For MVP, passing just the new user message or a limited history is fine.
            // Let's pass the last few messages for context if available + current content.

            const apiMessages = [
                ...history.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: userContent }
            ];

            const response = await axios.post('/api/chat', {
                messages: apiMessages
            });

            const aiContent = response.data.content;

            return {
                id: `msg-bot-${Date.now()}`,
                conversationId,
                senderId: 'bot-1',
                role: 'assistant',
                content: aiContent,
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error('ChatService Error:', error);
            throw error; // Propagate to store for error handling
        }
    },

    async createConversation(userId: string): Promise<Conversation> {
        await delay(300); // Small delay for "creating" feel
        return {
            id: `conv-${Date.now()}`,
            userId,
            title: 'New Conversation',
            messages: [],
            lastMessageAt: new Date().toISOString(),
        };
    },
};
