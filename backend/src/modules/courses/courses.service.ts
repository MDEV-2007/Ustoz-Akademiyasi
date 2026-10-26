import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateCourseDto, UpdateCourseDto, QueryCoursesDto } from './dto/course.dto';
import { buildPaginationMeta } from '@/common/dto/pagination.dto';
import { ContentStatus, Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findPublicCourses(query: QueryCoursesDto) {
    const where: Prisma.CourseWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (query.category) {
      where.OR = [
        { category: { slug: query.category } },
        { category: { name: query.category } },
        { categoryId: query.category },
      ];
    }

    if (query.level) {
      where.level = { contains: query.level, mode: 'insensitive' };
    }

    if (query.audience) {
      where.targetAudience = { contains: query.audience, mode: 'insensitive' };
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { shortDescription: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
        include: {
          category: { select: { id: true, name: true, slug: true } },
          outcomes: { select: { text: true, sortOrder: true }, orderBy: { sortOrder: 'asc' }, take: 4 },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findFeaturedCourses() {
    return this.prisma.course.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        featured: true,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        outcomes: { select: { text: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findPublicBySlug(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        category: true,
        outcomes: { orderBy: { sortOrder: 'asc' } },
        syllabusModules: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        branchCourses: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                officialLabel: true,
                slug: true,
                area: true,
                addressNote: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`«${slug}» nomli kurs topilmadi yoki ayni paytda faol emas.`);
    }

    return {
      ...course,
      availableBranches: course.branchCourses.map((bc) => bc.branch),
    };
  }

  async findAllAdmin(query: QueryCoursesDto) {
    const where: Prisma.CourseWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.OR = [
        { category: { slug: query.category } },
        { categoryId: query.category },
      ];
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { slug: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { registrations: true, branchCourses: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findOneAdmin(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        category: true,
        outcomes: { orderBy: { sortOrder: 'asc' } },
        syllabusModules: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        branchCourses: { include: { branch: true } },
      },
    });

    if (!course) {
      throw new NotFoundException("Kurs topilmadi.");
    }

    return course;
  }

  async create(dto: CreateCourseDto, userId?: string) {
    const existing = await this.prisma.course.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu slug bo‘yicha kurs allaqachon mavjud.");
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title: dto.title.trim(),
          slug: dto.slug.toLowerCase().trim(),
          shortDescription: dto.shortDescription.trim(),
          description: dto.description.trim(),
          categoryId: dto.categoryId,
          targetAudience: dto.targetAudience.trim(),
          level: dto.level.trim(),
          durationMonths: dto.durationMonths,
          priceAmount: dto.priceAmount,
          currency: dto.currency || 'UZS',
          ageMinimum: dto.ageMinimum,
          ageMaximum: dto.ageMaximum,
          entryRequirements: dto.entryRequirements?.trim(),
          durationNote: dto.durationNote?.trim(),
          priceStatus: dto.priceStatus?.trim(),
          methodology: dto.methodology?.trim(),
          plateType: dto.plateType,
          coverImage: dto.coverImage,
          status: dto.status || ContentStatus.PUBLISHED,
          featured: dto.featured || false,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
          outcomes: dto.outcomes
            ? {
                create: dto.outcomes.map((o, idx) => ({
                  text: o.text,
                  sortOrder: o.sortOrder ?? idx + 1,
                })),
              }
            : undefined,
          syllabusModules: dto.syllabusModules
            ? {
                create: dto.syllabusModules.map((m, idx) => ({
                  title: m.title,
                  topics: m.topics,
                  sortOrder: m.sortOrder ?? idx + 1,
                })),
              }
            : undefined,
          faqs: dto.faqs
            ? {
                create: dto.faqs.map((f, idx) => ({
                  question: f.question,
                  answer: f.answer,
                  sortOrder: f.sortOrder ?? idx + 1,
                })),
              }
            : undefined,
          branchCourses: dto.branchIds
            ? {
                create: dto.branchIds.map((bId) => ({ branchId: bId })),
              }
            : undefined,
        },
      });

      return course;
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_COURSE',
          entityType: 'Course',
          entityId: created.id,
          details: { title: created.title, slug: created.slug },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateCourseDto, userId?: string) {
    const course = await this.findOneAdmin(id);

    if (dto.slug && dto.slug !== course.slug) {
      const existing = await this.prisma.course.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu slug band.");
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // If outcomes provided, replace
      if (dto.outcomes) {
        await tx.courseOutcome.deleteMany({ where: { courseId: course.id } });
        await tx.courseOutcome.createMany({
          data: dto.outcomes.map((o, idx) => ({
            courseId: course.id,
            text: o.text,
            sortOrder: o.sortOrder ?? idx + 1,
          })),
        });
      }

      // If syllabus provided, replace
      if (dto.syllabusModules) {
        await tx.courseModule.deleteMany({ where: { courseId: course.id } });
        await tx.courseModule.createMany({
          data: dto.syllabusModules.map((m, idx) => ({
            courseId: course.id,
            title: m.title,
            topics: m.topics,
            sortOrder: m.sortOrder ?? idx + 1,
          })),
        });
      }

      // If faqs provided, replace
      if (dto.faqs) {
        await tx.courseFaq.deleteMany({ where: { courseId: course.id } });
        await tx.courseFaq.createMany({
          data: dto.faqs.map((f, idx) => ({
            courseId: course.id,
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder ?? idx + 1,
          })),
        });
      }

      // If branchIds provided, replace
      if (dto.branchIds) {
        await tx.branchCourse.deleteMany({ where: { courseId: course.id } });
        await tx.branchCourse.createMany({
          data: dto.branchIds.map((branchId) => ({
            courseId: course.id,
            branchId,
          })),
        });
      }

      return tx.course.update({
        where: { id: course.id },
        data: {
          title: dto.title?.trim(),
          slug: dto.slug?.toLowerCase().trim(),
          shortDescription: dto.shortDescription?.trim(),
          description: dto.description?.trim(),
          categoryId: dto.categoryId,
          targetAudience: dto.targetAudience?.trim(),
          level: dto.level?.trim(),
          durationMonths: dto.durationMonths,
          priceAmount: dto.priceAmount,
          currency: dto.currency,
          ageMinimum: dto.ageMinimum,
          ageMaximum: dto.ageMaximum,
          entryRequirements: dto.entryRequirements?.trim(),
          durationNote: dto.durationNote?.trim(),
          priceStatus: dto.priceStatus?.trim(),
          methodology: dto.methodology?.trim(),
          plateType: dto.plateType,
          coverImage: dto.coverImage,
          status: dto.status,
          featured: dto.featured,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
        },
      });
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_COURSE',
          entityType: 'Course',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const course = await this.findOneAdmin(id);

    // Soft delete (archive) preferred in production
    await this.prisma.course.update({
      where: { id: course.id },
      data: { status: ContentStatus.ARCHIVED },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ARCHIVE_COURSE',
          entityType: 'Course',
          entityId: course.id,
        },
      });
    }

    return { success: true, message: "Kurs arxivlandi." };
  }
}
