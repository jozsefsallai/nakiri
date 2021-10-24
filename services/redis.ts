import * as _redis from 'redis';
import config from '@/config';

import { handleError } from '@/lib/errors';

export interface RedisScanMatch<T = string> {
  key: string;
  value: T;
}

class Redis {
  private static instance: Redis;
  private client: _redis.RedisClient;

  constructor() {
    this.client = _redis.createClient(config.redis.buildRedisUrl(0));

    this.client.on('error', (err) => {
      console.error(err);
      handleError(err);
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

  public async set<T = string>(
    key: string,
    value: T,
    expiry?: number,
  ): Promise<void> {
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

  private async scan(prefix: string, cursor: string, keys: Set<string>) {
    return this.client.scan(
      cursor,
      'MATCH',
      prefix,
      'COUNT',
      '100',
      (err, result) => {
        const [nextCursor, matches] = result;
        matches.forEach((key) => keys.add(key));

        if (nextCursor !== '0') {
          return this.scan(prefix, nextCursor, keys);
        } else {
          return keys;
        }
      },
    );
  }

  public async findPrefix<T = string>(
    prefix: string,
    computeValues: boolean = false,
  ): Promise<RedisScanMatch<T>[] | string[]> {
    const keysSet = new Set<string>();
    await this.scan(prefix, '0', keysSet);

    const keys = Array.from(keysSet);

    if (!computeValues) {
      return keys;
    }

    const values = await Promise.all(keys.map((key) => this.get<T>(key)));

    return keys.map((key, index) => ({
      key,
      value: values[index],
    })) as RedisScanMatch<T>[];
  }
}

export default Redis;
