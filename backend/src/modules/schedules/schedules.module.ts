import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesPublicController } from './schedules.public.controller';
import { SchedulesAdminController } from './schedules.admin.controller';

@Module({
  controllers: [SchedulesPublicController, SchedulesAdminController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
