import { Composer, InputFile } from 'grammy';
import * as path from 'path';
import * as fs from 'fs';
import { MyContext } from '../types/context';
import { BOT_LOCALIZED_STRINGS, BotLanguage } from '../config/constants';
import {
  getMainMenuReplyKeyboard,
  getMainMenuInlineKeyboard,
  getWelcomeQuickInlineKeyboard,
  getLanguageInlineKeyboard,
} from '../keyboards/main-menu.keyboard';
import { apiClient } from '../services/api-client.service';
import { escapeHtml } from '../utils/formatters';

export const startComposer = new Composer<MyContext>();

// Helper to parse deep links
export function parseDeepLink(payload: string): {
  type: 'course' | 'branch' | 'source' | 'unknown';
  value: string;
} {
  const clean = payload.trim();
  if (clean.startsWith('course_')) {
    return { type: 'course', value: clean.replace('course_', '') };
  }
  if (clean.startsWith('branch_')) {
    return { type: 'branch', value: clean.replace('branch_', '') };
  }
  if (clean.startsWith('src_')) {
    return { type: 'source', value: clean.replace('src_', '') };
  }
  return { type: 'unknown', value: clean };
}

export function getWelcomeMessage(lang: BotLanguage, firstName?: string): string {
  const s = BOT_LOCALIZED_STRINGS[lang] || BOT_LOCALIZED_STRINGS.uz;
  const nameStr = firstName ? escapeHtml(firstName) : '';

  let greeting = '';
  if (lang === 'ru') {
    greeting = nameStr ? `Здравствуйте, ${nameStr}! 👋` : 'Здравствуйте! 👋';
  } else if (lang === 'en') {
    greeting = nameStr ? `Hello, ${nameStr}! 👋` : 'Hello! 👋';
  } else {
    greeting = nameStr ? `Assalomu alaykum, ${nameStr}! 👋` : 'Assalomu alaykum! 👋';
  }

  return (
    `${greeting}\n\n` +
    `<b>${s.WELCOME_HEADING}</b>\n\n` +
    `${s.WELCOME_BODY}`
  );
}

export async function sendWelcomeExperience(ctx: MyContext, lang: BotLanguage) {
  const s = BOT_LOCALIZED_STRINGS[lang] || BOT_LOCALIZED_STRINGS.uz;
  const welcomeText = getWelcomeMessage(lang, ctx.from?.first_name);
  const bannerPath = path.join(process.cwd(), 'assets', 'welcome_banner.jpg');

  // Check if there is a pending deep link to execute
  const draft = ctx.session.registrationDraft;
  if (draft?.courseSlug || draft?.branchSlug) {
    const courseSlug = draft.courseSlug;
    const branchSlug = draft.branchSlug;

    if (courseSlug) {
      try {
        const course = await apiClient.getCourseBySlug(courseSlug);
        if (course) {
          ctx.session.registrationDraft = {
            ...draft,
            courseTitle: course.title,
          };
          const prompt =
            lang === 'ru'
              ? `Вы перешли по ссылке на курс <b>«${escapeHtml(course.title)}»</b>.\n\nХотите записаться на пробный урок?`
              : lang === 'en'
              ? `You followed a link to the <b>«${escapeHtml(course.title)}»</b> course.\n\nWould you like to register for a trial lesson?`
              : `Siz <b>«${escapeHtml(course.title)}»</b> kursi havolasi orqali kirdingiz.\n\nUshbu kurs uchun sinov darsiga yozilmoqchimisiz?`;

          await ctx.reply(prompt, {
            reply_markup: getMainMenuReplyKeyboard(lang),
            parse_mode: 'HTML',
          });
          await ctx.conversation.enter('registrationConversation');
          return;
        }
      } catch {
        // Fallback to normal welcome
      }
    } else if (branchSlug) {
      try {
        const branch = await apiClient.getBranchBySlug(branchSlug);
        if (branch) {
          ctx.session.registrationDraft = {
            ...draft,
            branchName: branch.name,
          };
          const prompt =
            lang === 'ru'
              ? `Вы перешли по ссылке на филиал <b>«${escapeHtml(branch.name)}»</b>.\n\nХотите записаться на пробный урок в этом филиале?`
              : lang === 'en'
              ? `You followed a link to the <b>«${escapeHtml(branch.name)}»</b> branch.\n\nWould you like to register for a trial lesson at this branch?`
              : `Siz <b>«${escapeHtml(branch.name)}»</b> filiali havolasi orqali kirdingiz.\n\nUshbu filialdagi sinov darsiga yozilmoqchimisiz?`;

          await ctx.reply(prompt, {
            reply_markup: getMainMenuReplyKeyboard(lang),
            parse_mode: 'HTML',
          });
          await ctx.conversation.enter('registrationConversation');
          return;
        }
      } catch {
        // Fallback to normal welcome
      }
    }
  }

  // Normal welcome flow with banner image if available
  try {
    if (fs.existsSync(bannerPath)) {
      await ctx.replyWithPhoto(new InputFile(bannerPath), {
        caption: welcomeText,
        reply_markup: getWelcomeQuickInlineKeyboard(lang),
        parse_mode: 'HTML',
      });
      await ctx.reply(s.CHOOSE_SECTION, {
        reply_markup: getMainMenuReplyKeyboard(lang),
        parse_mode: 'HTML',
      });
      return;
    }
  } catch {
    // Graceful fallback to text reply if photo fails
  }

  await ctx.reply(welcomeText, {
    reply_markup: getWelcomeQuickInlineKeyboard(lang),
    parse_mode: 'HTML',
  });
  await ctx.reply(s.CHOOSE_SECTION, {
    reply_markup: getMainMenuReplyKeyboard(lang),
    parse_mode: 'HTML',
  });
}

