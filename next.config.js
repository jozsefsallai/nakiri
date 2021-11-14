const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './docs-theme.config.js',
});

const shouldUploadSourceMapsToSentry =
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.SENTRY_AUTH_TOKEN;

module.exports = withSentryConfig(
  withNextra({
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },

    sentry: {
      disableClientWebpackPlugin: !shouldUploadSourceMapsToSentry,
      disableServerWebpackPlugin: !shouldUploadSourceMapsToSentry,
    },

    async rewrites() {
      return [
        {
          source: '/manage',
          destination: '/api/manage',
        },
      ];
    },
  }),
);
