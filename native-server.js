
const http = require('http');
const https = require('https');

const PORT = 3001;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url === '/api/summarize' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const url = data.url;
        console.log('Received URL:', url);

        const bvidMatch = url.match(/(BV[0-9a-zA-Z]+)/i);
        if (!bvidMatch) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '无法提取视频ID' }));
          return;
        }

        const bvid = bvidMatch[1].toUpperCase();
        console.log('BVID:', bvid);

        fetchBilibili(bvid, (videoData) => {
          if (!videoData) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '无法获取视频信息' }));
            return;
          }

          console.log('Got title:', videoData.title);
          const duration = videoData.duration || 1800;

          const result = {
            title: videoData.title || '未知标题',
            channel: videoData.owner?.name || '未知作者',
            duration: formatDuration(duration),
            thumbnail: videoData.pic?.replace('http://', 'https://') || '',
            videoUrl: `https://www.bilibili.com/video/${bvid}`,
            views: formatNumber(videoData.stat?.view || 0),
            published: videoData.pubdate ? new Date(videoData.pubdate * 1000).toISOString().split('T')[0] : '未知日期',
            summary: videoData.desc ? videoData.desc.substring(0, 500) + (videoData.desc.length > 500 ? '...' : '') : '暂无简介',
            keyPoints: generateKeyPoints(duration, bvid),
            highlights: ['精彩亮点1', '精彩亮点2', '精彩亮点3', '精彩亮点4']
          };

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        });

      } catch (e) {
        console.error('Error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '服务器错误' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

function fetchBilibili(bvid, callback) {
  const options = {
    hostname: 'api.bilibili.com',
    path: `/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.bilibili.com/'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.code === 0 && result.data) {
          callback(result.data);
        } else {
          callback(null);
        }
      } catch (e) {
        callback(null);
      }
    });
  });

  req.on('error', () => callback(null));
  req.end();
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatNumber(num) {
  if (typeof num === 'number') return num.toLocaleString();
  return num;
}

function generateKeyPoints(duration, bvid) {
  const total = typeof duration === 'number' ? duration : 1800;
  const points = [];
  const segments = [
    { start: 0, end: Math.min(total * 0.15, 300), title: '开场介绍', desc: '视频开头介绍' },
    { start: Math.min(total * 0.15, 300), end: Math.min(total * 0.4, 600), title: '核心内容', desc: '视频核心观点' },
    { start: Math.min(total * 0.4, 600), end: Math.min(total * 0.65, 900), title: '深入分析', desc: '深入分析探讨' },
    { start: Math.min(total * 0.65, 900), end: Math.min(total * 0.85, 1200), title: '案例分享', desc: '案例分享' },
    { start: Math.min(total * 0.85, 1200), end: total, title: '总结回顾', desc: '总结回顾' }
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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
