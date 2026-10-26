import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Course Categories')
@Controller('public/course-categories')
export class CategoriesPublicController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Faol o‘quv kurs kategoriyalari ro‘yxati' })
  async findPublicCategories() {
    return this.categoriesService.findPublicCategories();
  }
}
