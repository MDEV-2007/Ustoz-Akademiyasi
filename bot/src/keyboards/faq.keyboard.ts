import { InlineKeyboard } from 'grammy';
import { FAQ } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export function getFaqCategoriesKeyboard(categories: string[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  keyboard.text('🔘 Barchasi', `${BOT_CALLBACK_PREFIXES.FAQ_CATEGORY}all`).row();

  for (let i = 0; i < categories.length; i += 2) {
    keyboard.text(`📁 ${categories[i]}`, `${BOT_CALLBACK_PREFIXES.FAQ_CATEGORY}${categories[i]}`);
    if (categories[i + 1]) {
      keyboard.text(`📁 ${categories[i + 1]}`, `${BOT_CALLBACK_PREFIXES.FAQ_CATEGORY}${categories[i + 1]}`);
    }
    keyboard.row();
  }

  keyboard.text('🏠 Bosh menyu', 'nav:main');
  return keyboard;
}

export function getFaqQuestionsKeyboard(faqs: FAQ[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const faq of faqs) {
    const questionText = faq.question.length > 38 ? `${faq.question.slice(0, 35)}...` : faq.question;
    keyboard.text(`❓ ${questionText}`, `${BOT_CALLBACK_PREFIXES.FAQ_ITEM}${faq.id}`).row();
  }

  keyboard.text('🔙 Kategoriyalarga qaytish', 'nav:faq').row();
  keyboard.text('🏠 Bosh menyu', 'nav:main');
  return keyboard;
}

export function getFaqAnswerKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📝 Sinov darsiga yozilish', 'nav:register')
    .row()
    .text('🔙 Savollarga qaytish', 'nav:faq')
    .text('📞 Operator bilan bog‘lanish', 'nav:contact')
    .row()
    .text('🏠 Bosh menyu', 'nav:main');
}
