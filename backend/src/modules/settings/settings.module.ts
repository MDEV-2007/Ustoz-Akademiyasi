import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsPublicController } from './settings.public.controller';
import { SettingsAdminController } from './settings.admin.controller';

@Module({
  controllers: [SettingsPublicController, SettingsAdminController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
