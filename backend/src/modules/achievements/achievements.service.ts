import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';
import { GeneralStatus } from '@prisma/client';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findPublicAchievements() {
    return this.prisma.achievement.findMany({
      where: { status: GeneralStatus.ACTIVE },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.achievement.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOneAdmin(id: string) {
    const ach = await this.prisma.achievement.findUnique({ where: { id } });
    if (!ach) {
      throw new NotFoundException("Yutuq/ko‘rsatkich topilmadi.");
    }
    return ach;
  }

  async create(dto: CreateAchievementDto, userId?: string) {
    const created = await this.prisma.achievement.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        value: dto.value.trim(),
        unit: dto.unit?.trim(),
        icon: dto.icon?.trim() || 'Award',
        displayOrder: dto.displayOrder || 0,
        status: dto.status || GeneralStatus.ACTIVE,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_ACHIEVEMENT',
          entityType: 'Achievement',
          entityId: created.id,
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateAchievementDto, userId?: string) {
    const ach = await this.findOneAdmin(id);

    const updated = await this.prisma.achievement.update({
      where: { id: ach.id },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
        value: dto.value?.trim(),
        unit: dto.unit?.trim(),
        icon: dto.icon?.trim(),
        displayOrder: dto.displayOrder,
        status: dto.status,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_ACHIEVEMENT',
          entityType: 'Achievement',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const ach = await this.findOneAdmin(id);
    await this.prisma.achievement.delete({ where: { id: ach.id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_ACHIEVEMENT',
          entityType: 'Achievement',
          entityId: ach.id,
        },
      });
    }

    return { success: true, message: "Yutuq o‘chirildi." };
  }
}
