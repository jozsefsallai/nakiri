import * as Sentry from '@sentry/nextjs';
import config from './config';

if (config.app.sentry) {
  Sentry.init({
    dsn: config.app.sentry.dsn
  });
}
