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
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, QueryCoursesDto } from './dto/course.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Courses Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/courses')
export class CoursesAdminController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha kurslar ro‘yxati (Admin - DRAFT, PUBLISHED, ARCHIVED)' })
  async findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kursning to‘liq admin tafsilotlari' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi o‘quv kursi yaratish' })
  async create(@Body() dto: CreateCourseDto, @CurrentUser('id') userId: string) {
    return this.coursesService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mavjud kursni tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kursni arxivlash (Soft delete)' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.coursesService.remove(id, userId);
  }
}
