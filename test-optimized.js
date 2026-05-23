import http from 'http';

const videoUrl = 'https://www.bilibili.com/video/BV1SxSoBvEz4/';

console.log('🧪 测试优化后的智能总结...\n');

const postData = JSON.stringify({ url: videoUrl });

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
      console.log('✅ 优化后的总结结果：\n');
      console.log('='.repeat(60));
      console.log(result.summary);
      console.log('\n' + '='.repeat(60));
      console.log('\n🎯 核心要点：');
      result.keyPoints.forEach((point, index) => {
        console.log(`${index + 1}. [${point.time}] ${point.title}`);
        console.log(`   ${point.description}`);
      });
      console.log('\n✨ 精彩亮点：');
      result.highlights.forEach((highlight, index) => {
        console.log(`${index + 1}. ${highlight}`);
      });
    } catch (e) {
      console.error('❌ 解析失败:', e.message);
      console.log('📄 原始响应:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ 请求失败:', e.message);
});

req.write(postData);
req.end();
