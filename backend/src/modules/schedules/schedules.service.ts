import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto, QuerySchedulesDto } from './dto/schedule.dto';
import { GeneralStatus, Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async findPublicSchedules(query: QuerySchedulesDto) {
    const where: Prisma.CourseScheduleWhereInput = {
      status: GeneralStatus.ACTIVE,
    };

    if (query.courseId) {
      where.OR = [{ courseId: query.courseId }, { course: { slug: query.courseId } }];
    }

    if (query.branchId) {
      where.OR = [{ branchId: query.branchId }, { branch: { slug: query.branchId } }];
    }

    if (query.teacherId) {
      where.teacherId = query.teacherId;
    }

    return this.prisma.courseSchedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        course: { select: { id: true, title: true, slug: true, level: true } },
        branch: { select: { id: true, name: true, slug: true, area: true } },
        teacher: { select: { id: true, fullName: true, badge: true } },
      },
    });
  }

  async findAllAdmin(query: QuerySchedulesDto) {
    const where: Prisma.CourseScheduleWhereInput = {};
    if (query.courseId) where.courseId = query.courseId;
    if (query.branchId) where.branchId = query.branchId;

    return this.prisma.courseSchedule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { id: true, title: true } },
        branch: { select: { id: true, name: true } },
        teacher: { select: { id: true, fullName: true } },
      },
    });
  }

  async findOneAdmin(id: string) {
    const schedule = await this.prisma.courseSchedule.findUnique({
      where: { id },
      include: { course: true, branch: true, teacher: true },
    });
    if (!schedule) {
      throw new NotFoundException("Dars jadvali topilmadi.");
    }
    return schedule;
  }

  async create(dto: CreateScheduleDto, userId?: string) {
    const created = await this.prisma.courseSchedule.create({
      data: {
        courseId: dto.courseId,
        branchId: dto.branchId,
        teacherId: dto.teacherId,
        daysOfWeek: dto.daysOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        capacity: dto.capacity || 12,
        status: dto.status || GeneralStatus.ACTIVE,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_SCHEDULE',
          entityType: 'CourseSchedule',
          entityId: created.id,
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateScheduleDto, userId?: string) {
    const schedule = await this.findOneAdmin(id);

    const updated = await this.prisma.courseSchedule.update({
      where: { id: schedule.id },
      data: {
        courseId: dto.courseId,
        branchId: dto.branchId,
        teacherId: dto.teacherId,
        daysOfWeek: dto.daysOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        capacity: dto.capacity,
        status: dto.status,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_SCHEDULE',
          entityType: 'CourseSchedule',
          entityId: updated.id,
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const schedule = await this.findOneAdmin(id);
    await this.prisma.courseSchedule.delete({ where: { id: schedule.id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_SCHEDULE',
          entityType: 'CourseSchedule',
          entityId: schedule.id,
        },
      });
    }

    return { success: true, message: "Dars jadvali o‘chirildi." };
  }
}
