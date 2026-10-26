import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { hydrateContext } from '@grammyjs/hydrate';
import { MyContext } from './types/context';
import { getConfig } from './config/env.config';
import { createSessionStorage, initialSessionData } from './sessions/session-storage';
import { loggingMiddleware } from './middleware/logging.middleware';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';
import { globalErrorHandler } from './middleware/error.middleware';

// Conversations
import { registrationConversation } from './conversations/registration.conversation';

// Handlers
import { startComposer } from './handlers/start.handler';
import { coursesComposer } from './handlers/courses.handler';
import { branchesComposer } from './handlers/branches.handler';
import { teachersComposer } from './handlers/teachers.handler';
import { registrationComposer } from './handlers/registration.handler';
import { faqComposer } from './handlers/faq.handler';
import { learningComposer } from './handlers/learning.handler';
import { contactComposer } from './handlers/contact.handler';
import { adminComposer } from './handlers/admin.handler';
import { operatorChannelComposer } from './handlers/operator-channel.handler';

export function createBot(tokenOverride?: string): Bot<MyContext> {
  const config = getConfig();
  const token = tokenOverride || config.BOT_TOKEN;

  const bot = new Bot<MyContext>(token);

  // Set default parse_mode to HTML for rich typography across all message methods
  const applyHtmlParseMode = (prev: any, method: string, payload: any, signal: any) => {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      !('parse_mode' in payload) &&
      [
        'sendMessage',
        'sendPhoto',
        'sendVideo',
        'sendAnimation',
        'sendAudio',
        'sendDocument',
        'editMessageText',
        'editMessageCaption',
      ].includes(method)
    ) {
      payload.parse_mode = 'HTML';
    }
    return prev(method, payload, signal);
  };

  bot.api.config.use(applyHtmlParseMode);

  bot.use(async (ctx, next) => {
    ctx.api.config.use(applyHtmlParseMode);
    await next();
  });

  // 1. Plugins
  bot.use(hydrateContext());
  bot.use(
    session({
      initial: initialSessionData,
      storage: createSessionStorage(),
    }),
  );
  bot.use(conversations());
  bot.use(createConversation(registrationConversation));

  // 2. Middlewares
  bot.use(rateLimitMiddleware);
  bot.use(loggingMiddleware);

  // 3. Handlers
  bot.use(operatorChannelComposer);
  bot.use(startComposer);
  bot.use(coursesComposer);
  bot.use(branchesComposer);
  bot.use(teachersComposer);
  bot.use(registrationComposer);
  bot.use(faqComposer);
  bot.use(learningComposer);
  bot.use(contactComposer);
  bot.use(adminComposer);

  // 4. Global Error Boundary
  bot.catch(globalErrorHandler);

  return bot;
}

export async function setupBotCommands(bot: Bot<MyContext>): Promise<void> {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Botni ishga tushirish / Tilni tanlash' },
      { command: 'language', description: 'Muloqot tilini tanlash / Сменить язык / Change language' },
      { command: 'help', description: 'Yordam va bo‘limlar tavsifi' },
      { command: 'cancel', description: 'Joriy jarayonni bekor qilish' },
      { command: 'admin', description: 'Ma’muriyat boshqaruvi (faqat adminlar)' },
      { command: 'leads', description: 'Arizalar ro‘yxati (faqat adminlar)' },
    ]);
  } catch (err: any) {
    console.warn('[Command Setup Warning] Telegram buyruqlarini o‘rnatib bo‘lmadi:', err.message);
  }
}
