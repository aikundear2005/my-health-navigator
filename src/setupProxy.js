// src/setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 代理所有送到 /api 路徑的請求
    createProxyMiddleware({
      target: 'https://proactive-health-backend.onrender.com', // 我們後端的真實地址
      changeOrigin: true, // 必須設置為 true
      // 重寫路徑：將 /api/data 轉為 /data，如果後端不需要 /api 前綴的話
      // 在我們的案例中，後端路徑就是 /api/data，所以不需要重寫
      // pathRewrite: {
      //   '^/api': '', 
      // },
    })
  );
};