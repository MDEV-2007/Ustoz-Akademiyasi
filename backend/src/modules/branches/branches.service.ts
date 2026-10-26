import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { GeneralStatus } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findPublicBranches(search?: string, area?: string) {
    const where: any = {
      status: GeneralStatus.ACTIVE,
    };

    if (area && area !== 'Barchasi') {
      where.area = { contains: area, mode: 'insensitive' };
    }

    if (search) {
      const s = search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { area: { contains: s, mode: 'insensitive' } },
        { addressNote: { contains: s, mode: 'insensitive' } },
      ];
    }

    const branches = await this.prisma.branch.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        branchCourses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                level: true,
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return branches.map((b) => ({
      ...b,
      coursesAvailable: b.branchCourses.map((bc) => bc.course.title),
      availableCourses: b.branchCourses.map((bc) => bc.course),
    }));
  }

  async findPublicBySlug(slug: string) {
    const branch = await this.prisma.branch.findFirst({
      where: {
        slug,
        status: GeneralStatus.ACTIVE,
      },
      include: {
        branchCourses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                level: true,
                shortDescription: true,
                priceStatus: true,
                category: { select: { name: true } },
              },
            },
          },
        },
        schedules: {
          where: { status: GeneralStatus.ACTIVE },
          include: {
            course: { select: { title: true, slug: true } },
            teacher: { select: { fullName: true } },
          },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException(`«${slug}» filiali topilmadi yoki ayni paytda faol emas.`);
    }

    return {
      ...branch,
      coursesAvailable: branch.branchCourses.map((bc) => bc.course.title),
      availableCourses: branch.branchCourses.map((bc) => bc.course),
    };
  }

  async findAllAdmin() {
    return this.prisma.branch.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        branchCourses: { include: { course: { select: { id: true, title: true, slug: true } } } },
        _count: { select: { registrations: true, schedules: true } },
      },
    });
  }

  async findOneAdmin(id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        branchCourses: { include: { course: true } },
        schedules: { include: { course: true, teacher: true } },
      },
    });

    if (!branch) {
      throw new NotFoundException("Filial topilmadi.");
    }
    return branch;
  }

  async create(dto: CreateBranchDto, userId?: string) {
    const existing = await this.prisma.branch.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu slug bo‘yicha filial allaqachon mavjud.");
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const branch = await tx.branch.create({
        data: {
          name: dto.name.trim(),
          officialLabel: dto.officialLabel.trim(),
          slug: dto.slug.toLowerCase().trim(),
          district: dto.district?.trim(),
          area: dto.area.trim(),
          address: dto.address?.trim(),
          addressNote: dto.addressNote?.trim(),
          landmark: dto.landmark?.trim(),
          latitude: dto.latitude,
          longitude: dto.longitude,
          phone: dto.phone?.trim() || '+998 55 518 44 00',
          workingHours: dto.workingHours || 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
          description: dto.description?.trim(),
          highlight: dto.highlight?.trim(),
          images: dto.images || [],
          status: dto.status || GeneralStatus.ACTIVE,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
          branchCourses: dto.courseIds
            ? {
                create: dto.courseIds.map((cId) => ({ courseId: cId })),
              }
            : undefined,
        },
      });
      return branch;
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_BRANCH',
          entityType: 'Branch',
          entityId: created.id,
          details: { name: created.name, slug: created.slug },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateBranchDto, userId?: string) {
    const branch = await this.findOneAdmin(id);

    if (dto.slug && dto.slug !== branch.slug) {
      const existing = await this.prisma.branch.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu slug band.");
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.courseIds) {
        await tx.branchCourse.deleteMany({ where: { branchId: branch.id } });
        await tx.branchCourse.createMany({
          data: dto.courseIds.map((courseId) => ({
            branchId: branch.id,
            courseId,
          })),
        });
      }

      return tx.branch.update({
        where: { id: branch.id },
        data: {
          name: dto.name?.trim(),
          officialLabel: dto.officialLabel?.trim(),
          slug: dto.slug?.toLowerCase().trim(),
          district: dto.district?.trim(),
          area: dto.area?.trim(),
          address: dto.address?.trim(),
          addressNote: dto.addressNote?.trim(),
          landmark: dto.landmark?.trim(),
          latitude: dto.latitude,
          longitude: dto.longitude,
          phone: dto.phone?.trim(),
          workingHours: dto.workingHours,
          description: dto.description?.trim(),
          highlight: dto.highlight?.trim(),
          images: dto.images,
          status: dto.status,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
        },
      });
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_BRANCH',
          entityType: 'Branch',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const branch = await this.findOneAdmin(id);
    await this.prisma.branch.update({
      where: { id: branch.id },
      data: { status: GeneralStatus.INACTIVE },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DEACTIVATE_BRANCH',
          entityType: 'Branch',
          entityId: branch.id,
        },
      });
    }

    return { success: true, message: "Filial faolsizlantirildi." };
  }
}
