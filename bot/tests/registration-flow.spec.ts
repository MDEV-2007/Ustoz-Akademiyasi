import { RegistrationDraft } from '../src/types/context';
import { validateAndNormalizeUzbekPhone } from '../src/services/phone-validator';
import {
  getRegistrationCourseKeyboard,
  getRegistrationBranchKeyboard,
  getRegistrationConfirmKeyboard,
} from '../src/keyboards/registration.keyboard';

describe('Registration Flow Progression & State Management', () => {
  it('should initialize a valid registration draft with idempotency key', () => {
    const userId = 12345678;
    const now = Date.now();
    const draft: RegistrationDraft = {
      attributionSource: 'TELEGRAM_BOT',
      idempotencyKey: `tg_${userId}_${now}`,
      startedAt: now,
    };

    expect(draft.attributionSource).toBe('TELEGRAM_BOT');
    expect(draft.idempotencyKey).toBe(`tg_${userId}_${now}`);
    expect(draft.startedAt).toBe(now);
  });

  it('should progress through steps and validate phone correctly', () => {
    const draft: RegistrationDraft = {
      courseSlug: 'professional-fonetika',
      courseTitle: 'Professional Fonetika',
      branchSlug: 'archakocha',
      branchName: 'Archako‘cha filiali',
      fullName: 'Abdulloh Karimov',
    };

    // User inputs phone
    const phoneInput = '+998 90 123 45 67';
    const validation = validateAndNormalizeUzbekPhone(phoneInput);

    expect(validation.isValid).toBe(true);
    draft.phone = validation.e164;
    draft.phoneFormatted = validation.formatted;

    expect(draft.phone).toBe('+998901234567');
    expect(draft.phoneFormatted).toBe('+998 90 123-45-67');
  });

  it('should reject invalid phone inputs without losing draft state', () => {
    const draft: RegistrationDraft = {
      courseSlug: 'professional-fonetika',
      fullName: 'Abdulloh Karimov',
    };

    const invalidPhone = '12345';
    const validation = validateAndNormalizeUzbekPhone(invalidPhone);

    expect(validation.isValid).toBe(false);
    // Draft preserves previous state
    expect(draft.courseSlug).toBe('professional-fonetika');
    expect(draft.fullName).toBe('Abdulloh Karimov');
    expect(draft.phone).toBeUndefined();
  });

  it('should generate confirmation keyboard with edit actions', () => {
    const keyboard = getRegistrationConfirmKeyboard();
    const buttons = keyboard.inline_keyboard.flat();

    const submitBtn = buttons.find((b: any) => 'callback_data' in b && b.callback_data === 'reg_confirm:submit');
    const editNameBtn = buttons.find((b: any) => 'callback_data' in b && b.callback_data === 'reg_edit:name');
    const editPhoneBtn = buttons.find((b: any) => 'callback_data' in b && b.callback_data === 'reg_edit:phone');
    const cancelBtn = buttons.find((b: any) => 'callback_data' in b && b.callback_data === 'reg_action:cancel');

    expect(submitBtn).toBeDefined();
    expect(editNameBtn).toBeDefined();
    expect(editPhoneBtn).toBeDefined();
    expect(cancelBtn).toBeDefined();
  });

  it('should generate course selection keyboard with cancel option', () => {
    const courses = [
      { id: '1', title: 'Fonetika', slug: 'fonetika', shortDescription: '', level: '1' },
      { id: '2', title: 'Tajvid', slug: 'tajvid', shortDescription: '', level: '2' },
    ];
    const keyboard = getRegistrationCourseKeyboard(courses);
    const buttons = keyboard.inline_keyboard.flat();

    expect(buttons.some((b: any) => 'callback_data' in b && b.callback_data === 'reg_sel_course:fonetika')).toBe(true);
    expect(buttons.some((b: any) => 'callback_data' in b && b.callback_data === 'reg_action:cancel')).toBe(true);
  });

  it('should generate branch selection keyboard with change course option', () => {
    const branches = [
      { id: '1', name: 'Archako‘cha', slug: 'archakocha', area: 'Chilonzor' },
    ];
    const keyboard = getRegistrationBranchKeyboard(branches);
    const buttons = keyboard.inline_keyboard.flat();

    expect(buttons.some((b: any) => 'callback_data' in b && b.callback_data === 'reg_action:change_course')).toBe(true);
  });
});
