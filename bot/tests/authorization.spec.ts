import { isAuthorizedAdmin, requireAdminMiddleware } from '../src/middleware/authorization.middleware';
import { loadConfig } from '../src/config/env.config';

describe('Admin Authorization Middleware', () => {
  beforeAll(() => {
    loadConfig({
      BOT_TOKEN: '123456:TEST_TOKEN',
      ADMIN_TELEGRAM_IDS: '111222,333444,555666',
    });
  });

  it('should allow authorized admin IDs', () => {
    expect(isAuthorizedAdmin(111222)).toBe(true);
    expect(isAuthorizedAdmin(333444)).toBe(true);
    expect(isAuthorizedAdmin(555666)).toBe(true);
  });

  it('should deny unauthorized user IDs', () => {
    expect(isAuthorizedAdmin(999999)).toBe(false);
    expect(isAuthorizedAdmin(undefined)).toBe(false);
  });

  it('should block unauthorized execution in middleware', async () => {
    const nextFn = jest.fn();
    const replyFn = jest.fn();

    const mockCtx: any = {
      from: { id: 777777 },
      reply: replyFn,
    };

    await requireAdminMiddleware(mockCtx, nextFn);

    expect(nextFn).not.toHaveBeenCalled();
    expect(replyFn).toHaveBeenCalledWith(expect.stringContaining('Kirish taqiqlangan'));
  });

  it('should proceed for authorized user in middleware', async () => {
    const nextFn = jest.fn();
    const mockCtx: any = {
      from: { id: 111222 },
    };

    await requireAdminMiddleware(mockCtx, nextFn);

    expect(nextFn).toHaveBeenCalled();
  });
});
