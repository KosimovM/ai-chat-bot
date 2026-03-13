import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generateResponse(messages: {
        role: 'user' | 'assistant' | 'system';
        content: string;
    }[]): Promise<string | null>;
}
