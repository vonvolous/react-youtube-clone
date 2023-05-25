const { createProxyMiddleware } = require('http-proxy-middleware');
//proxy를 사용해 CORS 이슈를 해결해준다
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};