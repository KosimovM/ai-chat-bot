export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId?: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    lastMessageAt?: string; 
    messages: Message[];
}
