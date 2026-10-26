import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqPublicController } from './faq.public.controller';
import { FaqAdminController } from './faq.admin.controller';

@Module({
  controllers: [FaqPublicController, FaqAdminController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
