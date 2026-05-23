
// 启动 Vite 服务器
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 正在启动 Vite 开发服务器...');

// 使用 npm 命令
const vite = spawn('node', ['node_modules/vite/bin/vite.js'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

vite.on('error', (err) => {
  console.error('❌ 启动失败:', err);
});

vite.on('close', (code) => {
  console.log(`服务器已退出，代码:', code);
});
