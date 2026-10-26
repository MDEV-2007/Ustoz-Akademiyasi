import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';

export const VALID_UZ_PREFIXES = ['90', '91', '93', '94', '95', '97', '98', '99', '33', '88', '77', '55', '71', '20', '50'];

export function normalizeUzbekPhone(rawPhone: string): { e164: string; formatted: string } {
  if (!rawPhone || typeof rawPhone !== 'string') {
    throw new BadRequestException("Telefon raqami kiritilishi shart");
  }

  let digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  if (digits.length !== 9) {
    throw new BadRequestException("Telefon raqami noto'g'ri: +998 XX XXX-XX-XX formatida 9 ta raqam bo'lishi kerak");
  }

  const prefix = digits.slice(0, 2);
  if (!VALID_UZ_PREFIXES.includes(prefix)) {
    throw new BadRequestException(`Noto'g'ri operator kodi (${prefix}). Mavjud kodlar: ${VALID_UZ_PREFIXES.join(', ')}`);
  }

  const e164 = `+998${digits}`;
  const formatted = `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;

  return { e164, formatted };
}

@Injectable()
export class UzbekPhonePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return normalizeUzbekPhone(value).e164;
  }
}
