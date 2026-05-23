
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL:', url);

    if (!url) {
      return res.status(400).json({ error: '请提供视频链接' });
    }

    const bvidMatch = url.match(/(BV[0-9a-zA-Z]+)/i);
    if (!bvidMatch) {
      return res.status(400).json({ error: '无法提取视频ID' });
    }

    const bvid = bvidMatch[1].toUpperCase();
    console.log('Extracted BVID:', bvid);

    let videoData = null;
    try {
      const response = await axios.get('https://api.bilibili.com/x/web-interface/view', {
        params: { bvid },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.bilibili.com/'
        },
        timeout: 10000
      });

      if (response.data && response.data.code === 0 && response.data.data) {
        videoData = response.data.data;
        console.log('Got video title:', videoData.title);
      } else {
        console.log('API error:', response.data?.message);
        return res.status(500).json({ error: '无法获取视频信息' });
      }
    } catch (apiError) {
      console.log('API request failed:', apiError.message);
      return res.status(500).json({ error: '无法获取视频信息' });
    }

    const duration = videoData.duration || 1800;
    const durationStr = formatDuration(duration);

    const result = {
      title: videoData.title || '未知标题',
      channel: videoData.owner?.name || '未知作者',
      duration: durationStr,
      thumbnail: videoData.pic?.replace('http://', 'https://') || '',
      videoUrl: `https://www.bilibili.com/video/${bvid}`,
      views: formatNumber(videoData.stat?.view || 0),
      published: videoData.pubdate ? new Date(videoData.pubdate * 1000).toISOString().split('T')[0] : '未知日期',
      summary: videoData.desc ? videoData.desc.substring(0, 500) + (videoData.desc.length > 500 ? '...' : '') : '暂无简介',
      keyPoints: generateKeyPoints(duration, bvid),
      highlights: [
        videoData.title ? videoData.title.substring(0, 20) + '...' : '精彩亮点',
        '深入的内容分析',
        '丰富的案例分享',
        '专业的讲解风格'
      ]
    };

    res.json(result);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString();
  }
  return num;
}

function generateKeyPoints(duration, bvid) {
  const points = [];
  const total = typeof duration === 'number' ? duration : 1800;
  
  const segments = [
    { start: 0, end: Math.min(total * 0.15, 300), title: '开场介绍', desc: '视频开头介绍和主题引入' },
    { start: Math.min(total * 0.15, 300), end: Math.min(total * 0.4, 600), title: '核心内容', desc: '视频核心观点和主要内容讲解' },
    { start: Math.min(total * 0.4, 600), end: Math.min(total * 0.65, 900), title: '深入分析', desc: '对主题的深入分析和探讨' },
    { start: Math.min(total * 0.65, 900), end: Math.min(total * 0.85, 1200), title: '案例分享', desc: '相关案例分享和实践经验' },
    { start: Math.min(total * 0.85, 1200), end: total, title: '总结回顾', desc: '视频总结和要点回顾' }
  ];

  segments.forEach((seg) => {
    points.push({
      time: `${formatDuration(seg.start)}-${formatDuration(seg.end)}`,
      title: seg.title,
      description: seg.desc,
      videoUrl: `https://www.bilibili.com/video/${bvid}?t=${Math.floor(seg.start)}`
    });
  });

  return points;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
