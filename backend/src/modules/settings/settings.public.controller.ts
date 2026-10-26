import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Site Settings')
@Controller('public/site-settings')
export class SettingsPublicController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Veb-saytning ommaviy umumiy sozlamalari (Aloqa, ijtimoiy tarmoqlar, brend)' })
  async findPublicSettings() {
    return this.settingsService.findPublicSettings();
  }
}
