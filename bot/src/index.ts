import http from 'http';
import { run } from '@grammyjs/runner';
import { webhookCallback } from 'grammy';
import { createBot, setupBotCommands } from './bot';
import { getConfig } from './config/env.config';

async function bootstrap() {
  const config = getConfig();
  console.log('====================================================');
  console.log('USTOZ AKADEMIYASI — TELEGRAM BOT SERVICE');
  console.log(`Mode: ${config.BOT_MODE}`);
  console.log(`Backend API: ${config.BACKEND_API_URL}`);
  console.log(`Website: ${config.PUBLIC_WEBSITE_URL}`);
  console.log(`Authorized Admins: ${config.ADMIN_TELEGRAM_IDS.length}`);
  console.log('====================================================\n');

  const bot = createBot();

  // Register commands on Telegram
  await setupBotCommands(bot);

  if (config.BOT_MODE === 'webhook') {
    if (!config.BOT_WEBHOOK_URL) {
      throw new Error('BOT_MODE=webhook holatida BOT_WEBHOOK_URL kiritilishi shart');
    }

    // Set Webhook on Telegram API
    await bot.api.setWebhook(config.BOT_WEBHOOK_URL, {
      secret_token: config.BOT_WEBHOOK_SECRET || undefined,
    });
    console.log(`✅ Webhook o‘rnatildi: ${config.BOT_WEBHOOK_URL}`);

    // Create simple HTTP server for webhook
    const handleWebhook = webhookCallback(bot, 'http', {
      secretToken: config.BOT_WEBHOOK_SECRET || undefined,
    });

    const server = http.createServer((req, res) => {
      if (req.url === '/health' || req.url === '/healthz') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', service: 'ustoz-telegram-bot' }));
        return;
      }
      handleWebhook(req, res);
    });

    server.listen(config.BOT_WEBHOOK_PORT, () => {
      console.log(`🚀 Webhook server tinglamoqda: port ${config.BOT_WEBHOOK_PORT}`);
    });

    const shutdown = async () => {
      console.log('🛑 Webhook server to‘xtatilmoqda...');
      server.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } else {
    // Long Polling Mode
    console.log('🚀 Long Polling rejimida ishga tushmoqda...');
    
    // Clear webhook before starting polling to avoid conflict
    try {
      await bot.api.deleteWebhook();
    } catch {
      // Ignore
    }

    const shutdown = async () => {
      console.log('🛑 Telegram bot to‘xtatilmoqda...');
      await bot.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    await bot.start({
      drop_pending_updates: false,
      onStart: (botInfo) => {
        console.log(`✅ Ustoz Akademiyasi Telegram boti (@${botInfo.username}) muvaffaqiyatli ishlamoqda!`);
      },
    });
  }
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('❌ Botni ishga tushirishda xatolik:', err);
    process.exit(1);
  });
}
