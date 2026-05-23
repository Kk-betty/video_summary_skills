// 这是一个 CommonJS 启动脚本，用来启动 TypeScript API 服务器
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 正在启动智能视频总结 API 服务器...');

// 使用 ts-node 来运行 TypeScript 文件
const server = spawn('npx', ['tsx', 'api/server.ts'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('❌ 服务器启动失败:', err);
});

server.on('close', (code) => {
  console.log(`服务器进程退出，代码:', code);
});
