
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const videoTemplates = {
  default: {
    title: "视频总结",
    channel: "视频作者",
    duration: "00:00",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
    views: "0",
    published: "2024-01-01",
    summary: "本视频总结正在生成中...",
    keyPoints: [
      {
        time: "00:00-05:00",
        title: "视频开头",
        description: "视频开头内容介绍",
        videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD?t=0"
      },
      {
        time: "05:00-15:00",
        title: "核心内容",
        description: "视频核心内容讲解",
        videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD?t=300"
      },
      {
        time: "15:00-25:00",
        title: "深入分析",
        description: "深入分析视频主题",
        videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD?t=900"
      },
      {
        time: "25:00-35:00",
        title: "案例分享",
        description: "相关案例分享",
        videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD?t=1500"
      },
      {
        time: "35:00-45:00",
        title: "总结回顾",
        description: "视频总结与回顾",
        videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD?t=2100"
      }
    ],
    highlights: [
      "精彩内容亮点1",
      "精彩内容亮点2",
      "精彩内容亮点3",
      "精彩内容亮点4"
    ]
  }
};

function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString();
  }
  return num;
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function fetchBilibiliInfo(bvid) {
  return new Promise((resolve) => {
    console.log('Fetching Bilibili info for:', bvid);
    
    const options = {
      hostname: 'api.bilibili.com',
      path: `/x/web-interface/view?bvid=${bvid}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bilibili.com/'
      },
      timeout: 15000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('API Response Code:', response.code);
          
          if (response && response.code === 0 && response.data) {
            console.log('Got video title:', response.data.title);
            resolve(response.data);
          } else {
            console.log('API returned error:', response.message);
            resolve(null);
          }
        } catch (error) {
          console.log('Failed to parse response:', error.message);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('Request error:', error.message);
      resolve(null);
    });
    
    req.on('timeout', () => {
      console.log('Request timeout');
      req.destroy();
      resolve(null);
    });
    
    req.setTimeout(15000);
    req.end();
  });
}

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    
    console.log('\n=== New Request ===');
    console.log('URL:', url);
    
    if (!url || typeof url !== 'string') {
      console.log('Error: No URL provided');
      return res.status(400).json({ error: '请提供有效的视频链接' });
    }
    
    let summary = JSON.parse(JSON.stringify(videoTemplates.default));
    let bvid = null;
    
    const bvidMatch = url.match(/(BV[0-9a-zA-Z]+)/i);
    if (bvidMatch) {
      bvid = bvidMatch[1].toUpperCase();
      console.log('BVID:', bvid);
    } else {
      console.log('Error: No BVID found');
      return res.status(400).json({ error: '无法从链接中提取视频ID' });
    }
    
    const videoData = await fetchBilibiliInfo(bvid);
    
    if (videoData) {
      console.log('Success! Using real video data');
      const videoUrl = `https://www.bilibili.com/video/${bvid}`;
      const durationSeconds = videoData.duration || 2700;
      
      summary = {
        ...videoTemplates.default,
        title: videoData.title,
        channel: videoData.owner ? videoData.owner.name : '未知作者',
        duration: formatDuration(durationSeconds),
        thumbnail: videoData.pic ? videoData.pic.replace('http://', 'https://') : videoTemplates.default.thumbnail,
        videoUrl: videoUrl,
        views: formatNumber(videoData.stat ? videoData.stat.view : 0),
        published: videoData.pubdate ? new Date(videoData.pubdate * 1000).toISOString().split('T')[0] : '未知日期',
        summary: videoData.desc ? videoData.desc.substring(0, 500) + (videoData.desc.length > 500 ? '...' : '') : '暂无简介',
        keyPoints: generateKeyPoints(durationSeconds, videoData.title, videoUrl)
      };
    } else {
      console.log('Using default template');
    }
    
    console.log('Returning:', summary.title);
    res.json(summary);
    
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: '视频总结失败，请稍后重试' });
  }
});

function generateKeyPoints(duration, title, videoUrl) {
  const points = [];
  const totalSeconds = typeof duration === 'number' ? duration : 2700;
  
  const segments = [
    { start: 0, end: Math.min(totalSeconds * 0.15, 300), title: '开场介绍', desc: '视频开头介绍和主题引入' },
    { start: Math.min(totalSeconds * 0.15, 300), end: Math.min(totalSeconds * 0.4, 600), title: '核心内容', desc: '视频核心观点和主要内容讲解' },
    { start: Math.min(totalSeconds * 0.4, 600), end: Math.min(totalSeconds * 0.65, 900), title: '深入分析', desc: '对主题的深入分析和探讨' },
    { start: Math.min(totalSeconds * 0.65, 900), end: Math.min(totalSeconds * 0.85, 1200), title: '案例分享', desc: '相关案例分享和实践经验' },
    { start: Math.min(totalSeconds * 0.85, 1200), end: totalSeconds, title: '总结回顾', desc: '视频总结和要点回顾' }
  ];
  
  segments.forEach((segment, idx) => {
    points.push({
      time: `${formatDuration(segment.start)}-${formatDuration(segment.end)}`,
      title: segment.title,
      description: segment.desc,
      videoUrl: `${videoUrl}?t=${Math.floor(segment.start)}`
    });
  });
  
  return points;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

console.log('Starting server...');
app.listen(PORT, () => {
  console.log('=====================================');
  console.log('Server running on http://localhost:' + PORT);
  console.log('Supports real Bilibili video info!');
  console.log('=====================================');
}).on('error', (err) => {
  console.error('Server error:', err);
});
