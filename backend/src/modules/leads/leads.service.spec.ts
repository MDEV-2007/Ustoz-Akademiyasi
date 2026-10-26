import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '@/database/prisma.service';
import { TelegramService } from '@/integrations/telegram/telegram.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ContentStatus, GeneralStatus, RegistrationStatus, UserRole } from '@prisma/client';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: any;
  let telegram: any;

  const mockCourse = {
    id: 'course_1',
    title: 'Professional Fonetika',
    slug: 'professional-fonetika',
    status: ContentStatus.PUBLISHED,
  };

  const mockBranch = {
    id: 'branch_1',
    name: "Archako'cha filiali",
    slug: 'archakocha',
    status: GeneralStatus.ACTIVE,
  };

  beforeEach(async () => {
    prisma = {
      course: {
        findFirst: jest.fn(),
      },
      branch: {
        findFirst: jest.fn(),
      },
      branchCourse: {
        findUnique: jest.fn(),
      },
      trialRegistration: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      registrationStatusHistory: {
        create: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback(prisma);
      }),
    };

    telegram = {
      sendLeadNotification: jest.fn().mockResolvedValue(true),
      sendStatusChangeNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prisma },
        { provide: TelegramService, useValue: telegram },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('to‘g‘ri ma’lumotlar bilan yuborilgan ariza bazaga saqlanishi kerak', async () => {
    prisma.course.findFirst.mockResolvedValue(mockCourse);
    prisma.branch.findFirst.mockResolvedValue(mockBranch);
    prisma.branchCourse.findUnique.mockResolvedValue({ id: 'bc_1' });
    prisma.trialRegistration.findFirst.mockResolvedValue(null);

    const mockSavedLead = {
      id: 'lead_1',
      referenceId: 'UA-123456',
      fullName: 'Sardor Aliyev',
      phone: '+998901234567',
      phoneFormatted: '+998 90 123-45-67',
      courseId: mockCourse.id,
      branchId: mockBranch.id,
      status: RegistrationStatus.NEW,
      createdAt: new Date(),
    };
    prisma.trialRegistration.create.mockResolvedValue(mockSavedLead);

    const res = await service.createPublicRegistration({
      fullName: 'Sardor Aliyev',
      phone: '+998 90 123 45 67',
      courseSlug: 'professional-fonetika',
      branchSlug: 'archakocha',
      message: 'Darsga yozilmoqchiman',
    });

    expect(res.referenceId).toBeDefined();
    expect(res.fullName).toBe('Sardor Aliyev');
    expect(prisma.trialRegistration.create).toHaveBeenCalled();
  });

  it('mavjud bo‘lmagan kurs tanlanganda NotFoundException qaytarishi kerak', async () => {
    prisma.course.findFirst.mockResolvedValue(null);

    await expect(
      service.createPublicRegistration({
        fullName: 'Sardor Aliyev',
        phone: '+998 90 123 45 67',
        courseSlug: 'mavjud-bolmagan-kurs',
        branchSlug: 'archakocha',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('24 soat ichida bir xil raqam va kurs bo‘yicha takroriy ariza yuborilganda ConflictException qaytarishi kerak', async () => {
    prisma.course.findFirst.mockResolvedValue(mockCourse);
    prisma.branch.findFirst.mockResolvedValue(mockBranch);
    prisma.branchCourse.findUnique.mockResolvedValue({ id: 'bc_1' });
    prisma.trialRegistration.findFirst.mockResolvedValue({
      id: 'existing_lead',
      referenceId: 'UA-999999',
      fullName: 'Sardor Aliyev',
      createdAt: new Date(),
    });

    await expect(
      service.createPublicRegistration({
        fullName: 'Sardor Aliyev',
        phone: '+998 90 123 45 67',
        courseSlug: 'professional-fonetika',
        branchSlug: 'archakocha',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
