// 使用 Node.js 直接安装并运行 localtunnel
const { exec } = require('child_process');
const path = require('path');

console.log('='.repeat(70));
console.log('🚀 视频总结网站 - 内网穿透工具');
console.log('='.repeat(70));
console.log('');

console.log('📦 正在检查并安装 localtunnel...');

// 使用 npm 安装 localtunnel（本地）
const install = exec('npm install localtunnel --no-save', {
  cwd: __dirname,
  shell: true
});

install.stdout.on('data', (data) => {
  console.log(data.toString());
});

install.stderr.on('data', (data) => {
  console.log(data.toString());
});

install.on('close', (code) => {
  if (code === 0 || code === 1) {
    console.log('\n✅ localtunnel 准备就绪！');
    console.log('🌐 正在启动内网穿透...\n');
    
    // 直接引用本地安装的 localtunnel
    try {
      const localtunnel = require('./node_modules/localtunnel');
      
      localtunnel({ port: 5174 }).then(tunnel => {
        console.log('='.repeat(70));
        console.log('✅ 外网访问地址已获取！');
        console.log('='.repeat(70));
        console.log('');
        console.log('🌐 您的外网访问链接：');
        console.log('   ' + tunnel.url);
        console.log('');
        console.log('💡 请将此链接分享给您的朋友！');
        console.log('');
        console.log('='.repeat(70));
        console.log('🔄 保持此窗口打开，服务将持续运行...');
        console.log('='.repeat(70));
        
        tunnel.on('close', () => {
          console.log('\n❌ 隧道已关闭');
        });
        
        tunnel.on('error', (err) => {
          console.error('\n❌ 错误:', err.message);
        });
      }).catch(err => {
        console.error('\n❌ 启动失败:', err.message);
        console.log('\n💡 请检查网络连接或稍后重试');
      });
    } catch (e) {
      console.error('\n❌ 加载失败:', e.message);
      console.log('\n💡 请尝试手动安装: npm install localtunnel');
    }
  } else {
    console.log('\n❌ 安装失败，代码:', code);
  }
});
