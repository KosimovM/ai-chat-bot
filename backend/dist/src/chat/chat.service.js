"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let ChatService = class ChatService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async getChats(userId) {
        return this.prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
    }
    async createChat(userId) {
        return this.prisma.conversation.create({
            data: { userId },
        });
    }
    async getMessages(chatId, userId) {
        const chat = await this.prisma.conversation.findUnique({
            where: { id: chatId },
        });
        if (!chat || chat.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.message.findMany({
            where: { conversationId: chatId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessage(chatId, userId, content) {
        const chat = await this.prisma.conversation.findUnique({
            where: { id: chatId },
            include: { user: { include: { subscription: true } } },
        });
        if (!chat || chat.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const messageCount = await this.prisma.message.count({
            where: { conversation: { userId } },
        });
        const plan = chat.user.subscription?.plan || 'FREE';
        const limit = plan === 'PRO' ? Infinity : plan === 'STARTER' ? 500 : 50;
        if (messageCount >= limit) {
            throw new common_1.ForbiddenException('Message limit reached for your plan. Please upgrade.');
        }
        const userMessage = await this.prisma.message.create({
            data: {
                conversationId: chatId,
                role: 'user',
                content,
            },
        });
        await this.prisma.conversation.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });
        const history = await this.prisma.message.findMany({
            where: { conversationId: chatId },
            orderBy: { createdAt: 'asc' },
            take: 10,
        });
        const aiMessages = history.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const aiResponse = await this.aiService.generateResponse(aiMessages);
        const assistantMessage = await this.prisma.message.create({
            data: {
                conversationId: chatId,
                role: 'assistant',
                content: aiResponse,
            },
        });
        return assistantMessage;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ChatService);
//# sourceMappingURL=chat.service.js.map