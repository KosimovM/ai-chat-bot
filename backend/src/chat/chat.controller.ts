import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@Request() req) {
    return this.chatService.getChats(req.user.userId);
  }

  @Post()
  async createChat(@Request() req) {
    return this.chatService.createChat(req.user.userId);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') chatId: string, @Request() req) {
    return this.chatService.getMessages(chatId, req.user.userId);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') chatId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.chatService.sendMessage(chatId, req.user.userId, content);
  }
}
