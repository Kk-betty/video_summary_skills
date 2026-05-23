const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 正在启动 ngrok 内网穿透...\n');

// 检查 ngrok 是否可用
const checkNgrok = () => {
  return new Promise((resolve, reject) => {
    const ngrokCheck = spawn('npx', ['ngrok', 'version'], { shell: true });
    ngrokCheck.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    ngrokCheck.on('error', () => resolve(false));
  });
};

// 启动 ngrok
const startNgrok = async () => {
  const hasNgrok = await checkNgrok();
  
  if (!hasNgrok) {
    console.log('📦 正在安装 ngrok...');
  }
  
  console.log('🌐 正在启动 ngrok 隧道...');
  console.log('⏳ 请稍候...\n');
  
  // 启动 ngrok 隧道
  const ngrok = spawn('npx', ['ngrok', 'http', '5173'], {
    shell: true,
    stdio: ['inherit', 'pipe', 'inherit']
  });
  
  ngrok.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Forwarding')) {
      console.log('✅ ngrok 隧道建立成功！');
      console.log('='.repeat(70));
      console.log('🌐 您的外网访问地址：');
      console.log(output);
      console.log('='.repeat(70));
      console.log('\n💡 提示：将此链接分享给朋友即可访问您的视频总结网站！');
    }
  });
  
  ngrok.on('close', (code) => {
    console.log(`\n❌ ngrok 已退出，代码: ${code}`);
  });
};

startNgrok();
