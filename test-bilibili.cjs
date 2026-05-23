
const https = require('https');

function testBilibiliAPI() {
  const bvid = 'BV1uX9rBvEQn';
  
  const options = {
    hostname: 'api.bilibili.com',
    path: `/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com/',
      'Accept': 'application/json'
    }
  };

  console.log('Testing Bilibili API with BVID:', bvid);
  
  const req = https.request(options, (res) => {
    console.log('Response status:', res.statusCode);
    console.log('Response headers:', JSON.stringify(res.headers));
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body length:', data.length);
      try {
        const result = JSON.parse(data);
        console.log('Parsed JSON:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.log('Parse error:', e.message);
        console.log('Raw data:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
  });

  req.on('timeout', () => {
    console.log('Request timeout');
    req.destroy();
  });

  req.setTimeout(15000);
  req.end();
}

testBilibiliAPI();
