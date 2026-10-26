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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto, QuerySchedulesDto } from './dto/schedule.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Schedules Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
@Controller('admin/schedules')
export class SchedulesAdminController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha guruhlar jadvallari (Admin)' })
  async findAll(@Query() query: QuerySchedulesDto) {
    return this.schedulesService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Jadval tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi guruh jadvalini kiritish' })
  async create(@Body() dto: CreateScheduleDto, @CurrentUser('id') userId: string) {
    return this.schedulesService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Guruh jadvalini tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.schedulesService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Guruh jadvalini o‘chirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.schedulesService.remove(id, userId);
  }
}
