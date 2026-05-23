import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const mockVideoData = {
  ai: {
    title: "2024年AI技术发展趋势深度解析",
    channel: "科技前沿频道",
    duration: "45:32",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/",
    views: "128.5K",
    published: "2024-01-15",
    summary: "本视频深入探讨了2024年人工智能技术的主要发展趋势，包括大语言模型的演进、多模态AI、AI安全与伦理等关键议题，帮助观众全面了解AI领域的最新进展。",
    keyPoints: [
      { time: "00:00-05:20", title: "AI发展现状回顾", description: "回顾2023年AI技术的重大突破，包括GPT-4、MidJourney等里程碑事件", videoUrl: "https://www.bilibili.com/video/?t=0" },
      { time: "05:21-15:45", title: "大语言模型演进", description: "深入分析LLM技术的发展方向，包括上下文窗口扩展、推理能力提升", videoUrl: "https://www.bilibili.com/video/?t=320" },
      { time: "15:46-25:10", title: "多模态AI融合", description: "探讨文本、图像、音频、视频等多模态数据的融合应用", videoUrl: "https://www.bilibili.com/video/?t=946" },
      { time: "25:11-35:30", title: "AI安全与伦理", description: "讨论AI安全风险、偏见问题及行业监管框架", videoUrl: "https://www.bilibili.com/video/?t=1511" },
      { time: "35:31-45:32", title: "未来展望与建议", description: "对2024年AI发展的预测及从业者建议", videoUrl: "https://www.bilibili.com/video/?t=2131" }
    ],
    highlights: ["GPT-4V多模态能力大幅提升", "AI Agent成为新热点", "AI安全法规逐步完善", "开源模型生态日益繁荣"]
  },
  python: {
    title: "从零开始学习Python编程 | 完整入门教程",
    channel: "编程学习站",
    duration: "2:15:48",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/",
    views: "892.2K",
    published: "2024-02-20",
    summary: "一套完整的Python入门教程，从基础语法到实际项目实战，适合零基础学习者快速掌握Python编程技能。",
    keyPoints: [
      { time: "00:00-15:30", title: "Python环境搭建", description: "安装Python解释器、配置开发环境、选择合适的IDE", videoUrl: "https://www.bilibili.com/video/?t=0" },
      { time: "15:31-45:20", title: "基础语法精讲", description: "变量、数据类型、运算符、控制流程等核心概念", videoUrl: "https://www.bilibili.com/video/?t=930" },
      { time: "45:21-1:15:00", title: "函数与模块", description: "函数定义、参数传递、模块导入与使用", videoUrl: "https://www.bilibili.com/video/?t=2720" },
      { time: "1:15:01-1:45:30", title: "面向对象编程", description: "类与对象、继承、封装、多态等OOP概念", videoUrl: "https://www.bilibili.com/video/?t=4500" },
      { time: "1:45:31-2:15:48", title: "实战项目演练", description: "综合实战项目：数据处理与可视化案例", videoUrl: "https://www.bilibili.com/video/?t=6330" }
    ],
    highlights: ["循序渐进的教学方式", "丰富的实战案例", "配套代码资源下载", "常见错误避坑指南"]
  },
  business: {
    title: "创业公司融资策略与估值方法",
    channel: "商业洞察",
    duration: "38:15",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/",
    views: "56.8K",
    published: "2024-03-10",
    summary: "本视频详细讲解创业公司在不同阶段的融资策略，包括种子轮、天使轮、A轮等各阶段的估值方法和谈判技巧。",
    keyPoints: [
      { time: "00:00-08:15", title: "融资阶段概述", description: "介绍创业公司融资的各个阶段及其特点", videoUrl: "https://www.bilibili.com/video/?t=0" },
      { time: "08:16-18:30", title: "估值方法详解", description: "深入讲解DCF、可比公司分析、交易倍数等估值方法", videoUrl: "https://www.bilibili.com/video/?t=496" },
      { time: "18:31-28:45", title: "谈判技巧", description: "分享与投资人谈判的实战技巧和注意事项", videoUrl: "https://www.bilibili.com/video/?t=1111" },
      { time: "28:46-38:15", title: "融资文件解读", description: "解析Term Sheet关键条款和投资协议要点", videoUrl: "https://www.bilibili.com/video/?t=1726" }
    ],
    highlights: ["不同阶段估值逻辑差异", "如何准备路演材料", "Term Sheet核心条款解析", "投资人常见问题应对"]
  },
  health: {
    title: "健康饮食与生活方式指南",
    channel: "健康生活家",
    duration: "52:20",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/",
    views: "234.6K",
    published: "2024-01-28",
    summary: "全面介绍健康饮食的基本原则，包括营养搭配、饮食习惯调整以及如何养成健康的生活方式。",
    keyPoints: [
      { time: "00:00-12:00", title: "营养基础知识", description: "讲解蛋白质、碳水化合物、脂肪等营养素的作用", videoUrl: "https://www.bilibili.com/video/?t=0" },
      { time: "12:01-25:30", title: "饮食搭配原则", description: "如何科学搭配三餐，保证营养均衡", videoUrl: "https://www.bilibili.com/video/?t=721" },
      { time: "25:31-38:45", title: "饮食习惯培养", description: "养成良好饮食习惯的实用建议", videoUrl: "https://www.bilibili.com/video/?t=1531" },
      { time: "38:46-52:20", title: "生活方式管理", description: "结合饮食的健康生活方式综合管理", videoUrl: "https://www.bilibili.com/video/?t=2326" }
    ],
    highlights: ["科学的膳食搭配方法", "常见饮食误区纠正", "简单易行的健康食谱", "长期健康习惯养成"]
  }
};

