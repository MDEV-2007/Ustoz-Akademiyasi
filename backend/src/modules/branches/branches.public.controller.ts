import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Branches')
@Controller('public/branches')
export class BranchesPublicController {
  constructor(private readonly branchesService: BranchesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Toshkentdagi 8 ta rasmiy filial ro‘yxati (Qidiruv va tuman bo‘yicha)' })
  @ApiQuery({ name: 'search', required: false, description: 'Filial nomi yoki mo‘ljal qidiruvi' })
  @ApiQuery({ name: 'area', required: false, description: 'Hudud bo‘yicha filtr' })
  async findPublicBranches(
    @Query('search') search?: string,
    @Query('area') area?: string,
  ) {
    return this.branchesService.findPublicBranches(search, area);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Filial tafsiloti (Mavjud kurslar va jadvallar bilan)' })
  async findPublicBySlug(@Param('slug') slug: string) {
    return this.branchesService.findPublicBySlug(slug);
  }
}
