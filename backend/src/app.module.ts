import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { BranchesModule } from './modules/branches/branches.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { FaqModule } from './modules/faq/faq.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { MediaModule } from './modules/media/media.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { HealthModule } from './modules/health/health.module';
import { TelegramModule } from './integrations/telegram/telegram.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    CoursesModule,
    BranchesModule,
    TeachersModule,
    SchedulesModule,
    LeadsModule,
    ArticlesModule,
    FaqModule,
    TestimonialsModule,
    AchievementsModule,
    MediaModule,
    SettingsModule,
    AnalyticsModule,
    AuditLogsModule,
    HealthModule,
    TelegramModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
