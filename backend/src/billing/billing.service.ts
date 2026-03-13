import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24-preview',
    });
  }

  async createCheckout(userId: string, plan: 'STARTER' | 'PRO') {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const priceId = plan === 'PRO' 
      ? this.configService.get<string>('STRIPE_PRO_PRICE_ID')
      : this.configService.get<string>('STRIPE_STARTER_PRICE_ID');

    if (!priceId) throw new BadRequestException('Invalid plan');

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

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) return { received: false };

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as any;

      if (userId && plan) {
        await (this.prisma as any).subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: 'active',
            stripeId: session.subscription as string,
          },
          create: {
            userId,
            plan,
            status: 'active',
            stripeId: session.subscription as string,
          },
        });
      }
    }

    return { received: true };
  }
}
