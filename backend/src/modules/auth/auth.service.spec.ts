import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserRole, UserStatus } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;

  const mockUser = {
    id: 'user_123',
    fullName: 'Test Admin',
    email: 'admin@ustoz.uz',
    phone: '+998901234567',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    passwordHash: '',
  };

  beforeAll(async () => {
    mockUser.passwordHash = await argon2.hash('SecretPass123!');
  });

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    jwtService = {
      sign: jest.fn().mockImplementation((payload, options) => {
        return `token_${payload.sub}_${options?.expiresIn || 'default'}`;
      }),
      signAsync: jest.fn().mockImplementation((payload, options) => {
        return Promise.resolve(`token_${payload.sub}_${options?.expiresIn || 'default'}`);
      }),
      verifyAsync: jest.fn(),
    };

    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'jwt.accessSecret') return 'test_access_secret';
        if (key === 'jwt.refreshSecret') return 'test_refresh_secret';
        if (key === 'jwt.accessTtl') return '15m';
        if (key === 'jwt.refreshTtl') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('to‘g‘ri ma’lumotlar bilan login qilinganda access va refresh token qaytarishi kerak', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.refreshToken.create.mockResolvedValue({ id: 'tok_1' });
    prisma.user.update.mockResolvedValue(mockUser);

    const result = await authService.login(
      { email: 'admin@ustoz.uz', password: 'SecretPass123!' },
      '127.0.0.1',
      'Jest Agent',
    );

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe(mockUser.email);
    expect((result.user as any).passwordHash).toBeUndefined(); // Maxfiy ma'lumot oshkor etilmasligi shart
  });

  it('noto‘g‘ri parol kiritilganda UnauthorizedException qaytarishi kerak', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);

    await expect(
      authService.login(
        { email: 'admin@ustoz.uz', password: 'WrongPassword!' },
        '127.0.0.1',
        'Jest Agent',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('mavjud bo‘lmagan elektron pochta kiritilganda xatolik qaytarishi kerak', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login(
        { email: 'unknown@ustoz.uz', password: 'SomePassword' },
        '127.0.0.1',
        'Jest Agent',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('logout qilinganda sessiya bekor qilinishi (revoked) kerak', async () => {
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

    const res = await authService.logout('test_refresh_token');
    expect(res.message).toBeDefined();
    expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
  });
});
