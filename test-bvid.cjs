
const axios = require('axios');

const testBVID = 'BV1uX9rBvEQn';

console.log('Testing Bilibili API for BVID:', testBVID);

axios.get('https://api.bilibili.com/x/web-interface/view', {
  params: { bvid: testBVID },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com/'
  }
})
.then(response => {
  console.log('Response code:', response.data.code);
  if (response.data.code === 0 && response.data.data) {
    console.log('Success!');
    console.log('视频标题:', response.data.data.title);
    console.log('UP主:', response.data.data.owner.name);
    console.log('时长:', response.data.data.duration, '秒');
    console.log('播放量:', response.data.data.stat.view);
    console.log('发布时间:', response.data.data.pubdate ? new Date(response.data.data.pubdate * 1000).toLocaleDateString() : '未知');
  } else {
    console.log('API Error:', response.data.message);
  }
})
.catch(error => {
  console.error('Error:', error.message);
});
