import { NextFunction } from 'grammy';
import { MyContext } from '../types/context';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const userHits = new Map<number, RateLimitRecord>();

const WINDOW_MS = 10_000; // 10 seconds
const MAX_REQUESTS = 25; // max 25 actions per 10s

export async function rateLimitMiddleware(ctx: MyContext, next: NextFunction): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) {
    return next();
  }

  const now = Date.now();
  const record = userHits.get(userId);

  if (!record || now > record.resetAt) {
    userHits.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  record.count++;
  if (record.count > MAX_REQUESTS) {
    console.warn(`[RateLimit Exceeded] User ${userId} sent too many requests.`);
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({
        text: "Iltimos, biroz kuting. Juda ko‘p so‘rov yuborildi.",
        show_alert: true,
      });
    } else {
      await ctx.reply("⏳ Juda ko‘p so‘rov yuborildi. Iltimos, bir necha soniya kuting.");
    }
    return;
  }

  return next();
}
