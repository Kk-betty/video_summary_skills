const { spawn } = require('child_process');
const path = require('path');

console.log('='.repeat(70));
console.log('🚀 视频总结网站 - 一键启动脚本');
console.log('='.repeat(70));
console.log('');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// 启动后端
console.log(`${colors.green}[1/3] 启动后端 API 服务器...${colors.reset}`);
const backend = spawn('node', ['api/server.js'], {
  cwd: __dirname,
  shell: true,
  stdio: ['inherit', 'pipe', 'inherit'],
});

backend.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`${colors.cyan}[后端]${colors.reset}`, output.trim());
});

// 等待后端启动
setTimeout(() => {
  console.log('');
  console.log(`${colors.green}[2/3] 启动前端 Vite 服务器...${colors.reset}`);
  
  const frontend = spawn('node', ['node_modules/vite/bin/vite.js'], {
    cwd: __dirname,
    shell: true,
    stdio: ['inherit', 'pipe', 'inherit'],
  });

  frontend.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`${colors.blue}[前端]${colors.reset}`, output.trim());
    
    if (output.includes('Local:')) {
      console.log('');
      console.log('='.repeat(70));
      console.log(`${colors.green}✅ 前端和后端启动成功！${colors.reset}`);
      console.log('='.repeat(70));
      console.log('');
      console.log('📍 本地访问地址：');
      console.log('   前端：http://localhost:5174');
      console.log('   后端：http://localhost:3001');
      console.log('');
      console.log('🌐 局域网访问：');
      console.log('   http://192.168.1.5:5174');
      console.log('');
      console.log(`${colors.yellow}💡 如果需要外网访问，新开一个终端运行：${colors.reset}`);
      console.log('   node start-tunnel.cjs');
      console.log('');
      console.log('='.repeat(70));
    }
  });
  
  // 5秒后询问是否启动内网穿透
  setTimeout(() => {
    console.log('');
    console.log(`${colors.yellow}[3/3] 是否同时启动内网穿透？(Y/N)${colors.reset}`);
    console.log(`${colors.cyan}提示：按 Y 启动，按 N 跳过，或按 Ctrl+C 停止${colors.reset}`);
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('');
        console.log(`${colors.green}正在启动内网穿透...${colors.reset}`);
        rl.close();
        
        const tunnel = spawn('node', ['start-tunnel.cjs'], {
          cwd: __dirname,
          shell: true,
          stdio: ['inherit', 'pipe', 'inherit'],
        });
        
        tunnel.stdout.on('data', (data) => {
          console.log(`${colors.yellow}[穿透]${colors.reset}`, data.toString().trim());
        });
        
      } else {
        console.log('');
        console.log(`${colors.cyan}好的，内网穿透已跳过。需要时手动运行：node start-tunnel.cjs${colors.reset}`);
        rl.close();
      }
    });
  }, 5000);
  
}, 2000);

// 处理退出
process.on('SIGINT', () => {
  console.log('');
  console.log('\n🛑 正在停止所有服务...');
  if (backend) backend.kill();
  process.exit(0);
});