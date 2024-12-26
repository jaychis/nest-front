const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/privacy-policy/mobile',
    createProxyMiddleware({
      target: 'https://sites.google.com/view/jaychis/home',
      changeOrigin: true,
      pathRewrite: {
        '^/privacy-policy/mobile': '',
      },
    }),
  );
};
