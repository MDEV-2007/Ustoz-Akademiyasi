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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto/user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - User & Staff Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha ma’muriyat xodimlari ro‘yxati (Faqat Super Admin)' })
  async findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xodim ma’lumotlari' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi ma’muriyat xodimi (Admin/Manager/Editor) yaratish' })
  async create(@Body() dto: CreateUserDto, @CurrentUser('id') creatorId: string) {
    return this.usersService.create(dto, creatorId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Xodim ma’lumotlari, roli yoki statusini o‘zgartirish' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') modifierId: string,
  ) {
    return this.usersService.update(id, dto, modifierId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xodimni faolsizlantirish va sessiyalarini bekor qilish' })
  async remove(@Param('id') id: string, @CurrentUser('id') modifierId: string) {
    return this.usersService.remove(id, modifierId);
  }
}
