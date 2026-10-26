import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Res,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { LeadsService } from './leads.service';
import {
  QueryLeadsDto,
  UpdateLeadStatusDto,
  AssignManagerDto,
  UpdateInternalNotesDto,
} from './dto/lead-admin.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Leads Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
@Controller('admin/leads')
export class LeadsAdminController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'Arizalar ro‘yxati (Filtr, qidiruv va sahifalash bilan)' })
  async findAll(@Query() query: QueryLeadsDto) {
    return this.leadsService.findAll(query);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Filtrlangan arizalarni CSV formatida yuklab olish' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="ustoz_akademiyasi_arizalar.csv"')
  async exportCsv(@Query() query: QueryLeadsDto, @Res() res: Response) {
    const csvData = await this.leadsService.exportToCsv(query);
    res.send(csvData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Arizaning to‘liq tafsilotlari va status tarixi' })
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Ariza statusini yangilash' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.leadsService.updateStatus(id, dto, userId);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Arizani ma’sul menejerga biriktirish' })
  async assignManager(
    @Param('id') id: string,
    @Body() dto: AssignManagerDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.leadsService.assignManager(id, dto, userId);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Ichki ma’muriyat qaydlarini yangilash' })
  async updateNotes(
    @Param('id') id: string,
    @Body() dto: UpdateInternalNotesDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.leadsService.updateInternalNotes(id, dto, userId);
  }

  @Post(':id/retry-notification')
  @ApiOperation({ summary: 'Muvaffaqiyatsiz bo‘lgan Telegram xabarnomasini qayta yuborish' })
  async retryNotification(@Param('id') id: string) {
    return this.leadsService.retryNotification(id);
  }
}
