import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateResponse(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-4o-mini'),
        messages: [
          { role: 'system', content: 'You are a helpful customer support assistant.' },
          ...messages,
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error);
      return 'I am sorry, I am having trouble connecting to my brain right now. Please try again later.';
    }
  }
}
