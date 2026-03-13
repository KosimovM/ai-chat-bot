import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private configService;
    private prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckout(userId: string, plan: 'STARTER' | 'PRO'): Promise<{
        url: string | null;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
}
