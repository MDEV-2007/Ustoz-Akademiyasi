import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@/database/prisma.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Health Checks')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness tekshiruvi' })
  @ApiResponse({ status: 200, description: 'Ilova ishlayapti' })
  checkLiveness() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness tekshiruvi (Ma’lumotlar bazasi ulanishi bilan)' })
  @ApiResponse({ status: 200, description: 'Tizim va ma’lumotlar bazasi tayyor' })
  async checkReadiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'disconnected',
        message: 'Ma’lumotlar bazasi bilan aloqa uzilgan.',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
