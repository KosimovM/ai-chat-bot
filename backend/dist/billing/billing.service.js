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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let BillingService = class BillingService {
    configService;
    prisma;
    stripe;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        this.stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2024-12-18.acacia',
        });
    }
    async createCheckout(userId, plan) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const priceId = plan === 'PRO'
            ? this.configService.get('STRIPE_PRO_PRICE_ID')
            : this.configService.get('STRIPE_STARTER_PRICE_ID');
        if (!priceId)
            throw new common_1.BadRequestException('Invalid plan');
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?success=true`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/dashboard/billing?canceled=true`,
            customer_email: user.email,
            metadata: {
                userId,
                plan,
            },
        });
        return { url: session.url };
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret)
            return { received: false };
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan;
            if (userId && plan) {
                await this.prisma.subscription.upsert({
                    where: { userId },
                    update: {
                        plan,
                        status: 'active',
                        stripeId: session.subscription,
                    },
                    create: {
                        userId,
                        plan,
                        status: 'active',
                        stripeId: session.subscription,
                    },
                });
            }
        }
        return { received: true };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map