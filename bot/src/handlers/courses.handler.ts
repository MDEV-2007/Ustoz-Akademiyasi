import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { apiClient } from '../services/api-client.service';
import { BOT_CALLBACK_PREFIXES, BOT_STRINGS } from '../config/constants';
import { getCoursesListKeyboard, getCourseDetailKeyboard } from '../keyboards/course.keyboard';
import { getMainMenuReplyKeyboard, getMainMenuInlineKeyboard } from '../keyboards/main-menu.keyboard';
import { Course } from '../types/api.types';
import { escapeHtml, safeEditOrReply } from '../utils/formatters';

export const coursesComposer = new Composer<MyContext>();

// Helper to format course details
export function formatCourseMessage(course: Course): string {
  const parts: string[] = [];

  parts.push(`📚 <b>${escapeHtml(course.title)}</b>\n`);
  parts.push(`📊 <b>Daraja:</b> ${escapeHtml(course.level || 'Barcha darajalar')}`);

  if (course.targetAudience) {
    parts.push(`👥 <b>Kimlar uchun:</b> ${escapeHtml(course.targetAudience)}`);
  }

  if (course.durationMonths) {
    parts.push(`⏱ <b>Davomiyligi:</b> ${course.durationMonths} oy`);
  }

  if (course.priceAmount) {
    const formattedPrice = Number(course.priceAmount).toLocaleString('uz-UZ');
    parts.push(`💳 <b>Narxi:</b> ${formattedPrice} ${course.currency || 'so‘m'} / oy`);
  } else if (course.priceStatus) {
    parts.push(`💳 <b>To‘lov:</b> <i>${escapeHtml(course.priceStatus)}</i>`);
  }

  const desc = course.shortDescription || course.description;
  if (desc) {
    parts.push(`\n📝 <b>Tavsif:</b>\n${escapeHtml(desc)}`);
  }

  if (course.outcomes && course.outcomes.length > 0) {
    parts.push(`\n🎯 <b>Natija:</b>`);
    course.outcomes.slice(0, 3).forEach((o) => {
      parts.push(`• ${escapeHtml(o.text)}`);
    });
  }

  if (course.branchCourses && course.branchCourses.length > 0) {
    const branchNames = course.branchCourses.map((bc) => escapeHtml(bc.branch.name)).join(', ');
    parts.push(`\n📍 <b>Filiallar:</b> ${branchNames}`);
  }

  return parts.join('\n');
}

// Handler for Courses Menu Button & Callback
async function showCoursesList(ctx: MyContext, page: number = 1) {
  try {
    const courses = await apiClient.getCourses({ limit: 50 });

    if (!courses || courses.length === 0) {
      const msg = "ℹ️ Hozirda faol kurslar ro‘yxati mavjud emas.";
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        await safeEditOrReply(ctx, msg, { reply_markup: getMainMenuInlineKeyboard(), parse_mode: 'HTML' });
      } else {
        await ctx.reply(msg, { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' });
      }
      return;
    }

    const text =
      `📚 <b>Arab Tili Kurslari</b>\n\n` +
      `Quyidagi ro‘yxatdan o‘zingizga mos kursni tanlang:`;

    const keyboard = getCoursesListKeyboard(courses, page);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await safeEditOrReply(ctx, text, { reply_markup: keyboard, parse_mode: 'HTML' });
    } else {
      await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
    }
  } catch (err: any) {
    const errorMsg = "⚠️ Kurslar ro‘yxatini yuklashda xatolik yuz berdi.";
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errorMsg, show_alert: true });
    } else {
      await ctx.reply(errorMsg, { reply_markup: getMainMenuReplyKeyboard() });
    }
  }
}

coursesComposer.hears(
  [
    BOT_STRINGS.MENU_COURSES,
    '📚 Курсы',
    '📚 Courses',
    /^📚 (Kurslar|Курсы|Courses)/i,
  ],
  (ctx) => showCoursesList(ctx, 1)
);
coursesComposer.callbackQuery('nav:courses', (ctx) => showCoursesList(ctx, 1));

// Pagination
coursesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.COURSE_PAGE}(\\d+)$`), async (ctx) => {
  const page = parseInt(ctx.match[1], 10) || 1;
  await showCoursesList(ctx, page);
});

// Course Detail
coursesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.COURSE_DETAIL}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  try {
    const course = await apiClient.getCourseBySlug(slug);
    if (!course) {
      await ctx.answerCallbackQuery({ text: "Kurs topilmadi", show_alert: true });
      return;
    }

    await ctx.answerCallbackQuery();
    const text = formatCourseMessage(course);
    await safeEditOrReply(ctx, text, {
      reply_markup: getCourseDetailKeyboard(course),
      parse_mode: 'HTML',
    });
  } catch (err: any) {
    await ctx.answerCallbackQuery({
      text: "Kurs tafsilotini yuklab bo‘lmadi.",
      show_alert: true,
    });
  }
});

// Direct Course Registration
coursesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.COURSE_REGISTER}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const course = await apiClient.getCourseBySlug(slug);
    ctx.session.registrationDraft = {
      courseSlug: course.slug,
      courseTitle: course.title,
      attributionSource: `COURSE_VIEW_${course.slug}`,
    };
  } catch {
    ctx.session.registrationDraft = {
      courseSlug: slug,
      attributionSource: `COURSE_VIEW_${slug}`,
    };
  }

  await ctx.conversation.enter('registrationConversation');
});
