import fs from 'fs';
import path from 'path';
import { StorageAdapter } from 'grammy';
import Redis from 'ioredis';
import { SessionData } from '../types/context';
import { getConfig } from '../config/env.config';

export class FileSessionStorage<T> implements StorageAdapter<T> {
  private filePath: string;
  private cache: Map<string, T> = new Map();

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(process.cwd(), '.sessions.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const obj = JSON.parse(raw);
        for (const [key, val] of Object.entries(obj)) {
          this.cache.set(key, val as T);
        }
      }
    } catch (err) {
      // Non-fatal, start fresh
      this.cache.clear();
    }
  }

  private saveToDisk() {
    try {
      const obj: Record<string, T> = {};
      for (const [key, val] of this.cache.entries()) {
        obj[key] = val;
      }
      fs.writeFileSync(this.filePath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      // In constrained environments, don't crash
    }
  }

  async read(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async write(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
    this.saveToDisk();
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.saveToDisk();
  }
}

export class RedisSessionStorage<T> implements StorageAdapter<T> {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }

  async read(key: string): Promise<T | undefined> {
    try {
      const val = await this.redis.get(`bot:session:${key}`);
      return val ? JSON.parse(val) : undefined;
    } catch {
      return undefined;
    }
  }

  async write(key: string, value: T): Promise<void> {
    try {
      // Sessions expire after 7 days of inactivity
      await this.redis.set(`bot:session:${key}`, JSON.stringify(value), 'EX', 7 * 24 * 60 * 60);
    } catch {
      // Graceful degradation
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(`bot:session:${key}`);
    } catch {
      // Ignore
    }
  }
}

export function createSessionStorage(): StorageAdapter<SessionData> {
  const config = getConfig();
  if (config.REDIS_URL && config.REDIS_URL.trim() !== '') {
    try {
      return new RedisSessionStorage<SessionData>(config.REDIS_URL);
    } catch {
      return new FileSessionStorage<SessionData>();
    }
  }
  return new FileSessionStorage<SessionData>();
}

export function initialSessionData(): SessionData {
  return {
    language: 'uz',
  };
}
