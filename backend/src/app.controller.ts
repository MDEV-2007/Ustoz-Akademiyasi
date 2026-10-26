import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Root & API Directory')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'API Holati va Ommaviy Yo‘nalishlar Ma’lumotnomasi' })
  getRootInfo() {
    return {
      success: true,
      service: 'Ustoz Akademiyasi Production REST API',
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      documentation: 'http://localhost:4000/api/docs',
      publicEndpoints: {
        healthReady: '/api/v1/health/ready',
        healthLive: '/api/v1/health/live',
        courses: '/api/v1/public/courses',
        branches: '/api/v1/public/branches',
        teachers: '/api/v1/public/teachers',
        articles: '/api/v1/public/articles',
        faqs: '/api/v1/public/faqs',
        siteSettings: '/api/v1/public/site-settings',
        trialRegistration: 'POST /api/v1/public/trial-registrations',
      },
    };
  }
}
