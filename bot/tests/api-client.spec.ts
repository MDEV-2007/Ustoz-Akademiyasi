import { ApiClientService, ApiError } from '../src/services/api-client.service';
import { loadConfig } from '../src/config/env.config';

describe('ApiClientService', () => {
  let client: ApiClientService;
  const originalFetch = global.fetch;

  beforeAll(() => {
    loadConfig({
      BOT_TOKEN: '123456:TEST_TOKEN',
      BACKEND_API_URL: 'http://mock-backend:4000/api/v1',
      BOT_API_TOKEN: 'test-bot-secret-token',
    });
    client = new ApiClientService('http://mock-backend:4000/api/v1', 'test-bot-secret-token');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch published courses and unpack wrapped response', async () => {
    const mockCourses = [
      { id: 'c1', title: 'Professional Fonetika', slug: 'professional-fonetika', level: 'Boshlang‘ich' },
      { id: 'c2', title: 'Tajvid Intensiv', slug: 'tajvid-intensiv', level: 'O‘rta' },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: mockCourses }),
    } as any);

    const result = await client.getCourses();
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Professional Fonetika');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-backend:4000/api/v1/public/courses',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-source': 'telegram-bot',
          'x-bot-api-token': 'test-bot-secret-token',
        }),
      }),
    );
  });

  it('should fetch branch by slug', async () => {
    const mockBranch = {
      id: 'b1',
      name: 'Archako‘cha filiali',
      slug: 'archakocha',
      area: 'Chilonzor',
      latitude: 41.2856,
      longitude: 69.2034,
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: mockBranch }),
    } as any);

    const result = await client.getBranchBySlug('archakocha');
    expect(result.name).toBe('Archako‘cha filiali');
    expect(result.latitude).toBe(41.2856);
  });

  it('should create trial registration successfully and return referenceId', async () => {
    const mockResponse = {
      referenceId: 'UA-123456',
      fullName: 'Abdulloh Karimov',
      phoneFormatted: '+998 90 123-45-67',
      courseTitle: 'Professional Fonetika',
      branchName: 'Archako‘cha filiali',
      status: 'NEW',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: mockResponse }),
    } as any);

    const payload = {
      fullName: 'Abdulloh Karimov',
      phone: '+998901234567',
      courseSlug: 'professional-fonetika',
      branchSlug: 'archakocha',
      source: 'TELEGRAM_BOT',
    };

    const res = await client.createTrialRegistration(payload);
    expect(res.referenceId).toBe('UA-123456');
    expect(res.status).toBe('NEW');
  });

  it('should throw ApiError with 409 status on duplicate registration', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      text: async () =>
        JSON.stringify({
          statusCode: 409,
          message: 'Ushbu telefon raqami orqali «Professional Fonetika» kursi uchun yaqinda ariza yuborilgan.',
        }),
    } as any);

    await expect(
      client.createTrialRegistration({
        fullName: 'Abdulloh Karimov',
        phone: '+998901234567',
        courseSlug: 'professional-fonetika',
        branchSlug: 'archakocha',
      }),
    ).rejects.toThrow(ApiError);
  });

  it('should handle network abort / timeout gracefully', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    global.fetch = jest.fn().mockRejectedValue(abortError);

    await expect(client.getCourses()).rejects.toThrow(
      'Server bilan aloqa vaqti tugadi (Timeout)',
    );
  });
});
