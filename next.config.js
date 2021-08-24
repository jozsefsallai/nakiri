const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const shouldUploadSourceMapsToSentry = process.env.SENTRY_ORG
  && process.env.SENTRY_PROJECT
  && process.env.SENTRY_AUTH_TOKEN;

module.exports = withSentryConfig({
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
  },

  sentry: {
    disableClientWebpackPlugin: !shouldUploadSourceMapsToSentry,
    disableServerWebpackPlugin: !shouldUploadSourceMapsToSentry,
  },

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html',
        permanent: true
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/docs/insomnia.json',
        destination: '/api/docs'
      },
      {
        source: '/manage',
        destination: '/api/manage'
      }
    ];
  }
});
