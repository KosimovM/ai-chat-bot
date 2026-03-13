import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChats(req: any): Promise<any>;
    createChat(req: any): Promise<any>;
    getMessages(chatId: string, req: any): Promise<any>;
    sendMessage(chatId: string, content: string, req: any): Promise<any>;
}
