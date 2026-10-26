import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticlesDto } from './dto/article.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Articles Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/articles')
export class ArticlesAdminController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha maqolalar (Admin - DRAFT, PUBLISHED, ARCHIVED)' })
  async findAll(@Query() query: QueryArticlesDto) {
    return this.articlesService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Maqola tafsilotlari (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.articlesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi maqola yaratish' })
  async create(@Body() dto: CreateArticleDto, @CurrentUser('id') userId: string) {
    return this.articlesService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Maqolani tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.articlesService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Maqolani arxivlash' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.articlesService.remove(id, userId);
  }
}
