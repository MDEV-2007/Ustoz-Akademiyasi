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
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Branches Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR)
@Controller('admin/branches')
export class BranchesAdminController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha filiallar (Admin)' })
  async findAll() {
    return this.branchesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Filial tafsiloti (Admin)' })
  async findOne(@Param('id') id: string) {
    return this.branchesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi filial qo‘shish' })
  async create(@Body() dto: CreateBranchDto, @CurrentUser('id') userId: string) {
    return this.branchesService.create(dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Filial ma’lumotlarini tahrirlash' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.branchesService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Filialni faolsizlantirish' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.branchesService.remove(id, userId);
  }
}
