import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/article.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Educational Articles')
@Controller('public/articles')
export class ArticlesPublicController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Chop etilgan maqolalar va lug‘atlar ro‘yxati' })
  async findPublicArticles(@Query() query: QueryArticlesDto) {
    return this.articlesService.findPublicArticles(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Maqola tafsiloti (slug orqali)' })
  async findPublicBySlug(@Param('slug') slug: string) {
    return this.articlesService.findPublicBySlug(slug);
  }
}
