import http from 'http';

const videoUrl = 'https://www.bilibili.com/video/BV1rP9fBPEaR/';

console.log('🧪 测试斯坦福教授视频...\n');

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
      console.log('📌 实际获取的视频信息：');
      console.log('标题:', result.title);
      console.log('描述:', result.desc);
      console.log('作者:', result.channel);
      console.log('\n当前类型识别结果: 旅行Vlog、生活分享');
      console.log('❌ 这明显是错误的！应该识别为: 教育、心理学、励志、成功学');
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
