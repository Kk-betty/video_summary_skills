const { exec } = require('child_process');
const path = require('path');

console.log('='.repeat(70));
console.log('🚀 视频总结网站 - 内网穿透工具');
console.log('='.repeat(70));
console.log('');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

// 尝试加载 localtunnel
try {
  console.log('📦 检查 localtunnel...');
  
  let localtunnel;
  try {
    localtunnel = require('./node_modules/localtunnel');
  } catch (e) {
    console.log('📦 localtunnel 未安装，正在安装...');
    const result = require('child_process').execSync('npm install localtunnel --no-save', {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
    localtunnel = require('./node_modules/localtunnel');
  }
  
  console.log('✅ localtunnel 准备就绪！');
  console.log('');
  console.log('🌐 正在启动内网穿透...');
  console.log('');
  
  localtunnel({ port: 5174 }).then(tunnel => {
    console.log('='.repeat(70));
    console.log(`${colors.green}✅ 外网访问地址已获取！${colors.reset}`);
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
    console.log('');
    console.log(`${colors.yellow}提示：首次访问需要在页面输入显示的 IP 地址进行验证${colors.reset}`);
    
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
  console.error('\n❌ 启动失败:', e.message);
  console.log('\n💡 请尝试手动运行：');
  console.log('   1. 临时绕过限制：Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass');
  console.log('   2. 然后运行：npx localtunnel --port 5174');
}