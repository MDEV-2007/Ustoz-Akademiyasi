import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Testimonials')
@Controller('public/testimonials')
export class TestimonialsPublicController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tasdiqlangan va rozilik olingan bitiruvchilar fikrlari' })
  async findPublicTestimonials() {
    return this.testimonialsService.findPublicTestimonials();
  }
}
