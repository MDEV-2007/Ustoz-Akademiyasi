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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Testimonials Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/testimonials')
export class TestimonialsAdminController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha fikrlar (Admin)' })
  async findAll() {
    return this.testimonialsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fikr tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.testimonialsService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi fikr qo‘shish (Rozilik tasdiqlangan bo‘lishi lozim)' })
  async create(@Body() dto: CreateTestimonialDto, @CurrentUser('id') userId: string) {
    return this.testimonialsService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Fikrni tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.testimonialsService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Fikrni o‘chirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.testimonialsService.remove(id, userId);
  }
}
