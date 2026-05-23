const { spawn } = require('child_process');

console.log('🚀 正在启动 localtunnel 内网穿透...\n');
console.log('🌐 请稍候，正在连接服务器...\n');

// 使用 localtunnel
const lt = spawn('npx', ['localtunnel', '--port', '5173'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'inherit']
});

lt.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('your url is:')) {
    console.log('✅ 隧道建立成功！');
    console.log('='.repeat(70));
    console.log('🌐 您的外网访问地址：');
    console.log(output);
    console.log('='.repeat(70));
    console.log('\n💡 提示：将此链接分享给朋友即可访问您的视频总结网站！');
  }
});

lt.on('close', (code) => {
  console.log(`\n❌ localtunnel 已退出，代码: ${code}`);
});

lt.on('error', (err) => {
  console.error('\n❌ 启动失败:', err.message);
  console.log('\n💡 请尝试安装 localtunnel: npm install -g localtunnel');
});
