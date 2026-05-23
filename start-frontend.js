import { spawn } from 'child_process';

console.log('🚀 正在启动 Vite 前端开发服务器...\n');

const vite = spawn('node', ['node_modules/vite/bin/vite.js'], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'inherit'
});

vite.on('error', (err) => {
  console.error('❌ 启动失败:', err);
});

vite.on('close', (code) => {
  console.log(`\n服务器已退出，代码: ${code}`);
});
