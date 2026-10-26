import { BotError, GrammyError, HttpError } from 'grammy';
import { MyContext } from '../types/context';
import { getMainMenuReplyKeyboard } from '../keyboards/main-menu.keyboard';

export async function globalErrorHandler(err: BotError<MyContext>) {
  const ctx = err.ctx;
  const e = err.error;

  console.error(`[Telegram Error] Update ID: ${ctx.update.update_id}`, {
    userId: ctx.from?.id,
    username: ctx.from?.username,
    errorName: (e as any)?.name,
    errorMessage: (e as any)?.message,
  });

  if (e instanceof GrammyError) {
    console.error('[GrammyError]', e.description);
  } else if (e instanceof HttpError) {
    console.error('[Telegram HTTP Error]', e);
  } else {
    console.error('[Unhandled Exception]', e);
  }

  // Gracefully inform the user without technical stack traces
  try {
    const errorText =
      "⚠️ Texnik nosozlik yuz berdi. Iltimos, bir ozdan so‘ng qaytadan urinib ko‘ring yoki yordam uchun ma’muriyatga bog‘laning.";
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errorText, show_alert: true });
    } else {
      await ctx.reply(errorText, {
        reply_markup: getMainMenuReplyKeyboard(),
      });
    }
  } catch (replyErr) {
    console.error('[Failed to send error notification to user]', replyErr);
  }
}
