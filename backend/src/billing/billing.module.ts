import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  providers: [BillingService],
  controllers: [BillingController]
})
export class BillingModule {}