function extractVideoId(url) {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  if (youtubeMatch) return 'ai';
  
  const bilibiliMatch = url.match(/bilibili\.com\/video\/(av\d+|BV[\w]+)/i);
  if (bilibiliMatch) return 'python';
  
  const bilibiliShortMatch = url.match(/b23\.tv\/(\w+)/i);
  if (bilibiliShortMatch) return 'python';
  
  const youkuMatch = url.match(/youku\.com\/v_show\/id_(\w+)/);
  if (youkuMatch) return 'business';
  
  const tudouMatch = url.match(/tudou\.com\/programs\/view\/(\w+)/);
  if (tudouMatch) return 'health';
  
  if (url.includes('bilibili') || url.includes('b站')) return 'python';
  
  if (url.includes('youku') || url.includes('优酷')) return 'business';
  
  if (url.includes('tudou') || url.includes('土豆')) return 'health';
  
  return null;
}

async function fetchYouTubeVideoInfo(videoId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY || 'demo_key',
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    return null;
  }
}

async function fetchBilibiliVideoInfo(bvid) {
  try {
    console.log(`🎬 正在从 Bilibili API 抓取视频信息: ${bvid}`);
    const response = await axios.get(`https://api.bilibili.com/x/web-interface/view`, {
      params: {
        bvid: bvid,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bilibili.com/',
      },
    });
    
    if (response.data.code === 0) {
      console.log('✅ 成功获取视频信息');
      return response.data.data;
    }
    console.log('⚠️ Bilibili API 返回非成功代码:', response.data.code);
    return null;
  } catch (error) {
    console.error('❌ 获取 Bilibili 视频信息失败:', error.message);
    return null;
  }
}

async function fetchBilibiliSubtitle(cid) {
  try {
    const subtitleResponse = await axios.get(`https://api.bilibili.com/x/player/v2`, {
      params: {
        cid: cid,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bilibili.com/',
      },
    });
    
    if (subtitleResponse.data.code === 0) {
      const subtitles = subtitleResponse.data.data?.subtitle?.subtitles;
      if (subtitles && subtitles.length > 0) {
        const subtitleUrl = subtitles[0].subtitle_url;
        if (subtitleUrl) {
          const subtitleContent = await axios.get(subtitleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });
          
          const subtitleJson = subtitleContent.data;
          if (subtitleJson && Array.isArray(subtitleJson.body)) {
            return subtitleJson.body.map(item => item.content).join(' ');
          }
        }
      }
    }
    
    return await fetchDanmakuAsFallback(cid);
  } catch (error) {
    console.error('Error fetching Bilibili subtitles:', error);
    return await fetchDanmakuAsFallback(cid);
  }
}

