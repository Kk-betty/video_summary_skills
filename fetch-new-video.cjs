
const https = require('https');

const bvid = 'BV1wmofByE3k';
console.log('Fetching new video info:', bvid);

const options = {
  hostname: 'api.bilibili.com',
  path: `/x/web-interface/view?bvid=${bvid}`,
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.bilibili.com/'
  }
};

let data = '';
const req = https.request(options, (res) => {
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.code === 0 && result.data) {
        console.log('✅ Got video info:');
        console.log('Title:', result.data.title);
        console.log('Owner:', result.data.owner ? result.data.owner.name : 'N/A');
        console.log('Duration:', result.data.duration, 'seconds');
        console.log('Views:', result.data.stat ? result.data.stat.view : 'N/A');
        console.log('Published:', result.data.pubdate);
        console.log('Thumbnail:', result.data.pic);
        console.log('Desc:', result.data.desc ? result.data.desc.substring(0, 200) + '...' : 'N/A');
      } else {
        console.log('API Error:', result.message);
      }
    } catch (e) {
      console.error('Parse Error:', e.message);
    }
  });
});

req.on('error', (e) => { console.error('Error:', e.message); });
req.end();
