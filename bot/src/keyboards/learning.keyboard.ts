import { InlineKeyboard } from 'grammy';
import { Article } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';
import { getConfig } from '../config/env.config';

export function getLearningMenuKeyboard(): InlineKeyboard {
  const config = getConfig();
  return new InlineKeyboard()
    .text('📖 Arab alifbosi (4 ta guruh)', 'learn_sec:alphabet')
    .row()
    .text('🗣 Maxrajlar va talaffuz', 'learn_sec:pronunciation')
    .row()
    .text('💬 Kundalik arabcha iboralar', 'learn_sec:phrases')
    .row()
    .text('📄 Markaz maqolalari va lug‘at', 'learn_sec:articles')
    .row()
    .url('🌐 Saytdagi interaktiv darslar', `${config.PUBLIC_WEBSITE_URL}/#courses`)
    .row()
    .text('🏠 Bosh menyu', 'nav:main');
}

export function getAlphabetOverviewKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📖 1-guruhdan boshlash (1–7)', 'alpha_grp:1')
    .row()
    .text('1-guruh (1–7)', 'alpha_grp:1')
    .text('2-guruh (8–14)', 'alpha_grp:2')
    .row()
    .text('3-guruh (15–21)', 'alpha_grp:3')
    .text('4-guruh (22–28)', 'alpha_grp:4')
    .row()
    .text('🔙 Ta’lim menyusi', 'nav:learning')
    .text('🏠 Bosh menyu', 'nav:main');
}

export function getAlphabetGroupKeyboard(groupNumber: number): InlineKeyboard {
  const kb = new InlineKeyboard();

  // Navigation arrows
  if (groupNumber > 1) {
    kb.text(`⬅️ ${groupNumber - 1}-guruh`, `alpha_grp:${groupNumber - 1}`);
  }
  if (groupNumber < 4) {
    kb.text(`➡️ ${groupNumber + 1}-guruh`, `alpha_grp:${groupNumber + 1}`);
  }
  kb.row();

  // Interactive Quiz for this group
  kb.text(`🎯 ${groupNumber}-guruh bilimi sinovi`, `alpha_quiz:${groupNumber}`).row();

  // Return to group selector or menu
  kb.text('📚 Harflar ro‘yxati', 'learn_sec:alphabet')
    .text('🏠 Bosh menyu', 'nav:main');

  return kb;
}

export function getAlphabetQuizKeyboard(
  groupNumber: number,
  options: { label: string; isCorrect: boolean }[]
): InlineKeyboard {
  const kb = new InlineKeyboard();

  for (let i = 0; i < options.length; i += 2) {
    const o1 = options[i];
    kb.text(o1.label, `quiz_ans:${groupNumber}:${o1.isCorrect ? '1' : '0'}`);
    if (options[i + 1]) {
      const o2 = options[i + 1];
      kb.text(o2.label, `quiz_ans:${groupNumber}:${o2.isCorrect ? '1' : '0'}`);
    }
    kb.row();
  }

  kb.text(`🔙 ${groupNumber}-guruhga qaytish`, `alpha_grp:${groupNumber}`)
    .text('🏠 Bosh menyu', 'nav:main');

  return kb;
}

export function getArticlesListKeyboard(articles: Article[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const article of articles) {
    keyboard.text(`📄 ${article.title}`, `${BOT_CALLBACK_PREFIXES.LEARNING_ARTICLE}${article.slug}`).row();
  }

  keyboard.text('🔙 Ta’lim menyusi', 'nav:learning')
    .text('🏠 Bosh menyu', 'nav:main');
  return keyboard;
}

export function getArticleDetailKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📝 Sinov darsiga yozilish', 'nav:register')
    .row()
    .text('🔙 Maqolalar ro‘yxati', 'learn_sec:articles')
    .text('🏠 Bosh menyu', 'nav:main');
}