// /start command: ALWAYS prompts language selection first as requested
startComposer.command('start', async (ctx) => {
  const payload = ctx.match;

  // Store deep link in draft if present so it can be resumed after language choice
  if (payload) {
    const deepLink = parseDeepLink(payload);
    if (deepLink.type === 'course') {
      ctx.session.registrationDraft = {
        courseSlug: deepLink.value,
        attributionSource: `DEEPLINK_COURSE_${deepLink.value}`,
      };
    } else if (deepLink.type === 'branch') {
      ctx.session.registrationDraft = {
        branchSlug: deepLink.value,
        attributionSource: `DEEPLINK_BRANCH_${deepLink.value}`,
      };
    } else if (deepLink.type === 'source') {
      ctx.session.registrationDraft = {
        attributionSource: `CAMPAIGN_${deepLink.value.toUpperCase()}`,
      };
    }
  }

  const promptText =
    `👋 <b>Assalomu alaykum! Ustoz Akademiyasiga xush kelibsiz.</b>\n` +
    `Iltimos, davom etish uchun muloqot tilini tanlang:\n\n` +
    `🇷🇺 <b>Здравствуйте! Добро пожаловать в Ustoz Akademiyasi.</b>\n` +
    `Пожалуйста, выберите удобный для вас язык общения:\n\n` +
    `🇬🇧 <b>Welcome to Ustoz Akademiyasi!</b>\n` +
    `Please select your preferred language:`;

  await ctx.reply(promptText, {
    reply_markup: getLanguageInlineKeyboard(),
    parse_mode: 'HTML',
  });
});

// Callback handler for language selection: lang:uz, lang:ru, lang:en
startComposer.callbackQuery(/^lang:(uz|ru|en)$/, async (ctx) => {
  const lang = ctx.match[1] as BotLanguage;
  ctx.session.language = lang;
  ctx.session.hasSelectedLanguage = true;

  const notifyText =
    lang === 'ru'
      ? '🇷🇺 Выбран русский язык'
      : lang === 'en'
      ? '🇬🇧 English language selected'
      : '🇺🇿 O‘zbek tili tanlandi';

  await ctx.answerCallbackQuery({ text: notifyText });

  // Optional: remove or edit the language prompt message
  try {
    if (ctx.callbackQuery.message) {
      await ctx.editMessageText(
        `✅ ${notifyText}\n\n<i>${lang === 'ru' ? 'Загрузка меню...' : lang === 'en' ? 'Loading menu...' : 'Menyu yuklanmoqda...'}</i>`,
        { parse_mode: 'HTML' }
      );
    }
  } catch {
    // Non-critical if editing fails
  }

  // Continue to the welcome experience and main menu
  await sendWelcomeExperience(ctx, lang);
});

