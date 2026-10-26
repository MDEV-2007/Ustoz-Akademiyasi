import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Teachers & Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/teachers')
export class TeachersAdminController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha ustozlar (Admin)' })
  async findAll() {
    return this.teachersService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ustoz tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.teachersService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi ustoz/kafedra qo‘shish' })
  async create(@Body() dto: CreateTeacherDto, @CurrentUser('id') userId: string) {
    return this.teachersService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ustoz ma’lumotlarini tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.teachersService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ustozni faolsizlantirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.teachersService.remove(id, userId);
  }
}
