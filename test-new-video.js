import http from 'http';

const videoUrl = 'https://www.bilibili.com/video/BV1EsRXBEEt4/?spm_id_from=333.1007.tianma.33-1-127.click&vd_source=cf00bb25879db4e915c8b2dad47b2cf2';

console.log('🧪 测试新视频:', videoUrl);
console.log('🔍 正在自动识别并生成总结...\n');

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
  console.log('📡 响应状态码:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n✅ 自动识别结果:');
      console.log('📌 视频标题:', result.title);
      console.log('👤 视频作者:', result.channel);
      console.log('⏱️ 视频时长:', result.duration);
      console.log('📊 观看数量:', result.views);
      console.log('\n📝 智能总结:');
      console.log(result.summary);
      console.log('\n🎯 核心要点:', result.keyPoints.length, '个');
      result.keyPoints.forEach((point, index) => {
        console.log(`${index + 1}. [${point.time}] ${point.title}`);
      });
      console.log('\n✨ 亮点:', result.highlights.join('、'));
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
