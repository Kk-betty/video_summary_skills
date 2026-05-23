
const axios = require('axios');

async function testServer() {
  const testUrl = 'https://www.bilibili.com/video/BV1uX9rBvEQn/';
  
  console.log('Testing server with URL:', testUrl);
  
  try {
    const response = await axios.post('http://localhost:3001/api/summarize', { url: testUrl });
    
    console.log('=== Server Response ===');
    console.log('Title:', response.data.title);
    console.log('Channel:', response.data.channel);
    console.log('Duration:', response.data.duration);
    console.log('Views:', response.data.views);
    console.log('Published:', response.data.published);
    console.log('Summary:', response.data.summary.substring(0, 100) + '...');
    console.log('Thumbnail:', response.data.thumbnail);
    console.log('=== Success! ===');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testServer();
