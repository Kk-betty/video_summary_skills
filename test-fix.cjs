
const http = require('http');

const testCases = [
  { name: 'User\'s video', url: 'https://www.bilibili.com/video/BV1uX9rBvEQn/' },
  { name: 'Python tutorial', url: 'https://www.bilibili.com/video/BV1xx411c7mD/' },
  { name: 'Another video', url: 'https://www.bilibili.com/video/BV1xx411c7mX/' }
];

async function testServer() {
  console.log('Testing server with different video URLs...\n');

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    try {
      const result = await sendRequest(testCase.url);
      console.log(`✓ Success! Title: ${result.title}`);
      console.log(`  Channel: ${result.channel}`);
      console.log(`  Duration: ${result.duration}`);
      console.log(`  Views: ${result.views}`);
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
    console.log('---');
  }
}

function sendRequest(url) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ url: url });
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
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

testServer();
