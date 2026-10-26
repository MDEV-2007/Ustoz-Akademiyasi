export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  publicAppUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
  apiPublicUrl: process.env.API_PUBLIC_URL || 'http://localhost:4000',

  database: {
    url: process.env.DATABASE_URL,
    testUrl: process.env.DATABASE_TEST_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'ustoz_akademiyasi_super_secure_access_secret_key_2026_xyz',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'ustoz_akademiyasi_super_secure_refresh_secret_key_2026_xyz',
    accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
    refreshTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map((o) => o.trim()),
  },

  redis: {
    url: process.env.REDIS_URL || '',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatIds: (process.env.TELEGRAM_CHAT_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
    operatorIds: (process.env.TELEGRAM_OPERATOR_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  },

  bot: {
    apiToken: process.env.BOT_API_TOKEN || '',
  },

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    maxSizeMb: parseInt(process.env.UPLOAD_MAX_SIZE_MB || '10', 10),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
});
