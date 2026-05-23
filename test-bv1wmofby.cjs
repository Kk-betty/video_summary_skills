const http = require('http');

const postData = JSON.stringify({
  url: 'https://www.bilibili.com/video/BV1wmofByE3k/?spm_id_from=333.1007.tianma.23-2-88.click&vd_source=cf00bb25879db4e915c8b2dad47b2cf2'
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
  console.log('状态码:', res.statusCode);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('响应主体:');
    const data = JSON.parse(body);
    console.log(JSON.stringify(data, null, 2));
  });
});

req.on('error', (e) => {
  console.error('请求遇到问题:', e.message);
});

req.write(postData);
req.end();
