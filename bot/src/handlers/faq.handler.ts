import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { apiClient } from '../services/api-client.service';
import { BOT_CALLBACK_PREFIXES, BOT_STRINGS } from '../config/constants';
import {
  getFaqCategoriesKeyboard,
  getFaqQuestionsKeyboard,
  getFaqAnswerKeyboard,
} from '../keyboards/faq.keyboard';
import { getMainMenuReplyKeyboard, getMainMenuInlineKeyboard } from '../keyboards/main-menu.keyboard';
import { FAQ } from '../types/api.types';
import { safeEditOrReply } from '../utils/formatters';

export const faqComposer = new Composer<MyContext>();

async function showFaqCategories(ctx: MyContext) {
  try {
    const faqs = await apiClient.getFaqs();

    if (!faqs || faqs.length === 0) {
      const msg = "ℹ️ Hozirda savol-javoblar mavjud emas.";
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        await safeEditOrReply(ctx, msg, { reply_markup: getMainMenuInlineKeyboard(), parse_mode: 'HTML' });
      } else {
        await ctx.reply(msg, { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' });
      }
      return;
    }

    const categories = Array.from(new Set(faqs.map((f) => f.category))).filter(Boolean);

    const text =
      `❓ <b>Ko‘p beriladigan savollar (FAQ)</b>\n\n` +
      `Quyidagi kategoriyalardan birini tanlang yoki barcha savollarni ko‘ring:`;

    const keyboard = getFaqCategoriesKeyboard(categories);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await safeEditOrReply(ctx, text, { reply_markup: keyboard, parse_mode: 'HTML' });
    } else {
      await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
    }
  } catch (err) {
    console.error('FAQ HANDLER ERROR:', err);
    const errorMsg = "Savol-javoblarni yuklashda xatolik yuz berdi.";
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errorMsg, show_alert: true });
    } else {
      await ctx.reply(errorMsg, { reply_markup: getMainMenuReplyKeyboard() });
    }
  }
}

faqComposer.hears(
  [
    BOT_STRINGS.MENU_FAQ,
    '❓ Вопросы и ответы',
    '❓ FAQ',
    /^❓ (Savol-javob|Вопросы и ответы|FAQ)/i,
  ],
  (ctx) => showFaqCategories(ctx)
);
faqComposer.callbackQuery('nav:faq', (ctx) => showFaqCategories(ctx));

// Category selected -> show questions
faqComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.FAQ_CATEGORY}(.+)$`), async (ctx) => {
  const category = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const faqs = await apiClient.getFaqs(category === 'all' ? undefined : category);

    if (!faqs || faqs.length === 0) {
      await safeEditOrReply(ctx, "Ushbu kategoriyada savollar topilmadi.", {
        reply_markup: getFaqCategoriesKeyboard([]),
      });
      return;
    }

    const catTitle = category === 'all' ? 'Barcha savollar' : category;
    const text = `📁 <b>Kategoriya:</b> ${catTitle}\n\nQuyidagi savollardan birini tanlang:`;
    await safeEditOrReply(ctx, text, {
      reply_markup: getFaqQuestionsKeyboard(faqs),
      parse_mode: 'HTML',
    });
  } catch {
    await ctx.reply("Savollarni yuklab bo‘lmadi.");
  }
});

// Question selected -> show answer
faqComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.FAQ_ITEM}(.+)$`), async (ctx) => {
  const id = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const faqs = await apiClient.getFaqs();
    const faq = faqs.find((f) => f.id === id);

    if (!faq) {
      await ctx.reply("Savol topilmadi.");
      return;
    }

    const text = `❓ <b>${faq.question}</b>\n\n💬 <b>Javob:</b>\n${faq.answer}`;
    await safeEditOrReply(ctx, text, {
      reply_markup: getFaqAnswerKeyboard(),
      parse_mode: 'HTML',
    });
  } catch {
    await ctx.reply("Javobni yuklab bo‘lmadi.");
  }
});