// /language or /lang command to switch language anytime
startComposer.command(['language', 'lang'], async (ctx) => {
  const promptText =
    `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\n` +
    `Muloqot tilini o‘zgartirish uchun quyidagi tugmalardan birini bosing:\n` +
    `Для смены языка нажмите одну из кнопок ниже:\n` +
    `To change the language, please click one of the buttons below:`;

  await ctx.reply(promptText, {
    reply_markup: getLanguageInlineKeyboard(),
    parse_mode: 'HTML',
  });
});

// Button listener for language switch from reply keyboard & inline menu
startComposer.hears(
  [/^🌐 (Tilni tanlash|Сменить язык|Change language)$/i, /^🌐/i],
  async (ctx, next) => {
    const text = ctx.message?.text || '';
    if (
      text.includes('Tilni') ||
      text.includes('язык') ||
      text.includes('language') ||
      text === '🌐'
    ) {
      const promptText =
        `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\n` +
        `Quyidagi tugmalardan birini bosing:`;

      await ctx.reply(promptText, {
        reply_markup: getLanguageInlineKeyboard(),
        parse_mode: 'HTML',
      });
      return;
    }
    return next();
  }
);

startComposer.callbackQuery('nav:language', async (ctx) => {
  await ctx.answerCallbackQuery();
  const promptText =
    `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\n` +
    `Iltimos, o‘zingizga ma’qul tilni tanlang:`;

  try {
    if (ctx.callbackQuery.message) {
      await ctx.editMessageText(promptText, {
        reply_markup: getLanguageInlineKeyboard(),
        parse_mode: 'HTML',
      });
      return;
    }
  } catch {
    // If edit fails, send fresh message
  }

  await ctx.reply(promptText, {
    reply_markup: getLanguageInlineKeyboard(),
    parse_mode: 'HTML',
  });
});

// /help command
startComposer.command('help', async (ctx) => {
  const lang = ctx.session.language || 'uz';
  const s = BOT_LOCALIZED_STRINGS[lang] || BOT_LOCALIZED_STRINGS.uz;
  await ctx.reply(s.HELP, {
    reply_markup: getMainMenuReplyKeyboard(lang),
    parse_mode: 'HTML',
  });
});

// /cancel command
startComposer.command('cancel', async (ctx) => {
  const lang = ctx.session.language || 'uz';
  ctx.session.registrationDraft = undefined;
  await ctx.conversation.exit('registrationConversation');
  const cancelText =
    lang === 'ru'
      ? '↩️ Регистрация отменена.\n\nВы можете начать заново в любое удобное время.'
      : lang === 'en'
      ? '↩️ Registration cancelled.\n\nYou can restart the process anytime.'
      : '↩️ Ro‘yxatdan o‘tish bekor qilindi.\n\nIstasangiz, jarayonni istalgan vaqtda qayta boshlashingiz mumkin.';

  await ctx.reply(cancelText, {
    reply_markup: getMainMenuReplyKeyboard(lang),
    parse_mode: 'HTML',
  });
});

// Return to main menu callback
startComposer.callbackQuery('nav:main', async (ctx) => {
  await ctx.answerCallbackQuery();
  const lang = ctx.session.language || 'uz';
  const text =
    lang === 'ru'
      ? `🏠 <b>Главное меню</b>\n\nВыберите один из разделов:`
      : lang === 'en'
      ? `🏠 <b>Main menu</b>\n\nPlease choose an option:`
      : `🏠 <b>Bosh menyu</b>\n\nQuyidagi bo‘limlardan birini tanlang:`;

  try {
    if (ctx.callbackQuery.message?.photo) {
      await ctx.editMessageCaption({
        caption: text,
        reply_markup: getMainMenuInlineKeyboard(lang),
        parse_mode: 'HTML',
      });
      return;
    }

    if (ctx.callbackQuery.message) {
      await ctx.editMessageText(text, {
        reply_markup: getMainMenuInlineKeyboard(lang),
        parse_mode: 'HTML',
      });
      return;
    }
  } catch {
    // If message cannot be edited, send fresh reply
  }

  await ctx.reply(text, {
    reply_markup: getMainMenuInlineKeyboard(lang),
    parse_mode: 'HTML',
  });
});
