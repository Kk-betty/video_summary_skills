
const http = require('http');

const PORT = 3001;

// 预定义的视频数据
const videoData = {
  'BV1uX9rBvEQn': {
    title: "【TSCN】中文字幕.Taylor新专辑创作的灵感来源和过程",
    channel: "TSCN字幕组",
    duration: "30:25",
    thumbnail: "https://i0.hdslb.com/bfs/archive/aeea377df0ca89e7336b48eac1e7f3bb9805319d.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/",
    views: "68,928",
    published: "2026-04-28",
    summary: "权威时尚媒体对150多位娱乐圈业内人士展开问卷调查，并邀请六位日本音乐评论家，共同评选出当今30位最杰出的美国在世乐坛创作人，Taylor入选该榜单。纪录片制作人金学圭亲自前往洛杉矶与她会面，深度挖掘她音乐创作的压力与心得。",
    keyPoints: [
      { time: "0:00-4:30", title: "开场介绍", description: "视频开头介绍和主题引入", videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/?t=0" },
      { time: "4:30-12:00", title: "创作历程", description: "Taylor分享自己的创作历程", videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/?t=270" },
      { time: "12:00-20:00", title: "热门单曲", description: "多首热门单曲背后的创作故事", videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/?t=720" },
      { time: "20:00-25:30", title: "人生经历", description: "事业巅峰之下的人生经历", videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/?t=1200" },
      { time: "25:30-30:25", title: "总结回顾", description: "视频总结和要点回顾", videoUrl: "https://www.bilibili.com/video/BV1uX9rBvEQn/?t=1530" }
    ],
    highlights: ["权威媒体评选", "深度访谈内容", "创作故事分享", "人生经历回顾"]
  },
  'BV1xx411c7mD': {
    title: "从零开始学习Python编程 | 完整入门教程",
    channel: "编程学习站",
    duration: "2:15:48",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/",
    views: "892,156",
    published: "2024-02-20",
    summary: "一套完整的Python入门教程，从基础语法到实际项目实战，适合零基础学习者快速掌握Python编程技能。",
    keyPoints: [
      { time: "0:00-15:30", title: "Python环境搭建", description: "安装Python解释器、配置开发环境", videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/?t=0" },
      { time: "15:30-45:20", title: "基础语法精讲", description: "变量、数据类型、运算符等核心概念", videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/?t=930" },
      { time: "45:20-1:15:00", title: "函数与模块", description: "函数定义、参数传递、模块导入", videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/?t=2720" },
      { time: "1:15:00-1:45:30", title: "面向对象编程", description: "类与对象、继承、封装、多态", videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/?t=4500" },
      { time: "1:45:30-2:15:48", title: "实战项目演练", description: "综合实战项目：数据处理与可视化", videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD/?t=6330" }
    ],
    highlights: ["循序渐进的教学方式", "丰富的实战案例", "配套代码资源下载", "常见错误避坑指南"]
  },
  'BV1euRQBBEvN': {
    title: "完整版来了！王清彬VS席瑞：《月亮与六便士》主题辩论赛",
    channel: "BledeFonty",
    duration: "10:25",
    thumbnail: "https://i1.hdslb.com/bfs/archive/b238b531be01b232335798c42fb61aaa695daa36.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/",
    views: "4,918",
    published: "2026-06-07",
    summary: "本视频是一场精彩的辩论赛，王清彬与席瑞围绕《月亮与六便士》展开激烈讨论，探讨理想与现实、艺术与生活的冲突。评论区也有很多精彩的观点分享。",
    keyPoints: [
      { time: "0:00-2:00", title: "开场介绍", description: "辩论赛开场，介绍辩题《月亮与六便士》背景", videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/?t=0" },
      { time: "2:00-4:30", title: "正方论点", description: "王清彬阐述支持理想追求的核心论点", videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/?t=120" },
      { time: "4:30-7:00", title: "反方论点", description: "席瑞阐述支持现实考量的核心论点", videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/?t=270" },
      { time: "7:00-8:45", title: "自由辩论", description: "双方激烈交锋，碰撞出思想的火花", videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/?t=420" },
      { time: "8:45-10:25", title: "总结陈词", description: "双方总结观点，升华主题", videoUrl: "https://www.bilibili.com/video/BV1euRQBBEvN/?t=525" }
    ],
    highlights: ["《月亮与六便士》主题", "精彩辩论赛", "理想与现实", "思想深度碰撞"]
  },
  'BV1wmofByE3k': {
    title: "经典访谈 | 史蒂夫·乔布斯：遗失的访谈",
    channel: "Web3太空之城",
    duration: "1:12:20",
    thumbnail: "https://i2.hdslb.com/bfs/archive/8def4a123efd515d561a4930386a188a8f9ab3ae.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/",
    views: "1,869",
    published: "2026-05-25",
    summary: "在这段1995年的访谈中，乔布斯回顾了其科技生涯的早期经历与核心经营哲学。他分享了少年时期在惠普工作的启示，以及通过早期技术探索学到的重要教训：即便是个人也能构建并掌握复杂的系统。乔布斯详细描述了他在施乐帕洛阿尔托研究中心亲眼目睹图形用户界面的震撼，这一关键时刻促使他确信所有未来的计算机都将以此方式运行，并直接推动了麦金塔电脑的诞生。",
    keyPoints: [
      { time: "0:00-15:00", title: "早年经历", description: "乔布斯分享早期在惠普工作的启示，少年时期探索技术的故事", videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/?t=0" },
      { time: "15:00-30:00", title: "施乐的启发", description: "在施乐研究中心目睹图形用户界面的震撼经历", videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/?t=900" },
      { time: "30:00-45:00", title: "团队与人才", description: "乔布斯强调组建由顶尖人才构成的团队的重要性", videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/?t=1800" },
      { time: "45:00-1:00:00", title: "产品哲学", description: "苹果产品设计理念与用户体验的核心思考", videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/?t=2700" },
      { time: "1:00:00-1:12:20", title: "未来展望", description: "乔布斯对计算机技术发展的前瞻性思考", videoUrl: "https://www.bilibili.com/video/BV1wmofByE3k/?t=3600" }
    ],
    highlights: ["史蒂夫·乔布斯访谈", "经典1995年", "图形用户界面", "产品哲学"]
  }
};

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
          res.end(JSON.stringify({ error: '无法从链接中提取视频ID' }));
          return;
        }

        const bvid = bvidMatch[1];
        console.log('Extracted BVID:', bvid);

        let result;
        
        if (videoData[bvid]) {
          console.log('Found in database');
          result = videoData[bvid];
        } else {
          console.log('Using default data');
          result = {
            title: "视频总结",
            channel: "视频作者",
            duration: "30:00",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
            videoUrl: `https://www.bilibili.com/video/${bvid}/`,
            views: "0",
            published: "2024-01-01",
            summary: "这是一个视频总结的示例。您可以查看视频的核心要点。",
            keyPoints: [
              { time: "0:00-4:30", title: "开场介绍", description: "视频开头介绍和主题引入", videoUrl: `https://www.bilibili.com/video/${bvid}/?t=0` },
              { time: "4:30-12:00", title: "核心内容", description: "视频核心内容讲解", videoUrl: `https://www.bilibili.com/video/${bvid}/?t=270` },
              { time: "12:00-20:00", title: "深入分析", description: "对主题的深入分析和探讨", videoUrl: `https://www.bilibili.com/video/${bvid}/?t=720` },
              { time: "20:00-25:30", title: "案例分享", description: "相关案例分享和实践经验", videoUrl: `https://www.bilibili.com/video/${bvid}/?t=1200` },
              { time: "25:30-30:00", title: "总结回顾", description: "视频总结和要点回顾", videoUrl: `https://www.bilibili.com/video/${bvid}/?t=1530` }
            ],
            highlights: ["精彩片段1", "精彩片段2", "精彩片段3", "精彩片段4"]
          };
        }

        console.log('Returning:', result.title);
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
  console.log('Ready!');
});
