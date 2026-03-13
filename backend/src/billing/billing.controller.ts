import { Controller, Post, Body, UseGuards, Request, Headers, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout')
  async createCheckout(@Request() req, @Body('plan') plan: 'STARTER' | 'PRO') {
    return this.billingService.createCheckout(req.user.userId, plan);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: RawBodyRequest<ExpressRequest>,
  ) {
    if (!req.rawBody) throw new BadRequestException('No raw body');
    return this.billingService.handleWebhook(signature, req.rawBody);
  }
}
