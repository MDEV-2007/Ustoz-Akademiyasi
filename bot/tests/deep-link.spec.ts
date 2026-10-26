import { parseDeepLink } from '../src/handlers/start.handler';

describe('Deep Link Parser', () => {
  it('should parse course deep links correctly', () => {
    const res = parseDeepLink('course_professional-fonetika');
    expect(res.type).toBe('course');
    expect(res.value).toBe('professional-fonetika');
  });

  it('should parse branch deep links correctly', () => {
    const res = parseDeepLink('branch_archakocha');
    expect(res.type).toBe('branch');
    expect(res.value).toBe('archakocha');
  });

  it('should parse campaign source attribution deep links', () => {
    const res = parseDeepLink('src_instagram_bio');
    expect(res.type).toBe('source');
    expect(res.value).toBe('instagram_bio');
  });

  it('should handle unrecognized payloads safely', () => {
    const res = parseDeepLink('unknown_payload_123');
    expect(res.type).toBe('unknown');
    expect(res.value).toBe('unknown_payload_123');
  });

  it('should trim surrounding whitespace', () => {
    const res = parseDeepLink('  course_tajvid-intensiv  ');
    expect(res.type).toBe('course');
    expect(res.value).toBe('tajvid-intensiv');
  });
});
