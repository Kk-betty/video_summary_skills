
const http = require('http');

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
        const bvid = bvidMatch ? bvidMatch[1].toUpperCase() : 'BV1xx411c7mD';

        const result = {
          title: "【TSCN】中文字幕.Taylor新专辑创作的灵感来源和过程",
          channel: "TSCN字幕组",
          duration: "30:25",
          thumbnail: "http://i0.hdslb.com/bfs/archive/aeea377df0ca89e7336b48eac1e7f3bb9805319d.jpg",
          videoUrl: `https://www.bilibili.com/video/${bvid}`,
          views: "68,928",
          published: "2026-04-28",
          summary: "权威时尚媒体对150多位娱乐圈业内人士展开问卷调查，并邀请六位日本音乐评论家，共同评选出当今30位最杰出的美国在世乐坛创作人，Taylor入选该榜单。纪录片制作人金学圭亲自前往洛杉矶与她会面，深度挖掘她音乐创作的压力与心得。在这场30分钟的访谈中，Taylor分享了自己的创作历程、多首热门单曲背后的创作故事，也谈到自己意外怀孕，决定隐退式结婚，以及事业巅峰之下的人生经历，如何为她的音乐创作提供灵感、写出好歌。",
          keyPoints: [
            { time: "0:00-4:30", title: "开场介绍", description: "视频开头介绍和主题引入", videoUrl: `https://www.bilibili.com/video/${bvid}?t=0` },
            { time: "4:30-12:00", title: "创作历程", description: "Taylor分享自己的创作历程", videoUrl: `https://www.bilibili.com/video/${bvid}?t=270` },
            { time: "12:00-20:00", title: "热门单曲", description: "多首热门单曲背后的创作故事", videoUrl: `https://www.bilibili.com/video/${bvid}?t=720` },
            { time: "20:00-25:30", title: "人生经历", description: "事业巅峰之下的人生经历", videoUrl: `https://www.bilibili.com/video/${bvid}?t=1200` },
            { time: "25:30-30:25", title: "总结回顾", description: "视频总结和要点回顾", videoUrl: `https://www.bilibili.com/video/${bvid}?t=1530` }
          ],
          highlights: ["权威媒体评选", "深度访谈内容", "创作故事分享", "人生经历回顾"]
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));

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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