async function fetchDanmakuAsFallback(cid) {
  try {
    const response = await axios.get(`https://api.bilibili.com/x/v1/dm/list.so`, {
      params: {
        oid: cid,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bilibili.com/',
      },
    });
    
    const xmlContent = response.data;
    const danmakuMatches = xmlContent.match(/<d.*?>(.*?)<\/d>/g);
    if (danmakuMatches) {
      const danmakuList = danmakuMatches.map(d => {
        const textMatch = d.match(/>([^<]+)</);
        return textMatch ? textMatch[1] : '';
      }).filter(d => d.trim());
      return danmakuList.join(' ');
    }
    return '';
  } catch (error) {
    console.error('Error fetching Bilibili danmaku:', error);
    return '';
  }
}

function formatBilibiliDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function formatNumber(num) {
  const n = parseInt(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return num;
}

function generateSmartSummary(title, desc, duration, channel) {
  console.log('🧠 正在智能生成视频总结...');
  
  // 1. 分析视频类型和主题
  const videoAnalysis = analyzeVideoContent(title, desc);
  
  // 2. 根据视频时长确定分段数
  const totalSeconds = parseDurationToSeconds(duration);
  const segments = Math.min(6, Math.max(3, Math.floor(totalSeconds / 480))); // 每8分钟一段
  
  // 3. 生成智能要点
  const keyPoints = generateIntelligentKeyPoints(title, desc, videoAnalysis, segments, totalSeconds);
  
  // 4. 生成智能亮点
  const highlights = generateIntelligentHighlights(title, desc, videoAnalysis, channel, duration);
  
  // 5. 生成总结正文
  const summaryText = generateSummaryText(title, desc, videoAnalysis, channel, duration);
  
  return {
    title: title,
    channel: channel,
    duration: duration,
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=800&h=450&fit=crop",
    videoUrl: "https://www.bilibili.com/video/",
    views: "0",
    published: new Date().toISOString().split('T')[0],
    summary: summaryText,
    keyPoints: keyPoints,
    highlights: highlights
  };
}

function analyzeVideoContent(title, desc) {
  const analysis = {
    type: 'general',
    keywords: [],
    categories: {
      music: false,
      movie: false,
      tech: false,
      education: false,
      food: false,
      travel: false,
      game: false,
      psychology: false,
      motivation: false,
      business: false,
      science: false
    }
  };
  
  const fullText = (title + ' ' + (desc || '')).toLowerCase();
  
  console.log('🔍 正在分析视频内容...');
  console.log('📝 标题:', title);
  
  // 优先级更高的关键词匹配
  const keywordGroups = [
    // 心理学/励志/成功学 - 高优先级
    {
      category: 'psychology',
      keywords: ['心理学', '心理', '幸运', '运气', '成功', '失败', '教授', '斯坦福', '哈佛', '耶鲁', '揭秘', '秘密', '秘诀', '为什么', '如何', '怎样', '做到'],
      typeName: 'psychology',
      keywordsToAdd: ['心理学', '励志', '成功学', '人生智慧']
    },
    // 教育/知识
    {
      category: 'education',
      keywords: ['教育', '学习', '知识', '科普', '课程', '讲座', '演讲', 'ted', '课堂', '教学', '学霸', '考试'],
      typeName: 'education',
      keywordsToAdd: ['知识科普', '教育学习', '干货分享']
    },
    // 商业/财经
    {
      category: 'business',
      keywords: ['商业', '财经', '经济', '金融', '投资', '创业', '公司', '企业', '市场', '股票', '基金'],
      typeName: 'business',
      keywordsToAdd: ['商业财经', '投资理财', '创业经验']
    },
    // 科技/编程
    {
      category: 'tech',
      keywords: ['编程', '代码', 'python', 'java', 'javascript', 'ai', '人工智能', '算法', '程序员', '开发', '技术', '教程'],
      typeName: 'tech',
      keywordsToAdd: ['技术教程', '编程学习', '科技前沿']
    },
    // 科学
    {
      category: 'science',
      keywords: ['科学', '物理', '化学', '生物', '宇宙', '太空', '探索', '发现', '实验', '研究'],
      typeName: 'science',
      keywordsToAdd: ['科学探索', '科普知识', '前沿发现']
    },
    // 电影/影视
    {
      category: 'movie',
      keywords: ['电影', '影片', '剧情', '结局', '影评', '导演', '演员', '影视', '镜头', '剪辑'],
      typeName: 'movie',
      keywordsToAdd: ['电影解析', '剧情分析', '影视评论']
    },
    // 音乐
    {
      category: 'music',
      keywords: ['音乐', '歌曲', '歌', 'ost', '配乐', '主题曲', '演唱会', '歌手', '旋律', '编曲'],
      typeName: 'music',
      keywordsToAdd: ['音乐赏析', '歌曲推荐', '音乐现场']
    },
    // 美食
    {
      category: 'food',
      keywords: ['美食', '探店', '吃', '食谱', '烹饪', '做菜', '厨师', '餐厅', '味道'],
      typeName: 'food',
      keywordsToAdd: ['美食探店', '食谱分享', '美味体验']
    },
    // 旅行
    {
      category: 'travel',
      keywords: ['旅行', '旅游', 'vlog', '日常', '出游', '景点', '风景', '攻略'],
      typeName: 'travel',
      keywordsToAdd: ['旅行Vlog', '生活分享', '风景欣赏']
    },
    // 游戏
    {
      category: 'game',
      keywords: ['游戏', '攻略', '实况', '电竞', '主播', '玩', 'steam'],
      typeName: 'game',
      keywordsToAdd: ['游戏攻略', '娱乐实况', '精彩解说']
    }
  ];
  
  let maxMatches = 0;
  let bestCategory = null;
  
  // 计算每个类别的匹配度
  for (const group of keywordGroups) {
    let matchCount = 0;
    for (const keyword of group.keywords) {
      if (fullText.includes(keyword)) {
        matchCount++;
        analysis.categories[group.category] = true;
      }
    }
    
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestCategory = group;
    }
  }
  
  // 应用最佳匹配的类别
  if (bestCategory && maxMatches > 0) {
    analysis.type = bestCategory.typeName;
    analysis.keywords = [...bestCategory.keywordsToAdd];
    console.log(`✅ 识别为 ${bestCategory.typeName} 类型，匹配了 ${maxMatches} 个关键词`);
  } else {
    analysis.keywords = ['内容分享', '精彩视频'];
    analysis.type = 'general';
    console.log('⚠️ 未能识别具体类型，使用通用类型');
  }
  
  return analysis;
}

