import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesPublicController } from './articles.public.controller';
import { ArticlesAdminController } from './articles.admin.controller';

@Module({
  controllers: [ArticlesPublicController, ArticlesAdminController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
