import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Achievements')
@Controller('public/achievements')
export class AchievementsPublicController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Markazning tasdiqlangan statistik ko‘rsatkichlari va yutuqlari' })
  async findPublicAchievements() {
    return this.achievementsService.findPublicAchievements();
  }
}
