import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '@/database/prisma.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('liveness tekshiruvi muvaffaqiyatli ok status qaytarishi kerak', () => {
    const live = controller.checkLiveness();
    expect(live.status).toBe('ok');
    expect(typeof live.uptime).toBe('number');
    expect(live.timestamp).toBeDefined();
  });

  it('readiness tekshiruvi ma’lumotlar bazasi ulanganda ok status qaytarishi kerak', async () => {
    const ready = await controller.checkReadiness();
    expect(ready.status).toBe('ok');
    expect(ready.database).toBe('connected');
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('ma’lumotlar bazasi uzilganda ServiceUnavailableException tashlashi kerak', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('DB Connection lost'));
    await expect(controller.checkReadiness()).rejects.toThrow(ServiceUnavailableException);
  });
});
