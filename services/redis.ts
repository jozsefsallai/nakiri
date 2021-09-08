import * as _redis from 'redis';
import config from '@/config';

import { captureException } from '@sentry/nextjs';

class Redis {
  private static instance: Redis;
  private client: _redis.RedisClient;

  constructor() {
    this.client = _redis.createClient(config.redis.buildRedisUrl(0));

    this.client.on('error', err => {
      console.error(err);
      captureException(err);
    });
  }

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  private deserialize<T>(value: string): T | string {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  private serialize<T>(value: T): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    return JSON.stringify(value);
  }

  public async get<T = string>(key: string): Promise<T | string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(this.deserialize<T>(result));
        }
      });
    });
  }

  public async set<T = string>(key: string, value: T, expiry?: number): Promise<void> {
    const serializedValue = this.serialize<T>(value);

    return new Promise((resolve, reject) => {
      if (expiry) {
        return this.client.setex(key, expiry, serializedValue, (err) => {
          if (err) {
            return reject(err);
          } else {
            return resolve();
          }
        });
      }

      this.client.set(key, serializedValue, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
}

export default Redis;
