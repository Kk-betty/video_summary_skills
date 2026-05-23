const http = require('http');

const testVideo = () => {
  const postData = JSON.stringify({
    url: 'https://www.bilibili.com/video/BV1wmofByE3k/'
  });

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
    console.log('Status Code:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('\nResponse:');
      try {
        const result = JSON.parse(data);
        console.log('Title:', result.title);
        console.log('Channel:', result.channel);
        console.log('Duration:', result.duration);
        console.log('Summary:', result.summary.substring(0, 100) + '...');
        console.log('\n✅ Video recognized successfully!');
      } catch (e) {
        console.log('Raw data:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
  });

  req.write(postData);
  req.end();
};

console.log('Testing Bilibili video summary...\n');
testVideo();
