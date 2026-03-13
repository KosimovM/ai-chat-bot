import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class ChatService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    getChats(userId: string): Promise<any>;
    createChat(userId: string): Promise<any>;
    getMessages(chatId: string, userId: string): Promise<any>;
    sendMessage(chatId: string, userId: string, content: string): Promise<any>;
}
