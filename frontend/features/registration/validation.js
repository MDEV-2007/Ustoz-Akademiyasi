/**
 * Phone number formatting & validation utilities for Uzbekistan (+998).
 */

export const VALID_UZ_PREFIXES = [
  '90', '91', '93', '94', '95', '97', '98', '99',
  '33', '88', '77', '55', '71', '20', '50'
];

export function formatUzbekPhoneInput(raw) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);

  let formatted = '+998';
  if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
  if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
  if (digits.length > 5) formatted += '-' + digits.slice(5, 7);
  if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
  return formatted;
}

export function validateUzbekPhone(formatted) {
  const digits = formatted.replace(/\D/g, '');
  if (digits.length !== 12 || !digits.startsWith('998')) {
    return {
      valid: false,
      error: "Telefon raqamingizni to'liq kiriting: +998 XX XXX-XX-XX (9 ta raqam)"
    };
  }
  const prefix = digits.slice(3, 5);
  if (!VALID_UZ_PREFIXES.includes(prefix)) {
    return {
      valid: false,
      error: `Operator kodi (${prefix}) noto'g'ri. Mavjud kodlar: 90, 91, 93, 94, 95, 97, 98, 99, 33, 55, 77, 88.`
    };
  }
  return { valid: true, error: null, e164: '+' + digits };
}
