
const http = require('http');

const url = 'https://www.bilibili.com/video/BV1euRQBBEvN/';
console.log('Testing new video:', url);

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
    const result = JSON.parse(body);
    console.log('✓ Success!');
    console.log('Title:', result.title);
    console.log('Channel:', result.channel);
    console.log('Duration:', result.duration);
    console.log('Views:', result.views);
    console.log('Summary:', result.summary.substring(0, 100) + '...');
    console.log('Key Points:', result.keyPoints.length, 'points');
    console.log('Highlights:', result.highlights);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
