const { spawn } = require('child_process');
const path = require('path');

console.log('='.repeat(70));
console.log('🚀 视频总结网站 - 一键启动');
console.log('='.repeat(70));
console.log('');

// 启动后端 API 服务器
console.log('📦 正在启动后端 API 服务器...');
const backend = spawn('node', ['api/server.js'], {
  cwd: __dirname,
  shell: true,
  stdio: ['inherit', 'pipe', 'inherit']
});

backend.stdout.on('data', (data) => {
  console.log('[后端]', data.toString().trim());
});

// 等待一下，让后端先启动
setTimeout(() => {
  console.log('\n🎨 正在启动前端 Vite 服务器...');
  const frontend = spawn('node', ['node_modules/vite/bin/vite.js'], {
    cwd: __dirname,
    shell: true,
    stdio: ['inherit', 'pipe', 'inherit']
  });
  
  frontend.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('[前端]', output.trim());
    
    // 检查前端是否启动成功
    if (output.includes('Local:')) {
      console.log('\n' + '='.repeat(70));
      console.log('✅ 所有服务启动成功！');
      console.log('='.repeat(70));
      console.log('');
      console.log('📍 本地访问地址：');
      console.log('   前端：http://localhost:5173');
      console.log('   后端：http://localhost:3001');
      console.log('');
      console.log('🌐 局域网访问：');
      console.log('   请查看上方前端输出中的 Network 地址');
      console.log('');
      console.log('💡 如需外网访问，请新开一个终端运行：');
      console.log('   node start-localtunnel.js');
      console.log('   或者');
      console.log('   node start-ngrok.js');
      console.log('');
      console.log('='.repeat(70));
    }
  });
}, 2000);

// 处理退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在停止所有服务...');
  backend.kill();
  process.exit(0);
});