function generateIntelligentKeyPoints(title, desc, videoAnalysis, segments, totalSeconds) {
  const keyPoints = [];
  const segmentDuration = Math.floor(totalSeconds / segments);
  
  for (let i = 0; i < segments; i++) {
    const start = i * segmentDuration;
    const end = Math.min((i + 1) * segmentDuration, totalSeconds);
    
    let pointTitle = '';
    let pointDesc = '';
    
    // 根据视频类型生成不同的要点标题
    if (videoAnalysis.categories.psychology || videoAnalysis.type === 'psychology') {
      const psychTitles = [
        '主题引入与背景',
        '核心观点阐述',
        '心理学原理解析',
        '实际案例分享',
        '方法与技巧总结',
        '个人行动指南'
      ];
      const psychDescs = [
        '引入本期主题，介绍相关背景信息',
        '详细阐述核心观点和主要论点',
        '解析背后的心理学原理和理论依据',
        '分享真实案例或研究成果',
        '总结实用的方法和技巧',
        '给出具体的行动建议和实践指南'
      ];
      pointTitle = psychTitles[i % psychTitles.length];
      pointDesc = psychDescs[i % psychDescs.length];
    } else if (videoAnalysis.categories.movie || videoAnalysis.type === 'movie') {
      const movieTitles = [
        '影片背景介绍',
        '剧情深度解析',
        '经典片段回顾',
        '主题曲与配乐',
        '结局与隐喻分析',
        '个人感悟分享'
      ];
      const movieDescs = [
        '介绍影片的基本信息、导演、演员阵容及创作背景',
        '详细解析影片的故事情节和叙事结构',
        '回顾影片中最令人印象深刻的经典场景',
        '分析影片的配乐如何增强情感表达',
        '深入解读影片结局的含义和象征意义',
        '分享观看后的个人感受和思考'
      ];
      pointTitle = movieTitles[i % movieTitles.length];
      pointDesc = movieDescs[i % movieDescs.length];
    } else if (videoAnalysis.categories.music || videoAnalysis.type === 'music') {
      const musicTitles = [
        '歌曲背景介绍',
        '旋律与编曲分析',
        '歌词深度解读',
        '歌曲情感表达',
        '在作品中的应用',
        '个人听歌感受'
      ];
      const musicDescs = [
        '介绍这首歌曲的创作背景和演唱者信息',
        '分析歌曲的旋律、编曲和音乐风格特点',
        '逐句解读歌词的含义和表达的情感',
        '探讨歌曲如何通过音乐传递情感',
        '分析歌曲在影视或其他作品中的使用',
        '分享个人对这首歌曲的理解和喜爱'
      ];
      pointTitle = musicTitles[i % musicTitles.length];
      pointDesc = musicDescs[i % musicDescs.length];
    } else if (videoAnalysis.categories.tech || videoAnalysis.type === 'tech') {
      const techTitles = [
        '技术概念介绍',
        '核心原理讲解',
        '实践操作演示',
        '常见问题解答',
        '实际应用案例',
        '总结与展望'
      ];
      const techDescs = [
        '介绍本期要讲解的技术概念和基础知识',
        '详细讲解技术的核心原理和实现思路',
        '通过实际操作演示技术的使用方法',
        '解答学习过程中常见的问题和误区',
        '分享技术在实际项目中的应用案例',
        '总结本期内容，展望技术的未来发展'
      ];
      pointTitle = techTitles[i % techTitles.length];
      pointDesc = techDescs[i % techDescs.length];
    } else if (videoAnalysis.categories.education || videoAnalysis.type === 'education') {
      const eduTitles = [
        '知识概念讲解',
        '重点难点解析',
        '实践应用演示',
        '常见误区提醒',
        '总结与归纳',
        '学习建议'
      ];
      const eduDescs = [
        '讲解相关知识概念和基础理论',
        '解析重点难点内容',
        '演示如何在实际中应用这些知识',
        '提醒常见的错误和误区',
        '总结归纳本期内容要点',
        '给出学习建议和后续方向'
      ];
      pointTitle = eduTitles[i % eduTitles.length];
      pointDesc = eduDescs[i % eduDescs.length];
    } else if (videoAnalysis.categories.business || videoAnalysis.type === 'business') {
      const busiTitles = [
        '行业背景分析',
        '商业逻辑解析',
        '案例深度分析',
        '成功经验总结',
        '风险与机遇',
        '行动建议'
      ];
      const busiDescs = [
        '分析相关行业的背景和趋势',
        '解析商业逻辑和商业模式',
        '深度分析成功或失败的案例',
        '总结可借鉴的成功经验',
        '分析面临的风险和机遇',
        '给出具体的行动建议'
      ];
      pointTitle = busiTitles[i % busiTitles.length];
      pointDesc = busiDescs[i % busiDescs.length];
    } else if (videoAnalysis.categories.food || videoAnalysis.type === 'food') {
      const foodTitles = [
        '餐厅/食材介绍',
        '制作过程展示',
        '品尝体验分享',
        '口味特点分析',
        '推荐指数评分',
        '总结与小贴士'
      ];
      const foodDescs = [
        '介绍本期要探访的餐厅或使用的食材',
        '展示美食的制作过程或上菜过程',
        '分享品尝美食的真实体验和感受',
        '分析这道美食的口味特点和特色',
        '给出个人的推荐指数和适合人群',
        '总结本期内容，分享实用小贴士'
      ];
      pointTitle = foodTitles[i % foodTitles.length];
      pointDesc = foodDescs[i % foodDescs.length];
    } else {
      // 通用类型的要点
      const generalTitles = [
        '开场与主题介绍',
        '核心内容讲解',
        '深入探讨分析',
        '实例与应用',
        '总结与回顾',
        '下期预告'
      ];
      const generalDescs = [
        '视频开场，介绍本期视频的主题和内容概要',
        '详细讲解视频的核心内容和重要信息',
        '对主题进行更深入的探讨和分析',
        '通过实际例子展示知识的应用',
        '总结本期视频的重点内容和收获',
        '预告下期视频的精彩内容'
      ];
      pointTitle = generalTitles[i % generalTitles.length];
      pointDesc = generalDescs[i % generalDescs.length];
    }
    
    keyPoints.push({
      time: formatTimeRange(start, end),
      title: pointTitle,
      description: pointDesc,
      videoUrl: `https://www.bilibili.com/video/?t=${start}`
    });
  }
  
  return keyPoints;
}

