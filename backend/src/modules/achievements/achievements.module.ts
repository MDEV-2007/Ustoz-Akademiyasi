import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsPublicController } from './achievements.public.controller';
import { AchievementsAdminController } from './achievements.admin.controller';

@Module({
  controllers: [AchievementsPublicController, AchievementsAdminController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
