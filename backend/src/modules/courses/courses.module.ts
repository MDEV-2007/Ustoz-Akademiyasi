import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesPublicController } from './courses.public.controller';
import { CoursesAdminController } from './courses.admin.controller';

@Module({
  controllers: [CoursesPublicController, CoursesAdminController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
