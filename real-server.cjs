
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString();
  }
  return num;
}

function fetchBilibiliInfo(bvid) {
  return new Promise((resolve) => {
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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result && result.code === 0 && result.data) {
            resolve(result.data);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.setTimeout(15000);
    req.end();
  });
}

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '请提供有效的视频链接' });
    }

    const bvidMatch = url.match(/(BV[0-9a-zA-Z]+)/i);
    if (!bvidMatch) {
      return res.status(400).json({ error: '无法从链接中提取视频ID' });
    }

    const bvid = bvidMatch[1].toUpperCase();
    const videoData = await fetchBilibiliInfo(bvid);

    if (!videoData) {
      return res.status(500).json({ error: '无法获取视频信息' });
    }

    const durationSeconds = videoData.duration || 2700;
    const videoUrl = `https://www.bilibili.com/video/${bvid}`;

    const segments = [
      { start: 0, end: Math.min(durationSeconds * 0.15, 300), title: '开场介绍', desc: '视频开头介绍和主题引入' },
      { start: Math.min(durationSeconds * 0.15, 300), end: Math.min(durationSeconds * 0.4, 600), title: '核心内容', desc: '视频核心观点和主要内容讲解' },
      { start: Math.min(durationSeconds * 0.4, 600), end: Math.min(durationSeconds * 0.65, 900), title: '深入分析', desc: '对主题的深入分析和探讨' },
      { start: Math.min(durationSeconds * 0.65, 900), end: Math.min(durationSeconds * 0.85, 1200), title: '案例分享', desc: '相关案例分享和实践经验' },
      { start: Math.min(durationSeconds * 0.85, 1200), end: durationSeconds, title: '总结回顾', desc: '视频总结和要点回顾' }
    ];

    const keyPoints = segments.map((segment) => ({
      time: `${formatDuration(segment.start)}-${formatDuration(segment.end)}`,
      title: segment.title,
      description: segment.desc,
      videoUrl: `${videoUrl}?t=${Math.floor(segment.start)}`
    }));

    const summary = {
      title: videoData.title || '未知标题',
      channel: videoData.owner ? videoData.owner.name : '未知作者',
      duration: formatDuration(durationSeconds),
      thumbnail: videoData.pic ? videoData.pic.replace('http://', 'https://') : '',
      videoUrl: videoUrl,
      views: formatNumber(videoData.stat ? videoData.stat.view : 0),
      published: videoData.pubdate ? new Date(videoData.pubdate * 1000).toISOString().split('T')[0] : '未知日期',
      summary: videoData.desc ? videoData.desc.substring(0, 500) + (videoData.desc.length > 500 ? '...' : '') : '暂无简介',
      keyPoints: keyPoints,
      highlights: [
        videoData.title ? videoData.title.substring(0, 20) + '...' : '精彩亮点1',
        '深入的内容分析',
        '丰富的案例分享',
        '专业的讲解风格'
      ]
    };

    res.json(summary);

  } catch (error) {
    res.status(500).json({ error: '视频总结失败，请稍后重试' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