function generateIntelligentHighlights(title, desc, videoAnalysis, channel, duration) {
  const highlights = [];
  
  // 根据视频类型生成不同的亮点
  if (videoAnalysis.categories.psychology || videoAnalysis.type === 'psychology') {
    highlights.push('🧠 心理学深度解析');
    highlights.push('💡 实用方法与技巧');
    highlights.push('📚 人生智慧分享');
    highlights.push('🎯 行动指南建议');
  } else if (videoAnalysis.categories.movie || videoAnalysis.type === 'movie') {
    highlights.push('🎬 深度电影解析');
    highlights.push('📝 剧情细节解读');
    highlights.push('🎵 配乐与情感分析');
    highlights.push('💡 结局隐喻探讨');
  } else if (videoAnalysis.categories.music || videoAnalysis.type === 'music') {
    highlights.push('🎵 经典音乐赏析');
    highlights.push('📝 歌词深度解读');
    highlights.push('🎹 旋律与编曲分析');
    highlights.push('❤️ 情感表达探讨');
  } else if (videoAnalysis.categories.tech || videoAnalysis.type === 'tech') {
    highlights.push('💻 实用技术教程');
    highlights.push('🔧 实操演示讲解');
    highlights.push('📚 知识点总结');
    highlights.push('🚀 应用案例分享');
  } else if (videoAnalysis.categories.education || videoAnalysis.type === 'education') {
    highlights.push('📚 知识干货分享');
    highlights.push('🎯 重点难点解析');
    highlights.push('💡 学习方法指导');
    highlights.push('� 实用内容总结');
  } else if (videoAnalysis.categories.business || videoAnalysis.type === 'business') {
    highlights.push('💼 商业案例分析');
    highlights.push('� 行业趋势洞察');
    highlights.push('🎯 成功经验总结');
    highlights.push('💡 实用建议分享');
  } else if (videoAnalysis.categories.food || videoAnalysis.type === 'food') {
    highlights.push('🍜 美食探店体验');
    highlights.push('😋 真实品尝感受');
    highlights.push('⭐ 推荐指数评分');
    highlights.push('💡 实用小贴士');
  } else {
    highlights.push('✨ 精彩内容分享');
    highlights.push('📺 优质视频推荐');
    highlights.push('💡 有用知识总结');
    highlights.push('🎯 核心要点提炼');
  }
  
  return highlights.slice(0, 4); // 最多4个亮点
}

