import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersPublicController } from './teachers.public.controller';
import { TeachersAdminController } from './teachers.admin.controller';

@Module({
  controllers: [TeachersPublicController, TeachersAdminController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
