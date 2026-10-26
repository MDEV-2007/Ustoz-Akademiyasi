import { NextFunction } from 'grammy';
import { MyContext } from '../types/context';
import { getConfig } from '../config/env.config';

export function isAuthorizedAdmin(userId?: number): boolean {
  if (!userId) return false;
  const config = getConfig();
  return config.ADMIN_TELEGRAM_IDS.includes(userId);
}

export async function requireAdminMiddleware(ctx: MyContext, next: NextFunction): Promise<void> {
  const userId = ctx.from?.id;

  if (!isAuthorizedAdmin(userId)) {
    console.warn(`[Security Alert] Ruxsatsiz admin urinishi: User ID ${userId}`);
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({
        text: "⛔️ Sizda ushbu ma’muriy amalni bajarish vakolati yo‘q.",
        show_alert: true,
      });
    } else {
      await ctx.reply("⛔️ <b>Kirish taqiqlangan.</b>\nSizda ma’muriy buyruqlardan foydalanish huquqi mavjud emas.");
    }
    return;
  }

  await next();
}
