import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChats(req: any): Promise<({
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
    createChat(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    getMessages(chatId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        role: string;
        content: string;
    }[]>;
    sendMessage(chatId: string, content: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        role: string;
        content: string;
    }>;
}
