import { InlineKeyboard } from 'grammy';
import { Course } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export function getCoursesListKeyboard(courses: Course[], page: number = 1, pageSize: number = 6): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  const totalPages = Math.ceil(courses.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const pageCourses = courses.slice(startIndex, startIndex + pageSize);

  for (const course of pageCourses) {
    let icon = '📖';
    if (course.slug.includes('kids')) icon = '👶';
    else if (course.slug.includes('fonetika')) icon = '🔤';
    else if (course.slug.includes('grammatika') || course.slug.includes('cefr')) icon = '📜';
    else if (course.slug.includes('kundalik') || course.slug.includes('kasbiy')) icon = '💼';

    keyboard.text(`${icon} ${course.title}`, `${BOT_CALLBACK_PREFIXES.COURSE_DETAIL}${course.slug}`).row();
  }

  // Pagination row
  if (totalPages > 1) {
    if (page > 1) {
      keyboard.text('🔙 Oldingi', `${BOT_CALLBACK_PREFIXES.COURSE_PAGE}${page - 1}`);
    }
    keyboard.text(`${page} / ${totalPages}`, 'noop');
    if (page < totalPages) {
      keyboard.text('Keyingi ➡️', `${BOT_CALLBACK_PREFIXES.COURSE_PAGE}${page + 1}`);
    }
    keyboard.row();
  }

  keyboard.text('📝 Sinov darsiga yozilish', 'nav:register').row();
  keyboard.text('🏠 Bosh menyu', 'nav:main');

  return keyboard;
}

export function getCourseDetailKeyboard(course: Course): InlineKeyboard {
  return new InlineKeyboard()
    .text('📝 Sinov darsiga yozilish', `${BOT_CALLBACK_PREFIXES.COURSE_REGISTER}${course.slug}`)
    .row()
    .text('📍 Filiallarimiz', 'nav:branches')
    .row()
    .text('🔙 Kurslar ro‘yxati', 'nav:courses')
    .text('🏠 Bosh menyu', 'nav:main');
}
