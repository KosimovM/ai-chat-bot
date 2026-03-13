import { Injectable } from '@nestjs/common';
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
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24-preview',
    });
  }

  async createCheckout(userId: string, plan: 'STARTER' | 'PRO') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const priceId = plan === 'PRO' 
      ? this.configService.get('STRIPE_PRO_PRICE_ID')
      : this.configService.get('STRIPE_STARTER_PRICE_ID');

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
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan as any;

      await this.prisma.subscription.upsert({
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

    return { received: true };
  }
}
