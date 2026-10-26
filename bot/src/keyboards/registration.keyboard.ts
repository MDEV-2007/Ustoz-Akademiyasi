import { Keyboard, InlineKeyboard } from 'grammy';
import { Course, Branch } from '../types/api.types';
import { BOT_STRINGS } from '../config/constants';

export function getRegistrationCourseKeyboard(courses: Course[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const course of courses) {
    let icon = '📖';
    if (course.slug.includes('kids')) icon = '👶';
    else if (course.slug.includes('fonetika')) icon = '🔤';
    else if (course.slug.includes('grammatika') || course.slug.includes('cefr')) icon = '📜';
    else if (course.slug.includes('kundalik') || course.slug.includes('kasbiy')) icon = '💼';

    keyboard.text(`${icon} ${course.title}`, `reg_sel_course:${course.slug}`).row();
  }
  keyboard.text(BOT_STRINGS.BTN_CANCEL, 'reg_action:cancel');
  return keyboard;
}

export function getRegistrationBranchKeyboard(branches: Branch[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const branch of branches) {
    const cleanName = branch.name.replace(/ filiali$/i, '');
    const cleanArea = (branch.district || branch.area || '')
      .split('/')[0]
      .trim()
      .replace(/ tumani$/i, '')
      .replace(/ metro yo‘nalishi$/i, '');

    const label = cleanArea ? `🏛 ${cleanName} (${cleanArea})` : `🏛 ${cleanName}`;
    keyboard.text(label, `reg_sel_branch:${branch.slug}`).row();
  }
  keyboard.text('🔙 Kursni o‘zgartirish', 'reg_action:change_course').row();
  keyboard.text(BOT_STRINGS.BTN_CANCEL, 'reg_action:cancel');
  return keyboard;
}

export function getPhoneRequestKeyboard(): Keyboard {
  return new Keyboard()
    .requestContact(BOT_STRINGS.BTN_SHARE_PHONE)
    .row()
    .text(BOT_STRINGS.BTN_CANCEL)
    .resized()
    .oneTime();
}

export function getPreferredTimeKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🌅 Ertalabki (09:00 – 12:00)', 'reg_time:Ertalabki (09:00-12:00)')
    .row()
    .text('☀️ Kunduzgi (14:00 – 17:00)', 'reg_time:Kunduzgi (14:00-17:00)')
    .row()
    .text('🌙 Kechki (18:30 – 21:00)', 'reg_time:Kechki (18:30-21:00)')
    .row()
    .text('🤝 Operator bilan kelishaman', 'reg_time:Operator bilan kelishiladi')
    .row()
    .text('🔙 Orqaga', 'reg_action:back')
    .text(BOT_STRINGS.BTN_CANCEL, 'reg_action:cancel');
}

export function getRegistrationConfirmKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('✅ Arizani yuborish', 'reg_confirm:submit')
    .row()
    .text('✏️ Ismni tahrirlash', 'reg_edit:name')
    .text('📱 Telefonni tahrirlash', 'reg_edit:phone')
    .row()
    .text('📚 Kursni almashtirish', 'reg_edit:course')
    .text('📍 Filialni almashtirish', 'reg_edit:branch')
    .row()
    .text(BOT_STRINGS.BTN_CANCEL, 'reg_action:cancel');
}

export function getCancelKeyboard(): Keyboard {
  return new Keyboard()
    .text(BOT_STRINGS.BTN_CANCEL)
    .resized();
}
