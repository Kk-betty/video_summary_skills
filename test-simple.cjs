
const http = require('http');

async function test() {
  console.log('Testing server...\n');

  const urls = [
    'https://www.bilibili.com/video/BV1uX9rBvEQn/',
    'https://www.bilibili.com/video/BV1xx411c7mD/',
    'https://www.bilibili.com/video/BV1xx411c7mX/'
  ];

  for (const url of urls) {
    console.log('Testing:', url);
    
    try {
      const result = await sendRequest(url);
      console.log('✓ Success! Title:', result.title);
      console.log('  Channel:', result.channel);
      console.log('  Duration:', result.duration);
      console.log('  Views:', result.views);
    } catch (error) {
      console.error('✗ Error:', error.message);
    }
    
    console.log('---');
  }
}

function sendRequest(url) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ url });
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/summarize',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

test();
