import { InlineKeyboard } from 'grammy';
import { Teacher } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export function getTeachersListKeyboard(teachers: Teacher[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const teacher of teachers) {
    const cleanName = teacher.fullName.replace(/ kafedrasi$/i, '').replace(/ bo‘limi$/i, '');
    keyboard.text(`👨‍🏫 ${cleanName}`, `${BOT_CALLBACK_PREFIXES.TEACHER_DETAIL}${teacher.slug}`).row();
  }

  keyboard.text('📝 Sinov darsiga yozilish', 'nav:register').row();
  keyboard.text('🏠 Bosh menyu', 'nav:main');

  return keyboard;
}

export function getTeacherDetailKeyboard(teacher: Teacher): InlineKeyboard {
  return new InlineKeyboard()
    .text('📝 Sinov darsiga yozilish', 'nav:register')
    .row()
    .text('📚 Kurslarni ko‘rish', 'nav:courses')
    .row()
    .text('🔙 Ustozlar ro‘yxati', 'nav:teachers')
    .text('🏠 Bosh menyu', 'nav:main');
}
