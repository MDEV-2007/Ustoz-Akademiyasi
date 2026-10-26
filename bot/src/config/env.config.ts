import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN kiritilishi shart'),
  BOT_MODE: z.enum(['polling', 'webhook']).default('polling'),
  BOT_WEBHOOK_URL: z.string().url().optional(),
  BOT_WEBHOOK_SECRET: z.string().optional(),
  BOT_WEBHOOK_PORT: z.coerce.number().default(3001),
  BACKEND_API_URL: z.string().url().default('http://localhost:4000/api/v1'),
  BOT_API_TOKEN: z.string().optional().default(''),
  ADMIN_TELEGRAM_IDS: z
    .string()
    .optional()
    .default('')
    .transform((val) =>
      val
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
        .map(Number)
        .filter((id) => !isNaN(id)),
    ),
  ADMIN_NOTIFICATION_CHAT_ID: z.string().optional().default(''),
  REDIS_URL: z.string().optional().default(''),
  PUBLIC_WEBSITE_URL: z.string().url().default('https://ustozakademiyasi.uz'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type BotConfig = z.infer<typeof envSchema>;

let parsedConfig: BotConfig | null = null;

export function loadConfig(overrides?: Partial<Record<string, string>>): BotConfig {
  const rawEnv = {
    ...process.env,
    ...(overrides || {}),
  };

  // Provide a safe fallback token for test environments if none is supplied
  if (!rawEnv.BOT_TOKEN && process.env.NODE_ENV === 'test') {
    rawEnv.BOT_TOKEN = '123456789:TEST_MOCK_TELEGRAM_BOT_TOKEN_FOR_JEST';
  }

  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => ` - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`[Bot Config Error] Noto‘g‘ri yoki yetarli bo‘lmagan muhit sozlamalari:\n${errorDetails}`);
  }

  parsedConfig = result.data;
  return parsedConfig;
}

export function getConfig(): BotConfig {
  if (!parsedConfig) {
    return loadConfig();
  }
  return parsedConfig;
}
