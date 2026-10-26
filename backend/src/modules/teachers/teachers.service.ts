import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { GeneralStatus } from '@prisma/client';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findPublicTeachers() {
    return this.prisma.teacher.findMany({
      where: { status: GeneralStatus.ACTIVE },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findPublicBySlug(slug: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { slug, status: GeneralStatus.ACTIVE },
      include: {
        schedules: {
          include: {
            course: { select: { title: true, slug: true } },
            branch: { select: { name: true, slug: true, area: true } },
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`«${slug}» bo‘yicha o‘qituvchi/kafedra topilmadi.`);
    }

    return teacher;
  }

  async findAllAdmin() {
    return this.prisma.teacher.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { schedules: true } },
      },
    });
  }

  async findOneAdmin(id: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { schedules: true },
    });
    if (!teacher) {
      throw new NotFoundException("O‘qituvchi topilmadi.");
    }
    return teacher;
  }

  async create(dto: CreateTeacherDto, userId?: string) {
    const existing = await this.prisma.teacher.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu slug bo‘yicha o‘qituvchi allaqachon mavjud.");
    }

    const created = await this.prisma.teacher.create({
      data: {
        fullName: dto.fullName.trim(),
        slug: dto.slug.toLowerCase().trim(),
        department: dto.department.trim(),
        badge: dto.badge?.trim(),
        qualification: dto.qualification.trim(),
        focus: dto.focus.trim(),
        biography: dto.biography?.trim(),
        photo: dto.photo,
        yearsOfExperience: dto.yearsOfExperience,
        languages: dto.languages || ['Arab tili', 'O‘zbek tili'],
        displayOrder: dto.displayOrder || 0,
        status: dto.status || GeneralStatus.ACTIVE,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_TEACHER',
          entityType: 'Teacher',
          entityId: created.id,
          details: { fullName: created.fullName, slug: created.slug },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateTeacherDto, userId?: string) {
    const teacher = await this.findOneAdmin(id);

    if (dto.slug && dto.slug !== teacher.slug) {
      const existing = await this.prisma.teacher.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu slug band.");
      }
    }

    const updated = await this.prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        fullName: dto.fullName?.trim(),
        slug: dto.slug?.toLowerCase().trim(),
        department: dto.department?.trim(),
        badge: dto.badge?.trim(),
        qualification: dto.qualification?.trim(),
        focus: dto.focus?.trim(),
        biography: dto.biography?.trim(),
        photo: dto.photo,
        yearsOfExperience: dto.yearsOfExperience,
        languages: dto.languages,
        displayOrder: dto.displayOrder,
        status: dto.status,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_TEACHER',
          entityType: 'Teacher',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const teacher = await this.findOneAdmin(id);
    await this.prisma.teacher.update({
      where: { id: teacher.id },
      data: { status: GeneralStatus.INACTIVE },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DEACTIVATE_TEACHER',
          entityType: 'Teacher',
          entityId: teacher.id,
        },
      });
    }

    return { success: true, message: "O‘qituvchi faolsizlantirildi." };
  }
}
