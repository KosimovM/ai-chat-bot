import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class ChatService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    getChats(userId: string): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            role: string;
            content: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    })[]>;
    createChat(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    getMessages(chatId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        role: string;
        content: string;
    }[]>;
    sendMessage(chatId: string, userId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        role: string;
        content: string;
    }>;
}
