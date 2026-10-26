import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { TelegramService } from '@/integrations/telegram/telegram.service';
import { normalizeUzbekPhone } from '@/common/pipes/uzbek-phone.pipe';
import { CreateTrialRegistrationDto } from './dto/create-trial-registration.dto';
import {
  QueryLeadsDto,
  UpdateLeadStatusDto,
  AssignManagerDto,
  UpdateInternalNotesDto,
} from './dto/lead-admin.dto';
import { buildPaginationMeta } from '@/common/dto/pagination.dto';
import { Prisma, RegistrationStatus } from '@prisma/client';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async createPublicRegistration(dto: CreateTrialRegistrationDto, ipAddress?: string, userAgent?: string) {
    // 1. Normalize phone to E.164
    const { e164, formatted } = normalizeUzbekPhone(dto.phone);

    // 2. Resolve course (or fallback to default)
    let course = dto.courseSlug
      ? await this.prisma.course.findFirst({
          where: {
            OR: [{ id: dto.courseSlug }, { slug: dto.courseSlug }],
            status: 'PUBLISHED',
          },
        })
      : await this.prisma.course.findFirst({
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'asc' },
        });

    if (!course) {
      throw new NotFoundException("Tanlangan kurs topilmadi yoki ayni paytda qabul to‘xtatilgan.");
    }

    // 3. Resolve branch (or fallback to default)
    let branch = dto.branchSlug
      ? await this.prisma.branch.findFirst({
          where: {
            OR: [{ id: dto.branchSlug }, { slug: dto.branchSlug }],
            status: 'ACTIVE',
          },
        })
      : await this.prisma.branch.findFirst({
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'asc' },
        });

    if (!branch) {
      throw new NotFoundException("Tanlangan filial topilmadi yoki ayni paytda faol emas.");
    }

    // 4. Verify course is available at the selected branch
    const branchCourse = await this.prisma.branchCourse.findUnique({
      where: {
        branchId_courseId: {
          branchId: branch.id,
          courseId: course.id,
        },
      },
    });
    if (!branchCourse) {
      // If branch has any courses configured, check availability
      const totalBranchCourses = await this.prisma.branchCourse.count({ where: { branchId: branch.id } });
      if (totalBranchCourses > 0) {
        throw new BadRequestException(`Ushbu «${course.title}» kursi tanlangan «${branch.name}» filialida mavjud emas.`);
      }
    }

    // 5. Anti-spam / Duplicate submission protection
    // Check if same phone registered for same course in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingRecentLead = await this.prisma.trialRegistration.findFirst({
      where: {
        phone: e164,
        courseId: course.id,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (existingRecentLead) {
      throw new ConflictException(
        `Ushbu telefon raqami orqali «${course.title}» kursi uchun yaqinda ariza yuborilgan (Ariza raqami: ${existingRecentLead.referenceId}). Operatorlarimiz tez orada siz bilan bog'lanishadi.`
      );
    }

    // Handle explicit idempotencyKey if provided
    if (dto.idempotencyKey) {
      const existingKey = await this.prisma.trialRegistration.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });
      if (existingKey) {
        return {
          referenceId: existingKey.referenceId,
          message: "Arizangiz avval qabul qilingan.",
          courseTitle: course.title,
          branchName: branch.name,
          status: existingKey.status,
        };
      }
    }

    // 6. Generate unique referenceId (UA-XXXXXX)
    const referenceId = 'UA-' + Math.floor(100000 + Math.random() * 900000);

    // 7. Atomic transaction for registration and initial status history
    const result = await this.prisma.$transaction(async (tx) => {
      const lead = await tx.trialRegistration.create({
        data: {
          referenceId,
          fullName: dto.fullName.trim(),
          phone: e164,
          phoneFormatted: formatted,
          courseId: course.id,
          branchId: branch.id,
          notes:
            [dto.notes, dto.message, dto.comment, dto.preferredTime ? `Qulay vaqt: ${dto.preferredTime}` : null]
              .filter(Boolean)
              .join(' | ') || null,
          preferredTime: dto.preferredTime || null,
          inquiryType: dto.inquiryType || 'TRIAL_LESSON',
          telegramUserId: dto.telegramUserId || null,
          telegramUsername: dto.telegramUsername || null,
          callbackTime: dto.callbackTime ? new Date(dto.callbackTime) : null,
          idempotencyKey: dto.idempotencyKey || null,
          status: RegistrationStatus.NEW,
          source: dto.source || 'WEBSITE',
        },
      });

      const initialComment =
        dto.source === 'TELEGRAM_BOT'
          ? 'Telegram bot orqali yangi ariza qoldirildi'
          : 'Veb-sayt orqali yangi ariza qoldirildi';

      await tx.registrationStatusHistory.create({
        data: {
          registrationId: lead.id,
          fromStatus: RegistrationStatus.NEW,
          toStatus: RegistrationStatus.NEW,
          comment: initialComment,
        },
      });

      return lead;
    });

    // 8. Reliable Telegram notification delivery with inline buttons
    this.telegramService
      .sendLeadNotificationWithButtons({
        id: result.id,
        referenceId: result.referenceId,
        fullName: result.fullName,
        phone: result.phone,
        phoneFormatted: result.phoneFormatted,
        courseTitle: course.title,
        branchName: branch.name,
        source: result.source,
        inquiryType: result.inquiryType,
        preferredTime: result.preferredTime,
        notes: result.notes,
        status: result.status,
        telegramUsername: result.telegramUsername,
        createdAt: result.createdAt,
      })
      .then(async (notif) => {
        if (notif?.success) {
          await this.prisma.trialRegistration.update({
            where: { id: result.id },
            data: {
              telegramMessageId: notif.messageId || null,
              telegramChatId: notif.chatId || null,
              notificationStatus: 'SENT',
              lastNotificationAt: new Date(),
              notificationError: null,
            },
          });
        } else {
          await this.prisma.trialRegistration.update({
            where: { id: result.id },
            data: {
              notificationStatus: 'FAILED',
              notificationError: notif?.error || 'Yetkazib bo‘lmadi',
            },
          });
        }
      })
      .catch((err) => {
        this.logger.error(`Telegram notification error for ${result.referenceId}: ${err.message}`);
      });

    return {
      id: result.id,
      referenceId: result.referenceId,
      fullName: result.fullName,
      phoneFormatted: result.phoneFormatted,
      courseTitle: course.title,
      branchName: branch.name,
      status: result.status,
      notificationStatus: 'PENDING',
      submittedAt: result.createdAt,
      message: "Arizangiz muvaffaqiyatli qabul qilindi. Tez orada ma'muriyatimiz siz bilan bog'lanadi.",
    };
  }

  async findAll(query: QueryLeadsDto) {
    const where: Prisma.TrialRegistrationWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.source) {
      where.source = query.source;
    }

    if (query.courseId) {
      where.OR = [{ courseId: query.courseId }, { course: { slug: query.courseId } }];
    }

    if (query.branchId) {
      where.OR = [{ branchId: query.branchId }, { branch: { slug: query.branchId } }];
    }

    if (query.managerId) {
      where.assignedManagerId = query.managerId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { fullName: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s } },
        { phoneFormatted: { contains: s } },
        { referenceId: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.trialRegistration.count({ where }),
      this.prisma.trialRegistration.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          branch: { select: { id: true, name: true, slug: true, area: true } },
          assignedManager: { select: { id: true, fullName: true, email: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findOne(id: string) {
    const lead = await this.prisma.trialRegistration.findFirst({
      where: { OR: [{ id }, { referenceId: id }] },
      include: {
        course: true,
        branch: true,
        assignedManager: { select: { id: true, fullName: true, email: true, phone: true } },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedBy: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException("Bunday ariza topilmadi.");
    }

    return lead;
  }

  async updateStatus(id: string, dto: UpdateLeadStatusDto, currentUserId: string) {
    const lead = await this.findOne(id);

    if (lead.status === dto.status) {
      return lead;
    }

    const oldStatus = lead.status;

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.trialRegistration.update({
        where: { id: lead.id },
        data: {
          status: dto.status,
          contactedAt: dto.status !== RegistrationStatus.NEW && !lead.contactedAt ? new Date() : undefined,
          callbackTime: dto.callbackTime ? new Date(dto.callbackTime) : undefined,
        },
      });

      const validUserId = currentUserId && !currentUserId.startsWith('bot-') ? currentUserId : null;
      const commentText = dto.comment || dto.notes || (dto.operatorName ? `Operator: ${dto.operatorName}` : null);

      await tx.registrationStatusHistory.create({
        data: {
          registrationId: lead.id,
          fromStatus: oldStatus,
          toStatus: dto.status,
          changedById: validUserId,
          comment: commentText,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: validUserId,
          action: 'UPDATE_LEAD_STATUS',
          entityType: 'TrialRegistration',
          entityId: lead.id,
          details: { fromStatus: oldStatus, toStatus: dto.status, comment: commentText, operator: dto.operatorName || currentUserId },
        },
      });

      return res;
    });

    // Optional Telegram status notification
    const currentUser = currentUserId && !currentUserId.startsWith('bot-')
      ? await this.prisma.user.findUnique({ where: { id: currentUserId } })
      : null;

    this.telegramService
      .sendStatusChangeNotification({
        referenceId: lead.referenceId,
        fullName: lead.fullName,
        fromStatus: oldStatus,
        toStatus: dto.status,
        changedByName: dto.operatorName || currentUser?.fullName || 'Operator',
      })
      .catch((err) => {
        this.logger.error(`Status change notification failed: ${err.message}`);
      });

    // Sync to Telegram channel message if previously delivered
    if (lead.telegramChatId && lead.telegramMessageId) {
      this.telegramService
        .updateLeadNotificationMessage(lead.telegramChatId, lead.telegramMessageId, {
          id: lead.id,
          referenceId: lead.referenceId,
          fullName: lead.fullName,
          phone: lead.phone,
          phoneFormatted: lead.phoneFormatted,
          courseTitle: lead.course?.title || '',
          branchName: lead.branch?.name || '',
          source: lead.source,
          inquiryType: lead.inquiryType,
          preferredTime: lead.preferredTime,
          notes: lead.notes,
          status: dto.status,
          assignedManagerName: lead.assignedManager?.fullName,
          telegramUsername: lead.telegramUsername,
          createdAt: lead.createdAt,
        })
        .catch((err) => {
          this.logger.warn(`Telegram message sync failed for #${lead.referenceId}: ${err.message}`);
        });
    }

    return updated;
  }

  async retryNotification(id: string) {
    const lead = await this.findOne(id);

    const notif = await this.telegramService.sendLeadNotificationWithButtons({
      id: lead.id,
      referenceId: lead.referenceId,
      fullName: lead.fullName,
      phone: lead.phone,
      phoneFormatted: lead.phoneFormatted,
      courseTitle: lead.course?.title || '',
      branchName: lead.branch?.name || '',
      source: lead.source,
      inquiryType: lead.inquiryType,
      preferredTime: lead.preferredTime,
      notes: lead.notes,
      status: lead.status,
      assignedManagerName: lead.assignedManager?.fullName,
      telegramUsername: lead.telegramUsername,
      createdAt: lead.createdAt,
    });

    if (notif.success) {
      return this.prisma.trialRegistration.update({
        where: { id: lead.id },
        data: {
          telegramMessageId: notif.messageId || null,
          telegramChatId: notif.chatId || null,
          notificationStatus: 'SENT',
          lastNotificationAt: new Date(),
          notificationError: null,
        },
      });
    } else {
      return this.prisma.trialRegistration.update({
        where: { id: lead.id },
        data: {
          notificationStatus: 'FAILED',
          notificationError: notif.error || 'Qayta yuborishda xatolik',
        },
      });
    }
  }

  async assignManager(id: string, dto: AssignManagerDto, currentUserId: string) {
    const lead = await this.findOne(id);
    const manager = await this.prisma.user.findUnique({ where: { id: dto.managerId } });

    if (!manager) {
      throw new NotFoundException("Biriktirilayotgan xodim topilmadi.");
    }

    const updated = await this.prisma.trialRegistration.update({
      where: { id: lead.id },
      data: { assignedManagerId: manager.id },
      include: {
        assignedManager: { select: { id: true, fullName: true, email: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: 'ASSIGN_LEAD_MANAGER',
        entityType: 'TrialRegistration',
        entityId: lead.id,
        details: { managerId: manager.id, managerName: manager.fullName },
      },
    });

    // Sync to Telegram channel message
    if (lead.telegramChatId && lead.telegramMessageId) {
      this.telegramService
        .updateLeadNotificationMessage(lead.telegramChatId, lead.telegramMessageId, {
          id: lead.id,
          referenceId: lead.referenceId,
          fullName: lead.fullName,
          phone: lead.phone,
          phoneFormatted: lead.phoneFormatted,
          courseTitle: lead.course?.title || '',
          branchName: lead.branch?.name || '',
          source: lead.source,
          inquiryType: lead.inquiryType,
          preferredTime: lead.preferredTime,
          notes: lead.notes,
          status: lead.status,
          assignedManagerName: manager.fullName,
          telegramUsername: lead.telegramUsername,
          createdAt: lead.createdAt,
        })
        .catch((err) => {
          this.logger.warn(`Telegram message sync failed for #${lead.referenceId}: ${err.message}`);
        });
    }

    return updated;
  }

  async updateInternalNotes(id: string, dto: UpdateInternalNotesDto, currentUserId: string) {
    const lead = await this.findOne(id);

    const updated = await this.prisma.trialRegistration.update({
      where: { id: lead.id },
      data: { internalNotes: dto.internalNotes.trim() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: 'UPDATE_LEAD_NOTES',
        entityType: 'TrialRegistration',
        entityId: lead.id,
      },
    });

    return updated;
  }

  async exportToCsv(query: QueryLeadsDto): Promise<string> {
    const where: Prisma.TrialRegistrationWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.courseId) where.courseId = query.courseId;
    if (query.branchId) where.branchId = query.branchId;

    const leads = await this.prisma.trialRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { title: true } },
        branch: { select: { name: true } },
        assignedManager: { select: { fullName: true } },
      },
    });

    const rows = leads.map((l) => ({
      ID: l.referenceId,
      FIO: l.fullName,
      Telefon: l.phoneFormatted,
      Kurs: l.course?.title || '',
      Filial: l.branch?.name || '',
      Status: l.status,
      Menejer: l.assignedManager?.fullName || 'Biriktirilmagan',
      Sana: l.createdAt.toISOString(),
      Izoh: l.notes || '',
      Ichki_Qaydlar: l.internalNotes || '',
    }));

    return stringify(rows, { header: true });
  }
}
