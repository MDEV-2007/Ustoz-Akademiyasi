export const VALID_UZ_PREFIXES = [
  '90', '91', '93', '94', '95', '97', '98', '99',
  '33', '88', '77', '55', '71', '20', '50'
];

export interface NormalizedPhone {
  isValid: boolean;
  e164: string;
  formatted: string;
  masked: string;
  errorMessage?: string;
}

export function validateAndNormalizeUzbekPhone(rawPhone: string): NormalizedPhone {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      e164: '',
      formatted: '',
      masked: '',
      errorMessage: 'Telefon raqami kiritilishi shart',
    };
  }

  let digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }

  if (digits.length !== 9) {
    return {
      isValid: false,
      e164: '',
      formatted: '',
      masked: '',
      errorMessage: "Telefon raqami noto‘g‘ri: +998 XX XXX-XX-XX formatida 9 ta raqam bo‘lishi kerak (masalan, 901234567)",
    };
  }

  const prefix = digits.slice(0, 2);
  if (!VALID_UZ_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      e164: '',
      formatted: '',
      masked: '',
      errorMessage: `O‘zbekiston operator kodi noto‘g‘ri (${prefix}). Amaldagi kodlar: 90, 91, 93, 94, 95, 97, 98, 99, 33, 88, 77, 55, 71, 20, 50`,
    };
  }

  const e164 = `+998${digits}`;
  const formatted = `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
  const masked = `+998 ${digits.slice(0, 2)} ***-**-${digits.slice(7, 9)}`;

  return {
    isValid: true,
    e164,
    formatted,
    masked,
  };
}
