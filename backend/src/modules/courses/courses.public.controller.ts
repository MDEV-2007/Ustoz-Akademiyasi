import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { QueryCoursesDto } from './dto/course.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Courses')
@Controller('public/courses')
export class CoursesPublicController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Faol kurslar ro‘yxati (Kategoriya, daraja va qidiruv bilan)' })
  @ApiResponse({ status: 200, description: 'Kurslar ro‘yxati' })
  async findPublicCourses(@Query() query: QueryCoursesDto) {
    return this.coursesService.findPublicCourses(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Bosh sahifa uchun tanlangan (featured) kurslar' })
  async findFeaturedCourses() {
    return this.coursesService.findFeaturedCourses();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Kursning to‘liq tafsiloti (slug orqali)' })
  @ApiResponse({ status: 200, description: 'Kurs tafsiloti' })
  @ApiResponse({ status: 404, description: 'Kurs topilmadi' })
  async findPublicBySlug(@Param('slug') slug: string) {
    return this.coursesService.findPublicBySlug(slug);
  }
}
