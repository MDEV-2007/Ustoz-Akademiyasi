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
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - FAQs Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/faqs')
export class FaqAdminController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha savol-javoblar (Admin)' })
  async findAll() {
    return this.faqService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Savol-javob tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.faqService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi savol-javob qo‘shish' })
  async create(@Body() dto: CreateFaqDto, @CurrentUser('id') userId: string) {
    return this.faqService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Savol-javobni tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFaqDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.faqService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Savol-javobni o‘chirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.faqService.remove(id, userId);
  }
}
