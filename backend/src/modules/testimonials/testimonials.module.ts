import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsPublicController } from './testimonials.public.controller';
import { TestimonialsAdminController } from './testimonials.admin.controller';

@Module({
  controllers: [TestimonialsPublicController, TestimonialsAdminController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
