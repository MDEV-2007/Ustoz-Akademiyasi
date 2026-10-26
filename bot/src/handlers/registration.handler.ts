import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from '../types/context';
import { BOT_STRINGS } from '../config/constants';
import { getMainMenuReplyKeyboard } from '../keyboards/main-menu.keyboard';

export const registrationComposer = new Composer<MyContext>();

registrationComposer.hears(
  [
    BOT_STRINGS.MENU_REGISTER,
    '📝 Запись на пробный урок',
    '📝 Sign up for trial',
    /^📝 (Sinov darsiga yozilish|Запись на пробный урок|Sign up for trial)/i,
  ],
  async (ctx) => {
  // Check if user has an unfinished draft
  if (ctx.session.registrationDraft?.courseSlug || ctx.session.registrationDraft?.fullName) {
    const keyboard = new InlineKeyboard()
      .text('▶️ Davom ettirish', 'reg_resume:continue')
      .row()
      .text('🔄 Qaytadan boshlash', 'reg_resume:restart');

    await ctx.reply(
      "📝 Sizda tugallanmagan ariza mavjud. Uni davom ettirasizmi yoki yangidan boshlaysizmi?",
      { reply_markup: keyboard },
    );
    return;
  }

  await ctx.conversation.enter('registrationConversation');
});

registrationComposer.callbackQuery('nav:register', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter('registrationConversation');
});

registrationComposer.callbackQuery('reg_resume:continue', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter('registrationConversation');
});

registrationComposer.callbackQuery('reg_resume:restart', async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.registrationDraft = undefined;
  await ctx.conversation.enter('registrationConversation');
});
