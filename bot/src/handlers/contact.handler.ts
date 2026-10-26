import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { BOT_STRINGS } from '../config/constants';
import { apiClient } from '../services/api-client.service';
import { getConfig } from '../config/env.config';

import { InlineKeyboard } from 'grammy';
import { escapeHtml, safeEditOrReply } from '../utils/formatters';

export const contactComposer = new Composer<MyContext>();

async function showContactInfo(ctx: MyContext) {
  let phone = '+998 55 518 44 00';
  let hours = 'Dushanba – Shanba, 09:00 – 19:00';
  let address = 'Toshkent shahri, 8 ta rasmiy filial';
  let tgHandle = '@ustozakademiyasi';
  let tgUrl = 'https://t.me/ustozakademiyasi';

  try {
    const settings = await apiClient.getSiteSettings();
    if (settings?.contact_info?.phoneDisplay) {
      phone = settings.contact_info.phoneDisplay;
    }
    if (settings?.contact_info?.workingHours) {
      hours = settings.contact_info.workingHours;
    }
    if (settings?.contact_info?.mainAddress) {
      address = settings.contact_info.mainAddress;
    }
    if (settings?.social_links?.telegramHandle) {
      tgHandle = settings.social_links.telegramHandle;
    }
    if (settings?.social_links?.telegramUrl) {
      tgUrl = settings.social_links.telegramUrl;
    }
  } catch {
    // Fall back to verified defaults
  }

  const config = getConfig();
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  const text =
    `📞 <b>Bog‘lanish</b>\n\n` +
    `Savollaringiz bormi? Kurs tanlashda yordam kerakmi? Ustoz Akademiyasi jamoasi sizga yordam beradi.\n\n` +
    `☎️ <b>Call-markaz:</b> <code>${escapeHtml(phone)}</code>\n` +
    `🕘 <b>Ish vaqti:</b> ${escapeHtml(hours)}\n` +
    `📍 <b>Manzil:</b> ${escapeHtml(address)}`;

  const lang = ctx.session.language || 'uz';

  const registerLabel =
    lang === 'ru'
      ? '📝 Записаться на курс'
      : lang === 'en'
      ? '📝 Sign up for course'
      : '📝 Kursga yozilish';

  const websiteLabel =
    lang === 'ru'
      ? '🌐 Официальный сайт'
      : lang === 'en'
      ? '🌐 Official website'
      : '🌐 Rasmiy sayt';

  const mainMenuLabel =
    lang === 'ru'
      ? '🏠 Главное меню'
      : lang === 'en'
      ? '🏠 Main menu'
      : '🏠 Bosh menyu';

  const keyboard = new InlineKeyboard()
    .text(registerLabel, 'nav:register')
    .row()
    .url(websiteLabel, config.PUBLIC_WEBSITE_URL)
    .text(mainMenuLabel, 'nav:main');

  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
    await safeEditOrReply(ctx, text, { reply_markup: keyboard, parse_mode: 'HTML' });
  } else {
    await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
  }
}

contactComposer.hears(
  [
    BOT_STRINGS.MENU_CONTACT,
    '📞 Контакты',
    '📞 Contact',
    /^📞 (Aloqa|Контакты|Contact)/i,
  ],
  (ctx) => showContactInfo(ctx)
);
contactComposer.callbackQuery('nav:contact', (ctx) => showContactInfo(ctx));
