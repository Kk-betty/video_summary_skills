import http from 'http';

const videoUrl = 'https://www.bilibili.com/video/BV1SxSoBvEz4/?spm_id_from=333.1007.tianma.34-1-131.click&vd_source=cf00bb25879db4e915c8b2dad47b2cf2';

console.log('🧪 测试视频:', videoUrl);
console.log('🔍 正在自动识别...\n');

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
      console.log('✅ 识别结果:');
      console.log('📌 标题:', result.title);
      console.log('👤 作者:', result.channel);
      console.log('⏱️ 时长:', result.duration);
      
      console.log('\n🔍 检查是否与 Python 相关:');
      const hasPython = result.title.toLowerCase().includes('python') || 
                       result.summary.toLowerCase().includes('python');
      console.log('是否包含 Python:', hasPython ? '✅ 是' : '❌ 否');
      
      if (!hasPython) {
        console.log('\n❌ 问题：智能识别没有正确识别出这是 Python 相关视频！');
        console.log('📝 当前标题:', result.title);
      } else {
        console.log('✅ 正确识别为 Python 视频！');
      }
      
      console.log('\n📊 完整响应:');
      console.log(JSON.stringify(result, null, 2));
      
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
