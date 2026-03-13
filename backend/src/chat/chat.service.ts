import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getChats(userId: string) {
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

  async createChat(userId: string) {
    return this.prisma.conversation.create({
      data: { userId },
    });
  }

  async getMessages(chatId: string, userId: string) {
    const chat = await this.prisma.conversation.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.message.findMany({
      where: { conversationId: chatId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(chatId: string, userId: string, content: string) {
    const chat = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: { user: { include: { subscription: true } } },
    });

    if (!chat || chat.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check plan limits (simplification for MVP)
    const messageCount = await this.prisma.message.count({
      where: { conversation: { userId } },
    });

    const plan = chat.user.subscription?.plan || 'FREE';
    const limit = plan === 'PRO' ? Infinity : plan === 'STARTER' ? 500 : 50;

    if (messageCount >= limit) {
      throw new ForbiddenException('Message limit reached for your plan. Please upgrade.');
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: chatId,
        role: 'user',
        content,
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Get previous messages for context
    const history = await this.prisma.message.findMany({
      where: { conversationId: chatId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const aiMessages = history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Get AI response
    const aiResponse = await this.aiService.generateResponse(aiMessages);

    // Save AI message
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: chatId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return assistantMessage;
  }
}
