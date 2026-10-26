import { NextFunction } from 'grammy';
import { MyContext } from '../types/context';

function sanitize(text: string): string {
  // Mask 9-12 digit phone numbers
  return text.replace(/(\+?998\s?\d{2})\s?(\d{3})\s?(\d{2})\s?(\d{2})/g, '$1 ***-**-$4');
}

export async function loggingMiddleware(ctx: MyContext, next: NextFunction): Promise<void> {
  const start = Date.now();
  const userId = ctx.from?.id;
  const username = ctx.from?.username ? `@${ctx.from.username}` : 'anon';
  const text = ctx.message?.text ? `"${sanitize(ctx.message.text)}"` : '';
  const callbackData = ctx.callbackQuery?.data ? `[Callback: ${ctx.callbackQuery.data}]` : '';

  console.log(`📥 [IN] User: ${userId} (${username}) ${text || callbackData}`);

  try {
    await next();
  } finally {
    const elapsed = Date.now() - start;
    console.log(`📤 [OUT] User: ${userId} completed in ${elapsed}ms`);
  }
}
