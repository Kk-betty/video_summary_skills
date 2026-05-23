// 简单的内网穿透启动脚本
console.log('🚀 正在启动内网穿透服务...');
console.log('⏳ 请稍候...\n');

// 直接使用 npx localtunnel
const { spawn } = require('child_process');

const tunnel = spawn('npx', ['localtunnel', '--port', '5173'], {
  shell: true
});

tunnel.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('your url is:')) {
    console.log('\n' + '='.repeat(70));
    console.log('✅ 成功！！！');
    console.log('='.repeat(70));
    console.log('🌐 您的外网访问链接已获取！');
    console.log('💡 请将上方显示的链接分享给您的朋友！');
    console.log('='.repeat(70) + '\n');
  }
});

tunnel.stderr.on('data', (data) => {
  console.log(data.toString());
});

tunnel.on('close', (code) => {
  console.log(`\n❌ 隧道服务已关闭，代码: ${code}`);
});

tunnel.on('error', (err) => {
  console.error('\n❌ 启动失败:', err.message);
  console.log('\n💡 请尝试手动运行: npx localtunnel --port 5173');
});
