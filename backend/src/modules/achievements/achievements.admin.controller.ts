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
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Achievements Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/achievements')
export class AchievementsAdminController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha yutuqlar (Admin)' })
  async findAll() {
    return this.achievementsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Yutuq tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.achievementsService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi yutuq/statistika qo‘shish' })
  async create(@Body() dto: CreateAchievementDto, @CurrentUser('id') userId: string) {
    return this.achievementsService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Yutuqni tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAchievementDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.achievementsService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Yutuqni o‘chirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.achievementsService.remove(id, userId);
  }
}
