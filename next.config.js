const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
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
      }
    ];
  }
};
