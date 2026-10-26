import { Keyboard, InlineKeyboard } from 'grammy';
import { BOT_LOCALIZED_STRINGS, BotLanguage, BOT_CALLBACK_PREFIXES } from '../config/constants';
import { getConfig } from '../config/env.config';

export function getLanguageInlineKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🇺🇿 O‘zbekcha', `${BOT_CALLBACK_PREFIXES.LANGUAGE}uz`)
    .text('🇷🇺 Русский', `${BOT_CALLBACK_PREFIXES.LANGUAGE}ru`)
    .text('🇬🇧 English', `${BOT_CALLBACK_PREFIXES.LANGUAGE}en`);
}

export function getMainMenuReplyKeyboard(lang: BotLanguage = 'uz'): Keyboard {
  const strings = BOT_LOCALIZED_STRINGS[lang] || BOT_LOCALIZED_STRINGS.uz;
  return new Keyboard()
    .text(strings.MENU_COURSES)
    .text(strings.MENU_REGISTER)
    .row()
    .text(strings.MENU_BRANCHES)
    .text(strings.MENU_LEARNING)
    .row()
    .text(strings.MENU_FAQ)
    .text(strings.MENU_CONTACT)
    .row()
    .text(strings.MENU_LANG)
    .resized()
    .persistent();
}

export function getWelcomeQuickInlineKeyboard(lang: BotLanguage = 'uz'): InlineKeyboard {
  const config = getConfig();
  const websiteLabel =
    lang === 'ru'
      ? '🌐 Официальный сайт'
      : lang === 'en'
      ? '🌐 Official website'
      : '🌐 Rasmiy sayt';

  const contactLabel =
    lang === 'ru'
      ? '📞 Контакты'
      : lang === 'en'
      ? '📞 Contact'
      : '📞 Bog‘lanish';

  return new InlineKeyboard()
    .url(websiteLabel, config.PUBLIC_WEBSITE_URL)
    .text(contactLabel, 'nav:contact');
}

export function getMainMenuInlineKeyboard(lang: BotLanguage = 'uz'): InlineKeyboard {
  const strings = BOT_LOCALIZED_STRINGS[lang] || BOT_LOCALIZED_STRINGS.uz;
  const config = getConfig();
  const websiteLabel =
    lang === 'ru'
      ? '🌐 Официальный сайт'
      : lang === 'en'
      ? '🌐 Official website'
      : '🌐 Rasmiy sayt';

  return new InlineKeyboard()
    .text(strings.MENU_COURSES, 'nav:courses')
    .text(strings.MENU_REGISTER, 'nav:register')
    .row()
    .text(strings.MENU_BRANCHES, 'nav:branches')
    .text(strings.MENU_LEARNING, 'nav:learning')
    .row()
    .text(strings.MENU_FAQ, 'nav:faq')
    .text(strings.MENU_CONTACT, 'nav:contact')
    .row()
    .text(strings.MENU_LANG, 'nav:language')
    .url(websiteLabel, config.PUBLIC_WEBSITE_URL);
}