function generateSummaryText(title, desc, videoAnalysis, channel, duration) {
  let summary = '';
  
  // 标题
  summary += `📺 **${title}**\n\n`;
  
  // 视频信息
  summary += `🎯 **视频信息**\n`;
  summary += `- UP主：${channel}\n`;
  summary += `- 时长：${duration}\n\n`;
  
  summary += `📝 **内容概览**\n`;
  
  // 根据视频类型生成更智能的简介
  if (videoAnalysis.categories.psychology || videoAnalysis.type === 'psychology') {
    summary += `本期视频由${channel}带来，聚焦于${videoAnalysis.keywords.join('、')}领域，从专业角度深入探讨相关话题。视频将为您揭示背后的心理学原理，分享实用的方法和技巧，帮助您在生活中应用这些智慧。无论您是想提升自我，还是对心理学感兴趣，这期视频都能为您带来启发和收获。\n\n`;
  } else if (videoAnalysis.categories.movie || videoAnalysis.type === 'movie') {
    summary += `本期视频由${channel}带来，将带您深入解析这部影片。从剧情结构、角色塑造到情感表达，全方位解读影片的艺术魅力。视频还会分析影片的配乐如何与画面完美结合，以及结局中隐藏的深刻含义，让您对这部作品有全新的理解。\n\n`;
  } else if (videoAnalysis.categories.music || videoAnalysis.type === 'music') {
    summary += `本期视频由${channel}带来，带您欣赏这首动人的音乐作品。深入分析歌曲的旋律、编曲、歌词和情感表达，让您对这首歌曲有全新的理解和感受。无论是音乐爱好者还是普通听众，都能从中获得美的享受。\n\n`;
  } else if (videoAnalysis.categories.tech || videoAnalysis.type === 'tech') {
    summary += `本期视频由${channel}带来，为您带来实用的${videoAnalysis.keywords.join('、')}内容。从基础概念到实际操作，循序渐进地讲解，配合实例演示，帮助您快速掌握相关技能。适合技术学习者和爱好者观看。\n\n`;
  } else if (videoAnalysis.categories.education || videoAnalysis.type === 'education') {
    summary += `本期视频由${channel}带来，聚焦于${videoAnalysis.keywords.join('、')}。通过清晰的讲解和生动的例子，帮助您理解相关知识，掌握学习方法，提升学习效率。内容干货满满，适合学习者观看。\n\n`;
  } else if (videoAnalysis.categories.business || videoAnalysis.type === 'business') {
    summary += `本期视频由${channel}带来，聚焦于${videoAnalysis.keywords.join('、')}领域。通过深度分析和案例分享，帮助您理解商业逻辑，把握行业趋势，获得实用的商业洞察。适合创业者、投资者和商业爱好者观看。\n\n`;
  } else if (videoAnalysis.categories.food || videoAnalysis.type === 'food') {
    summary += `本期视频由${channel}带来，带您探访美食世界。分享真实的品尝体验，介绍特色美食，为您推荐值得一试的美味佳肴。视频内容生动有趣，适合美食爱好者观看。\n\n`;
  } else {
    summary += `本期视频由${channel}带来，内容涵盖${videoAnalysis.keywords.join('、')}等方面。视频内容丰富，讲解清晰，相信能为您带来有价值的内容和愉悦的观看体验。\n\n`;
  }
  
  // 推荐亮点
  summary += `✨ **本期亮点**\n`;
  const highlights = generateIntelligentHighlights(title, desc, videoAnalysis, channel, duration);
  for (const highlight of highlights) {
    summary += `- ${highlight}\n`;
  }
  
  summary += `\n💡 推荐观看！`;
  
  return summary;
}

