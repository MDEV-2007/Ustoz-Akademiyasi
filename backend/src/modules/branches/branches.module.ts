import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesPublicController } from './branches.public.controller';
import { BranchesAdminController } from './branches.admin.controller';

@Module({
  controllers: [BranchesPublicController, BranchesAdminController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
