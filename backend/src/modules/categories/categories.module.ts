import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesPublicController } from './categories.public.controller';
import { CategoriesAdminController } from './categories.admin.controller';

@Module({
  controllers: [CategoriesPublicController, CategoriesAdminController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