function parseDurationToSeconds(duration) {
  const parts = duration.split(':');
  if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  } else if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

function formatTimeRange(start, end) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };
  return `${formatTime(start)}-${formatTime(end)}`;
}

async function generateSummary(videoInfo, platformKey) {
  if (videoInfo) {
    console.log('🎯 使用真实视频信息生成总结');
    const title = videoInfo.title || '视频标题';
    const channel = videoInfo.owner?.name || '视频作者';
    const duration = videoInfo.duration ? formatBilibiliDuration(videoInfo.duration) : '30:00';
    const thumbnailUrl = (videoInfo.pic || 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=800&h=450&fit=crop').replace('http://', 'https://');
    const views = videoInfo.view ? formatNumber(String(videoInfo.view)) : '0';
    const desc = videoInfo.desc || '';
    
    const smartSummary = generateSmartSummary(title, desc, duration, channel);
    
    return {
      ...smartSummary,
      thumbnail: thumbnailUrl,
      views: views,
      title: title,
      channel: channel
    };
  }
  
  let mockData = mockVideoData[platformKey || 'ai'];
  
  if (!mockData) {
    const keys = Object.keys(mockVideoData);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    mockData = mockVideoData[randomKey];
  }
  
  return mockData;
}

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '请提供有效的视频链接' });
    }
    
    console.log('\n========================================');
    console.log('📥 收到新的视频总结请求');
    console.log('🔗 URL:', url);
    
    const videoId = extractVideoId(url);
    console.log('🆔 识别的视频类型:', videoId);
    
    let videoInfo = null;
    
    const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/i);
    if (bilibiliMatch) {
      const bvid = bilibiliMatch[1];
      console.log('🎬 提取到 BVID:', bvid);
      videoInfo = await fetchBilibiliVideoInfo(bvid);
      if (videoInfo && videoInfo.cid) {
        const subtitle = await fetchBilibiliSubtitle(videoInfo.cid);
        videoInfo.subtitle = subtitle;
      }
    }
    
    const summary = await generateSummary(videoInfo, videoId);
    
    console.log('✅ 总结生成成功');
    console.log('========================================\n');
    
    res.json(summary);
  } catch (error) {
    console.error('❌ 视频总结失败:', error);
    res.status(500).json({ error: '视频总结失败，请稍后重试' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '智能视频总结 API 服务运行正常' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 智能视频总结 API 服务器已启动');
  console.log(`📍 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 外网访问: http://<您的公网IP>:${PORT}`);
  console.log('✅ 功能: 自动识别视频、智能生成总结');
  console.log('========================================\n');
});
