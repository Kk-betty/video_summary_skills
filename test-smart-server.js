import http from 'http';

console.log('🧪 开始测试智能视频总结服务器...\n');

const testVideos = [
  {
    name: '史蒂夫·乔布斯访谈',
    url: 'https://www.bilibili.com/video/BV1wmofByE3k/'
  },
  {
    name: '辩论视频',
    url: 'https://www.bilibili.com/video/BV1euRQBBEvN/'
  }
];

async function testVideo(videoInfo) {
  console.log(`\n📺 测试视频: ${videoInfo.name}`);
  console.log('🔗 URL:', videoInfo.url);
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({ url: videoInfo.url });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/summarize',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 成功获取总结!');
          console.log('📌 标题:', result.title);
          console.log('👤 作者:', result.channel);
          console.log('⏱️ 时长:', result.duration);
          console.log('📊 观看量:', result.views);
          console.log('📝 总结预览:', result.summary.substring(0, 100) + '...');
          console.log('🎯 要点数量:', result.keyPoints.length);
          console.log('✨ 亮点数量:', result.highlights.length);
          resolve(true);
        } catch (e) {
          console.log('❌ 解析响应失败:', e.message);
          console.log('📄 原始响应:', data);
          resolve(false);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ 请求失败:', e.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 健康检查...');
  const healthReq = http.get('http://localhost:3001/api/health', (res) => {
    let data = '';
    res.on('data', (d) => { data += d; });
    res.on('end', async () => {
      console.log('✅ 服务器健康状态:', data);
      
      for (const video of testVideos) {
        await testVideo(video);
        // 等待一下避免请求过快
        await new Promise(r => setTimeout(r, 1000));
      }
      
      console.log('\n🎉 测试完成!');
    });
  });
  
  healthReq.on('error', (e) => {
    console.error('❌ 健康检查失败:', e.message);
  });
}

runTests();
