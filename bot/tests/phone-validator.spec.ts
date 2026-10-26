import { validateAndNormalizeUzbekPhone } from '../src/services/phone-validator';

describe('PhoneValidator - Uzbekistan Phone Standard', () => {
  it('should accept valid 9-digit local phone number without country code', () => {
    const res = validateAndNormalizeUzbekPhone('901234567');
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe('+998901234567');
    expect(res.formatted).toBe('+998 90 123-45-67');
    expect(res.masked).toBe('+998 90 ***-**-67');
  });

  it('should accept valid phone with +998 prefix and spaces', () => {
    const res = validateAndNormalizeUzbekPhone('+998 91 234 56 78');
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe('+998912345678');
    expect(res.formatted).toBe('+998 91 234-56-78');
  });

  it('should accept all valid Uzbekistan mobile operator prefixes', () => {
    const validPrefixes = ['90', '91', '93', '94', '95', '97', '98', '99', '33', '88', '77', '55', '71', '20', '50'];
    for (const prefix of validPrefixes) {
      const res = validateAndNormalizeUzbekPhone(`${prefix}1112233`);
      expect(res.isValid).toBe(true);
      expect(res.e164).toBe(`+998${prefix}1112233`);
    }
  });

  it('should reject invalid operator prefix', () => {
    const res = validateAndNormalizeUzbekPhone('921234567');
    expect(res.isValid).toBe(false);
    expect(res.errorMessage).toContain('O‘zbekiston operator kodi noto‘g‘ri');
  });

  it('should reject numbers with invalid length', () => {
    const shortNum = validateAndNormalizeUzbekPhone('9012345');
    expect(shortNum.isValid).toBe(false);

    const longNum = validateAndNormalizeUzbekPhone('901234567890');
    expect(longNum.isValid).toBe(false);
  });

  it('should reject non-string or empty inputs', () => {
    const res = validateAndNormalizeUzbekPhone('');
    expect(res.isValid).toBe(false);
  });
});
