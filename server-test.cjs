
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is working!' });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL:', url);

    const bvidMatch = url.match(/(BV[0-9a-zA-Z]+)/i);
    if (!bvidMatch) {
      return res.status(400).json({ error: '无法提取视频ID' });
    }

    const bvid = bvidMatch[1].toUpperCase();
    console.log('BVID:', bvid);

    const videoData = await fetchBilibili(bvid);
    
    if (!videoData) {
      return res.status(500).json({ error: '无法获取视频信息' });
    }

    console.log('Got video title:', videoData.title);

    res.json({
      title: videoData.title,
      channel: videoData.owner?.name || '未知',
      duration: formatDuration(videoData.duration),
      thumbnail: videoData.pic,
      videoUrl: `https://www.bilibili.com/video/${bvid}`,
      views: (videoData.stat?.view || 0).toLocaleString(),
      published: videoData.pubdate ? new Date(videoData.pubdate * 1000).toISOString().split('T')[0] : '未知',
      summary: videoData.desc || '暂无简介',
      keyPoints: [
        { time: '0:00-5:00', title: '开场介绍', description: '视频开头', videoUrl: `https://www.bilibili.com/video/${bvid}?t=0` }
      ],
      highlights: ['精彩亮点1', '精彩亮点2']
    });

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: '服务器错误' });
  }
});

function fetchBilibili(bvid) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.bilibili.com',
      path: `/x/web-interface/view?bvid=${bvid}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.bilibili.com/'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.code === 0 ? result.data : null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
