import { RawBodyRequest } from '@nestjs/common';
import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createCheckout(req: any, plan: 'STARTER' | 'PRO'): Promise<{
        url: string | null;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
