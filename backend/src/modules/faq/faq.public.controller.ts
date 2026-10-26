import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - FAQs')
@Controller('public/faqs')
export class FaqPublicController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tez-tez beriladigan savollar ro‘yxati' })
  @ApiQuery({ name: 'category', required: false, description: 'Kategoriya bo‘yicha filtr' })
  async findPublicFaqs(@Query('category') category?: string) {
    return this.faqService.findPublicFaqs(category);
  }
}
