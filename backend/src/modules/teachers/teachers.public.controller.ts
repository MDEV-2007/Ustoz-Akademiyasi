import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Teachers & Departments')
@Controller('public/teachers')
export class TeachersPublicController {
  constructor(private readonly teachersService: TeachersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Kafedralar va ustozlar jamoasi ro‘yxati' })
  async findPublicTeachers() {
    return this.teachersService.findPublicTeachers();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Ustoz/kafedra tafsiloti' })
  async findPublicBySlug(@Param('slug') slug: string) {
    return this.teachersService.findPublicBySlug(slug);
  }
}
