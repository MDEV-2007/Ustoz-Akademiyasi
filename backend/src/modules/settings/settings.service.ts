import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findPublicSettings() {
    const settings = await this.prisma.siteSetting.findMany({
      where: { isPublic: true },
    });

    const result: Record<string, any> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }

  async findAllAdmin() {
    return this.prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async update(key: string, dto: UpdateSettingDto, userId?: string) {
    const existing = await this.prisma.siteSetting.findUnique({ where: { key } });

    const updated = await this.prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: dto.value,
        description: dto.description,
        isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
      },
      create: {
        key,
        value: dto.value,
        description: dto.description,
        isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_SETTING',
          entityType: 'SiteSetting',
          entityId: key,
          details: { key, value: dto.value },
        },
      });
    }

    return updated;
  }
}
