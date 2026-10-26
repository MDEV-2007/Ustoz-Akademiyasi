import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { apiClient } from '../services/api-client.service';
import { BOT_CALLBACK_PREFIXES, BOT_STRINGS } from '../config/constants';
import { getTeachersListKeyboard, getTeacherDetailKeyboard } from '../keyboards/teacher.keyboard';
import { getMainMenuReplyKeyboard, getMainMenuInlineKeyboard } from '../keyboards/main-menu.keyboard';
import { Teacher } from '../types/api.types';
import { escapeHtml, safeEditOrReply } from '../utils/formatters';

export const teachersComposer = new Composer<MyContext>();

export function formatTeacherMessage(teacher: Teacher): string {
  const parts: string[] = [];

  parts.push(`👨‍🏫 <b>${escapeHtml(teacher.fullName)}</b>`);

  if (teacher.badge) {
    parts.push(`🎖 <code>${escapeHtml(teacher.badge)}</code>`);
  }

  parts.push('');

  if (teacher.focus) {
    parts.push(`🎯 <b>Ta’lim yo‘nalishi:</b>\n${escapeHtml(teacher.focus)}`);
    parts.push('');
  }

  if (teacher.qualification) {
    parts.push(`🎓 <b>Malakasi:</b> ${escapeHtml(teacher.qualification)}`);
  }

  if (teacher.department) {
    parts.push(`🏛 <b>Kafedra:</b> ${escapeHtml(teacher.department)}`);
  }

  if (teacher.yearsOfExperience) {
    parts.push(`⏱ <b>Tajriba:</b> ${teacher.yearsOfExperience}+ yil`);
  }

  if (teacher.languages && teacher.languages.length > 0) {
    parts.push(`🌐 <b>Dars tillari:</b> ${teacher.languages.map((l) => escapeHtml(l)).join(', ')}`);
  }

  return parts.join('\n');
}

async function showTeachersList(ctx: MyContext) {
  try {
    const teachers = await apiClient.getTeachers();

    if (!teachers || teachers.length === 0) {
      const msg = "ℹ️ Hozirda ustozlar ro‘yxati mavjud emas.";
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        await safeEditOrReply(ctx, msg, { reply_markup: getMainMenuInlineKeyboard(), parse_mode: 'HTML' });
      } else {
        await ctx.reply(msg, { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' });
      }
      return;
    }

    const text =
      `👨‍🏫 <b>Ustoz Akademiyasi O‘qituvchilar Jamoasi</b>\n\n` +
      `Akademiyamizda milliy va xalqaro sertifikatga ega, tajribali arab tili mutaxassislari dars berishadi.\n\n` +
      `Kafedralar va ustozlarimiz bilan tanishish uchun quyidagilardan birini tanlang:`;

    const keyboard = getTeachersListKeyboard(teachers);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await safeEditOrReply(ctx, text, { reply_markup: keyboard, parse_mode: 'HTML' });
    } else {
      await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
    }
  } catch (err: any) {
    const errorMsg = "⚠️ Ustozlar ma’lumotini yuklashda xatolik yuz berdi.";
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errorMsg, show_alert: true });
    } else {
      await ctx.reply(errorMsg, { reply_markup: getMainMenuReplyKeyboard() });
    }
  }
}

teachersComposer.hears(
  [
    BOT_STRINGS.MENU_TEACHERS,
    '👨‍🏫 Преподаватели',
    '👨‍🏫 Teachers',
    /^👨‍🏫 (Ustozlar|Преподаватели|Teachers)/i,
  ],
  (ctx) => showTeachersList(ctx)
);
teachersComposer.callbackQuery('nav:teachers', (ctx) => showTeachersList(ctx));

teachersComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.TEACHER_DETAIL}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  try {
    const teacher = await apiClient.getTeacherBySlug(slug);
    if (!teacher) {
      await ctx.answerCallbackQuery({ text: "Ustoz ma’lumoti topilmadi", show_alert: true });
      return;
    }

    await ctx.answerCallbackQuery();
    const text = formatTeacherMessage(teacher);
    await safeEditOrReply(ctx, text, {
      reply_markup: getTeacherDetailKeyboard(teacher),
      parse_mode: 'HTML',
    });
  } catch {
    await ctx.answerCallbackQuery({
      text: "Ustoz ma’lumotini yuklab bo‘lmadi.",
      show_alert: true,
    });
  }
});
