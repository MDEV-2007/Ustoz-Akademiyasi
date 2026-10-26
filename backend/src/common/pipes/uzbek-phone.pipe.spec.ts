import { UzbekPhonePipe, normalizeUzbekPhone } from './uzbek-phone.pipe';
import { BadRequestException } from '@nestjs/common';

describe('UzbekPhonePipe & normalizeUzbekPhone', () => {
  const pipe = new UzbekPhonePipe();

  it('to‘g‘ri telefon raqamlarini E.164 va milliy formatga normallashtirishi kerak', () => {
    const raw = '+998 (90) 123-45-67';
    const result = normalizeUzbekPhone(raw);
    expect(result.e164).toBe('+998901234567');
    expect(result.formatted).toBe('+998 90 123-45-67');
  });

  it('9 ta raqamdan iborat mahalliy kiritishni to‘g‘ri qabul qilishi kerak', () => {
    const result = normalizeUzbekPhone('94 999 88 77');
    expect(result.e164).toBe('+998949998877');
    expect(result.formatted).toBe('+998 94 999-88-77');
  });

  it('Uztelecom, Beeline, Ucell, Mobiuz, Humans kodlarini qo‘llab-quvvatlashi kerak', () => {
    expect(() => normalizeUzbekPhone('901112233')).not.toThrow(); // Beeline
    expect(() => normalizeUzbekPhone('931112233')).not.toThrow(); // Ucell
    expect(() => normalizeUzbekPhone('971112233')).not.toThrow(); // Mobiuz
    expect(() => normalizeUzbekPhone('991112233')).not.toThrow(); // UzMobile
    expect(() => normalizeUzbekPhone('331112233')).not.toThrow(); // Humans
    expect(() => normalizeUzbekPhone('711112233')).not.toThrow(); // Toshkent shahar statsionar
  });

  it('noto‘g‘ri operator kodi yoki yetarli bo‘lmagan raqamlarda xatolik qaytarishi kerak', () => {
    expect(() => normalizeUzbekPhone('12345')).toThrow(BadRequestException);
    expect(() => normalizeUzbekPhone('123456789012345')).toThrow(BadRequestException);
    expect(() => normalizeUzbekPhone('+998121234567')).toThrow(BadRequestException); // 12 mavjud emas
  });

  it('UzbekPhonePipe transform metodi normallashgan E.164 raqamini qaytarishi kerak', () => {
    const transformed = pipe.transform('90 123 45 67');
    expect(transformed).toBe('+998901234567');
  });
});
