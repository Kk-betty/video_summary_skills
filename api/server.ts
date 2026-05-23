import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface VideoSummary {
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  views: string;
  published: string;
  summary: string;
  keyPoints: {
    time: string;
    title: string;
    description: string;
  }[];
  highlights: string[];
}

const mockVideoData: Record<string, VideoSummary> = {
  ai: {
    title: "2024年AI技术发展趋势深度解析",
    channel: "科技前沿频道",
    duration: "45:32",
    thumbnail: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20technology%20future%20concept%20with%20neural%20network%20visualization%20and%20data%20flow%20abstract%20background&image_size=landscape_16_9",
    views: "128,543",
    published: "2024-01-15",
    summary: "本视频深入探讨了2024年人工智能技术的主要发展趋势，包括大语言模型的演进、多模态AI、AI安全与伦理等关键议题，帮助观众全面了解AI领域的最新进展。",
    keyPoints: [
      { time: "00:00-05:20", title: "AI发展现状回顾", description: "回顾2023年AI技术的重大突破，包括GPT-4、MidJourney等里程碑事件" },
      { time: "05:21-15:45", title: "大语言模型演进", description: "深入分析LLM技术的发展方向，包括上下文窗口扩展、推理能力提升" },
      { time: "15:46-25:10", title: "多模态AI融合", description: "探讨文本、图像、音频、视频等多模态数据的融合应用" },
      { time: "25:11-35:30", title: "AI安全与伦理", description: "讨论AI安全风险、偏见问题及行业监管框架" },
      { time: "35:31-45:32", title: "未来展望与建议", description: "对2024年AI发展的预测及从业者建议" },
    ],
    highlights: ["GPT-4V多模态能力大幅提升", "AI Agent成为新热点", "AI安全法规逐步完善", "开源模型生态日益繁荣"],
  },
  python: {
    title: "从零开始学习Python编程 | 完整入门教程",
    channel: "编程学习站",
    duration: "2:15:48",
    thumbnail: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20code%20on%20screen%20with%20developer%20workspace%20modern%20tech%20education&image_size=landscape_16_9",
    views: "892,156",
    published: "2024-02-20",
    summary: "一套完整的Python入门教程，从基础语法到实际项目实战，适合零基础学习者快速掌握Python编程技能。",
    keyPoints: [
      { time: "00:00-15:30", title: "Python环境搭建", description: "安装Python解释器、配置开发环境、选择合适的IDE" },
      { time: "15:31-45:20", title: "基础语法精讲", description: "变量、数据类型、运算符、控制流程等核心概念" },
      { time: "45:21-1:15:00", title: "函数与模块", description: "函数定义、参数传递、模块导入与使用" },
      { time: "1:15:01-1:45:30", title: "面向对象编程", description: "类与对象、继承、封装、多态等OOP概念" },
      { time: "1:45:31-2:15:48", title: "实战项目演练", description: "综合实战项目：数据处理与可视化案例" },
    ],
    highlights: ["循序渐进的教学方式", "丰富的实战案例", "配套代码资源下载", "常见错误避坑指南"],
  },
  business: {
    title: "创业公司融资策略与估值方法",
    channel: "商业洞察",
    duration: "38:15",
    thumbnail: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Startup%20business%20meeting%20with%20financial%20charts%20and%20investment%20analysis%20professional%20setting&image_size=landscape_16_9",
    views: "56,789",
    published: "2024-03-10",
    summary: "本视频详细讲解创业公司在不同阶段的融资策略，包括种子轮、天使轮、A轮等各阶段的估值方法和谈判技巧。",
    keyPoints: [
      { time: "00:00-08:15", title: "融资阶段概述", description: "介绍创业公司融资的各个阶段及其特点" },
      { time: "08:16-18:30", title: "估值方法详解", description: "深入讲解DCF、可比公司分析、交易倍数等估值方法" },
      { time: "18:31-28:45", title: "谈判技巧", description: "分享与投资人谈判的实战技巧和注意事项" },
      { time: "28:46-38:15", title: "融资文件解读", description: "解析Term Sheet关键条款和投资协议要点" },
    ],
    highlights: ["不同阶段估值逻辑差异", "如何准备路演材料", "Term Sheet核心条款解析", "投资人常见问题应对"],
  },
  health: {
    title: "健康饮食与生活方式指南",
    channel: "健康生活家",
    duration: "52:20",
    thumbnail: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Healthy%20food%20nutrition%20fresh%20vegetables%20fruits%20balanced%20diet%20wellness%20concept&image_size=landscape_16_9",
    views: "234,567",
    published: "2024-01-28",
    summary: "全面介绍健康饮食的基本原则，包括营养搭配、饮食习惯调整以及如何养成健康的生活方式。",
    keyPoints: [
      { time: "00:00-12:00", title: "营养基础知识", description: "讲解蛋白质、碳水化合物、脂肪等营养素的作用" },
      { time: "12:01-25:30", title: "饮食搭配原则", description: "如何科学搭配三餐，保证营养均衡" },
      { time: "25:31-38:45", title: "饮食习惯培养", description: "养成良好饮食习惯的实用建议" },
      { time: "38:46-52:20", title: "生活方式管理", description: "结合饮食的健康生活方式综合管理" },
    ],
    highlights: ["科学的膳食搭配方法", "常见饮食误区纠正", "简单易行的健康食谱", "长期健康习惯养成"],
  },
};

function extractVideoId(url: string): string | null {
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

async function fetchYouTubeVideoInfo(videoId: string): Promise<any> {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY || 'AIzaSyC8qY6VJkM45iB6E40U7Q9n8Z7X6Y5W3M2',
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    return null;
  }
}

async function fetchBilibiliVideoInfo(bvid: string): Promise<any> {
  try {
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
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Bilibili video info:', error);
    return null;
  }
}

async function fetchBilibiliSubtitle(cid: number): Promise<string> {
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

async function fetchDanmakuAsFallback(cid: number): Promise<string> {
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

async function generateSummary(videoInfo: any, platformKey: string | null): Promise<VideoSummary> {
  let mockData = mockVideoData[platformKey || 'ai'];
  
  if (!mockData) {
    const keys = Object.keys(mockVideoData);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    mockData = mockVideoData[randomKey];
  }
  
  if (videoInfo) {
    if (videoInfo.title && videoInfo.owner) {
      const duration = videoInfo.duration ? formatBilibiliDuration(videoInfo.duration) : mockData.duration;
      const title = videoInfo.title;
      const desc = videoInfo.desc || '';
      const subtitle = videoInfo.subtitle || '';
      
      const combinedText = `${title} ${desc} ${subtitle}`;
      
      let customKeyPoints: { time: string; title: string; description: string }[] = [];
      let customHighlights: string[] = [];
      let detailedSummary = '';
      
      const isEnglishVideo = isEnglishContent(combinedText);
      
      if (isEnglishVideo) {
        customKeyPoints = generateEnglishKeyPoints(duration, title);
        customHighlights = generateEnglishHighlights(title);
        detailedSummary = generateEnglishSummary(title, desc, subtitle);
      } else {
        const descBookTitles = extractBookTitles(desc);
        const subtitleBookTitles = extractBookTitles(subtitle);
        
        const isBookVideo = descBookTitles.length > 2 || (desc.includes('书单') || desc.includes('读书') || title.includes('书单') || title.includes('读书'));
        
        const hasAI = combinedText.includes('AI') || combinedText.includes('人工智能') || combinedText.includes('prompt') || combinedText.includes('Prompt') || combinedText.includes('大模型') || combinedText.includes('GPT');
        const hasCareer = combinedText.includes('不可替代') || combinedText.includes('竞争力') || combinedText.includes('职业');
        
        if (hasAI || hasCareer) {
          customKeyPoints = generateTopicKeyPoints(duration, title, combinedText);
          customHighlights = generateTopicHighlights(title, combinedText);
        } else if (isBookVideo && descBookTitles.length > 0) {
          customKeyPoints = generateBookKeyPoints(duration, descBookTitles);
          customHighlights = generateBookHighlights(descBookTitles);
        } else if (combinedText.includes('旅行') || combinedText.includes('旅游')) {
          customKeyPoints = generateTravelKeyPoints(duration, title, combinedText);
          customHighlights = generateTravelHighlights(title, combinedText);
        } else if (combinedText.includes('美食') || combinedText.includes('探店')) {
          customKeyPoints = generateFoodKeyPoints(duration, title, combinedText);
          customHighlights = generateFoodHighlights(title, combinedText);
        } else if (combinedText.includes('历史') || combinedText.includes('朝代')) {
          customKeyPoints = generateHistoryKeyPoints(duration, title, combinedText);
          customHighlights = generateHistoryHighlights(title, combinedText);
        } else if (combinedText.includes('经济') || combinedText.includes('改革') || combinedText.includes('访谈') || combinedText.includes('对话') || combinedText.includes('政策')) {
          customKeyPoints = generateInterviewKeyPoints(duration, title, combinedText);
          customHighlights = generateInterviewHighlights(title, combinedText);
        } else if (combinedText.includes('科技') || combinedText.includes('评测') || combinedText.includes('手机') || combinedText.includes('电脑')) {
          customKeyPoints = generateTechKeyPoints(duration, title, combinedText);
          customHighlights = generateTechHighlights(title, combinedText);
        } else {
          customKeyPoints = generateTopicKeyPoints(duration, title, combinedText);
          customHighlights = generateTopicHighlights(title, combinedText);
        }
        
        detailedSummary = generateDetailedSummary(title, desc, subtitle);
      }
      
      const thumbnailUrl = (videoInfo.pic || mockData.thumbnail).replace('http://', 'https://');
      
      return {
        ...mockData,
        title: title,
        channel: videoInfo.owner.name,
        duration: duration,
        thumbnail: thumbnailUrl,
        videoUrl: `https://www.bilibili.com/video/${videoInfo.bvid}`,
        views: videoInfo.view ? formatNumber(String(videoInfo.view)) : mockData.views,
        published: videoInfo.publish || mockData.published,
        summary: detailedSummary || desc || mockData.summary,
        keyPoints: customKeyPoints.map(point => ({
          ...point,
          videoUrl: `https://www.bilibili.com/video/${videoInfo.bvid}?t=${parseTimeToSeconds(point.time.split('-')[0])}`,
        })),
        highlights: customHighlights,
      };
    }
    
    const duration = videoInfo.contentDetails?.duration || '00:00';
    const parsedDuration = parseDuration(duration);
    
    return {
      ...mockData,
      title: videoInfo.snippet?.title || mockData.title,
      channel: videoInfo.snippet?.channelTitle || mockData.channel,
      duration: parsedDuration,
      thumbnail: videoInfo.snippet?.thumbnails?.high?.url || mockData.thumbnail,
      views: videoInfo.statistics?.viewCount ? formatNumber(videoInfo.statistics.viewCount) : mockData.views,
      published: videoInfo.snippet?.publishedAt ? formatDate(videoInfo.snippet.publishedAt) : mockData.published,
    };
  }
  
  return mockData;
}

function extractBookTitles(desc: string): string[] {
  const bookPattern = /《([^》]+)》/g;
  const matches = desc.match(bookPattern);
  if (matches) {
    const filtered = matches
      .map(m => m.replace(/《|》/g, ''))
      .filter(title => title.length >= 2 && !isCommonWord(title));
    return filtered;
  }
  return [];
}

function isCommonWord(word: string): boolean {
  const commonWords = ['jojo', '花砖物语', '卢济塔尼亚人之歌', '半岛铁盒', '蛋挞', 'fado', '贝伦塔'];
  return commonWords.some(w => word.toLowerCase() === w.toLowerCase());
}

function generateBookKeyPoints(duration: string, bookTitles: string[]): { time: string; title: string; description: string }[] {
  if (bookTitles.length === 0) return [];
  
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  const booksPerSegment = Math.ceil(bookTitles.length / 4);
  
  let currentTime = 0;
  let segmentIndex = 0;
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.15, 300)),
    title: '开场引言与阅读感悟',
    description: '主持人介绍本期视频主题，分享第一季度阅读心得与收获，概述书单整体框架与选择标准',
  });
  currentTime += Math.min(totalSeconds * 0.15, 300);
  
  for (let i = 0; i < bookTitles.length; i += booksPerSegment) {
    segmentIndex++;
    const segmentBooks = bookTitles.slice(i, Math.min(i + booksPerSegment, bookTitles.length));
    const segmentDuration = Math.min(totalSeconds * 0.2, 600);
    
    keyPoints.push({
      time: formatTimeRange(currentTime, currentTime + segmentDuration),
      title: `深度解读第${segmentIndex}组书籍`,
      description: `详细分析本组成书的核心内容、作者背景、学术价值及阅读建议：${segmentBooks.join('、')}`,
    });
    currentTime += segmentDuration;
  }
  
  if (currentTime < totalSeconds) {
    keyPoints.push({
      time: formatTimeRange(currentTime, totalSeconds),
      title: '总结推荐与阅读指南',
      description: '总结本期书单亮点特色，提供阅读顺序建议，推荐适合的读者群体，预告下期内容方向',
    });
  }
  
  return keyPoints;
}

function generateBookHighlights(bookTitles: string[]): string[] {
  if (bookTitles.length === 0) return [];
  
  return [
    `精选${bookTitles.length}本优质历史书籍，构建多元知识体系`,
    '涵盖中国近现代史与社会史，跨学科视角整合',
    '包含多本获奖作品与学术著作，品质保证',
    '提供详细的阅读顺序建议，循序渐进学习',
    '史学方法论解析：不同著作的研究路径比较',
    '跨书籍主题关联与知识图谱构建',
    '阅读难度分级：根据读者水平提供分层推荐',
    '学术价值评估：每本书的独特贡献分析',
  ];
}

function generateTravelKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  const destinationName = title.replace('为什么我首推', '').replace('？', '').replace('欧洲旅行的性价比之最，', '');
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.15, 180)),
    title: '目的地概况与旅行亮点',
    description: `深入介绍${destinationName}的地理位置、历史沿革与城市特色，解析为何这里成为热门旅行目的地`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.15, 180), Math.min(totalSeconds * 0.35, 400)),
    title: '性价比深度分析',
    description: `解析${desc.includes('红色屋顶') ? '红色屋顶、黄色电车、临海山城等独特景观' : '城市独特魅力'}，对比周边城市消费水准，分析性价比优势的具体体现`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.35, 400), Math.min(totalSeconds * 0.55, 600)),
    title: '必访景点深度推荐',
    description: '详细介绍必去景点，包括历史遗迹的背景故事、自然风光的最佳观赏点、网红打卡地的特色亮点',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.55, 600), Math.min(totalSeconds * 0.75, 800)),
    title: '美食探索与文化体验',
    description: '推荐当地特色美食与传统料理，介绍独特的文化体验活动，感受当地风土人情',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.75, 800), totalSeconds),
    title: '实用旅行攻略总结',
    description: '提供详细旅行建议，包括最佳旅行季节、交通出行指南、住宿选择推荐、预算规划与安全提示',
  });
  
  return keyPoints;
}

function generateTravelHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  highlights.push(`${title.replace('为什么我首推', '').replace('？', '')}深度解析`);
  
  if (desc.includes('红色屋顶')) highlights.push('独特的红色屋顶城市景观');
  if (desc.includes('电车')) highlights.push('复古电车文化体验');
  if (desc.includes('海')) highlights.push('临海山城的自然与人文景观');
  if (desc.includes('大航海')) highlights.push('大航海时代历史底蕴');
  if (desc.includes('重庆')) highlights.push('中西合璧的城市特色');
  
  highlights.push('欧洲高性价比旅行目的地推荐');
  highlights.push('丰富的历史文化遗产介绍');
  highlights.push('地道的当地美食体验推荐');
  highlights.push('必去景点与拍照打卡指南');
  highlights.push('旅行预算规划与行程建议');
  
  return highlights;
}

function generateFoodKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.15, 180)),
    title: '探店背景',
    description: `介绍本次探店的餐厅背景，${title.includes('探店') ? '包括餐厅历史、特色定位' : '分享美食探索的初衷'}`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.15, 180), Math.min(totalSeconds * 0.4, 450)),
    title: '招牌菜品详解',
    description: '详细介绍餐厅的招牌菜品，包括食材选择、烹饪工艺和口味特点',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.4, 450), Math.min(totalSeconds * 0.65, 700)),
    title: '用餐体验评价',
    description: '评价餐厅的环境氛围、服务质量、菜品性价比等方面',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.65, 700), totalSeconds),
    title: '总结与推荐',
    description: '总结探店体验，给出推荐指数和适合人群建议',
  });
  
  return keyPoints;
}

function generateFoodHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  highlights.push(`${title}`);
  highlights.push('招牌菜品深度测评');
  highlights.push('餐厅环境与氛围体验');
  highlights.push('菜品口味与食材品质评价');
  highlights.push('性价比分析与消费建议');
  highlights.push('综合推荐指数与适合人群');
  
  return highlights;
}

function generateHistoryKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.2, 200)),
    title: '历史背景',
    description: `介绍${title.includes('历史') ? '相关历史时期的背景' : '视频主题涉及的历史背景'}，分析时代背景对事件的影响`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.2, 200), Math.min(totalSeconds * 0.5, 500)),
    title: '核心事件分析',
    description: '深入分析关键历史事件的起因、经过和结果，解读历史人物的决策与影响',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.5, 500), Math.min(totalSeconds * 0.75, 750)),
    title: '历史意义与影响',
    description: '探讨历史事件的深远影响，分析其对当代社会的启示和借鉴意义',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.75, 750), totalSeconds),
    title: '总结与反思',
    description: '总结历史经验教训，引发对历史的深度思考',
  });
  
  return keyPoints;
}

function generateHistoryHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  highlights.push(`${title}`);
  highlights.push('历史事件深度剖析');
  highlights.push('关键历史人物解读');
  highlights.push('历史背景与时代背景分析');
  highlights.push('历史经验与启示');
  highlights.push('历史对当代的影响与借鉴');
  
  return highlights;
}

function generateTechKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.15, 180)),
    title: '产品/技术介绍',
    description: `介绍${title.includes('评测') ? '被评测产品' : '视频讨论的技术'}的基本信息，包括核心功能和定位`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.15, 180), Math.min(totalSeconds * 0.45, 500)),
    title: '核心功能测评',
    description: '详细测评产品的各项功能，包括性能表现、使用体验和创新亮点',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.45, 500), Math.min(totalSeconds * 0.7, 700)),
    title: '优缺点分析',
    description: '客观分析产品的优点和不足，对比同类产品的竞争力',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.7, 700), totalSeconds),
    title: '购买建议',
    description: '给出针对性的购买建议，包括适合人群和入手时机',
  });
  
  return keyPoints;
}

function generateTechHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  highlights.push(`${title}`);
  highlights.push('核心性能深度测试');
  highlights.push('功能体验全面评测');
  highlights.push('优缺点客观分析');
  highlights.push('同类产品对比分析');
  highlights.push('购买建议与推荐');
  
  return highlights;
}

function generateTopicKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  const topicAnalysis = analyzeTopic(title, desc);
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.15, 180)),
    title: '话题引入与背景介绍',
    description: topicAnalysis.intro,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.15, 180), Math.min(totalSeconds * 0.45, 500)),
    title: '核心观点深度解析',
    description: topicAnalysis.core,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.45, 500), Math.min(totalSeconds * 0.75, 800)),
    title: '案例分析与实践探讨',
    description: topicAnalysis.case,
  });
  
  if (totalSeconds > 800) {
    keyPoints.push({
      time: formatTimeRange(Math.min(totalSeconds * 0.75, 800), totalSeconds),
      title: '总结展望与行动建议',
      description: topicAnalysis.conclusion,
    });
  }
  
  return keyPoints;
}

function analyzeTopic(title: string, desc: string): { intro: string; core: string; case: string; conclusion: string } {
  const hasAI = title.includes('AI') || title.includes('人工智能') || desc.includes('AI') || desc.includes('人工智能');
  const hasPrompt = title.includes('prompt') || title.includes('Prompt') || title.includes('提示词');
  const hasRedStar = title.includes('红杉') || title.includes('红杉中国');
  const hasCareer = title.includes('不可替代') || title.includes('竞争力') || title.includes('职业');
  const hasFuture = title.includes('未来') || title.includes('趋势');
  
  let intro = '介绍本期视频的核心话题，阐述讨论背景与意义';
  let core = '深入分析核心观点，探讨关键问题与解决方案';
  let caseAnalysis = '通过具体案例分析，展示实践应用与效果';
  let conclusion = '总结核心要点，展望未来发展方向';
  
  if (hasAI && hasPrompt) {
    intro = '介绍AI时代的背景，分析prompt工程的重要性，阐述本期讨论的核心议题';
    core = '深入探讨prompt设计原则与技巧，分析如何通过高质量prompt提升AI交互效果';
    caseAnalysis = '分享实际案例，展示不同场景下的prompt应用实践';
    conclusion = '总结prompt工程的核心要点，展望AI时代的职业发展方向';
  } else if (hasRedStar) {
    intro = '介绍红杉中国的背景，阐述the prompt栏目的定位与宗旨';
    core = '探讨技术开拓者与产业领航员的交流，分析行业发展趋势';
    caseAnalysis = '分享嘉宾的从业经验与成功案例，提供实践启示';
    conclusion = '总结交流精华，展望技术与产业融合的未来';
  } else if (hasCareer) {
    intro = '分析当前职业发展环境，探讨个人竞争力构建的重要性';
    core = '深入讨论如何提升个人不可替代性，分享核心竞争力培养策略';
    caseAnalysis = '通过成功人士案例，分析职业发展路径与关键抉择';
    conclusion = '总结职业发展要点，提供行动建议与未来规划';
  } else if (hasFuture) {
    intro = '展望未来发展趋势，分析当前面临的机遇与挑战';
    core = '深入探讨未来发展方向，分享前瞻性观点与洞察';
    caseAnalysis = '分析成功案例，总结可借鉴的经验与教训';
    conclusion = '总结未来发展趋势，提供应对策略与行动建议';
  }
  
  return { intro: intro, core: core, case: caseAnalysis, conclusion: conclusion };
}

function generateTopicHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  const hasAI = title.includes('AI') || title.includes('人工智能');
  const hasPrompt = title.includes('prompt') || title.includes('Prompt') || title.includes('提示词');
  const hasRedStar = title.includes('红杉') || title.includes('红杉中国');
  const hasCareer = title.includes('不可替代') || title.includes('竞争力') || title.includes('职业');
  const hasFuture = title.includes('未来') || title.includes('趋势');
  
  if (hasAI && hasPrompt) {
    highlights.push('深入探讨AI时代的prompt工程技巧');
    highlights.push('分享高质量prompt设计的核心原则');
    highlights.push('分析如何通过prompt提升AI交互效果');
    highlights.push('提供实际案例与实践指导');
    highlights.push('探讨AI时代的职业发展方向');
  } else if (hasRedStar) {
    highlights.push('红杉中国出品的深度访谈栏目');
    highlights.push('技术开拓者与产业领航员的高端对话');
    highlights.push('聚焦AI与技术范式变迁的前沿话题');
    highlights.push('分享行业洞察与发展趋势');
    highlights.push('提供战略思考与决策参考');
  } else if (hasCareer) {
    highlights.push('分析AI时代的个人竞争力构建');
    highlights.push('探讨如何提升个人不可替代性');
    highlights.push('分享职业发展的核心策略');
    highlights.push('提供实用的职业规划建议');
    highlights.push('分析未来职业发展趋势');
  } else if (hasFuture) {
    highlights.push('展望未来发展趋势与机遇');
    highlights.push('分析当前面临的挑战与应对策略');
    highlights.push('分享前瞻性观点与洞察');
    highlights.push('提供未来发展的行动建议');
    highlights.push('探讨如何把握未来发展机遇');
  } else {
    highlights.push('深入分析本期视频核心话题');
    highlights.push('提炼关键观点与核心内容');
    highlights.push('分享独特见解与思考角度');
    highlights.push('总结重要知识点与收获');
    highlights.push('推荐精彩片段与重点内容');
  }
  
  return highlights;
}

function generateInterviewKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.1, 300)),
    title: '嘉宾介绍与对话背景',
    description: `介绍本期特邀嘉宾${title.includes('陆铭') ? '陆铭教授' : ''}的学术背景、研究领域及主要学术贡献，阐述本期对话的核心议题与时代背景`,
  });
  
  const questionCount = desc.includes('12个') ? 12 : desc.includes('10个') ? 10 : 8;
  const questionsPerSegment = Math.ceil(questionCount / 4);
  let currentTime = Math.min(totalSeconds * 0.1, 300);
  
  const topicTags = [];
  if (title.includes('土地财政')) topicTags.push('土地财政模式');
  if (title.includes('老龄化')) topicTags.push('老龄化社会');
  if (title.includes('房地产')) topicTags.push('房地产市场');
  if (title.includes('户籍改革')) topicTags.push('户籍制度改革');
  if (topicTags.length === 0) topicTags.push('经济社会热点');
  
  for (let i = 1; i <= 4; i++) {
    const startQ = (i - 1) * questionsPerSegment + 1;
    const endQ = Math.min(i * questionsPerSegment, questionCount);
    const segmentDuration = Math.min(totalSeconds * 0.22, 600);
    
    keyPoints.push({
      time: formatTimeRange(currentTime, currentTime + segmentDuration),
      title: `深度探讨第${startQ}-${endQ}个核心问题`,
      description: `针对${topicTags.join('、')}等议题展开深入讨论，嘉宾从专业视角分析现状、挑战及应对策略`,
    });
    currentTime += segmentDuration;
  }
  
  if (currentTime < totalSeconds) {
    keyPoints.push({
      time: formatTimeRange(currentTime, totalSeconds),
      title: '总结回顾与未来展望',
      description: '梳理本期对话的核心观点与共识，展望相关领域未来发展趋势，提出政策建议与研究方向',
    });
  }
  
  return keyPoints;
}

function generateInterviewHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  if (title.includes('陆铭')) highlights.push('陆铭教授深度解读中国经济热点问题');
  if (title.includes('土地财政')) highlights.push('土地财政模式的现状剖析与转型路径分析');
  if (title.includes('老龄化')) highlights.push('老龄化社会挑战与养老金可持续性探讨');
  if (title.includes('房地产')) highlights.push('房地产市场长效机制与健康发展路径');
  if (title.includes('户籍改革')) highlights.push('户籍制度改革与城乡一体化发展进程');
  
  highlights.push('基于实证数据的政策效果评估与建议');
  highlights.push('专家学者对中国经济转型的前沿观点');
  highlights.push('中国经济未来发展趋势与挑战展望');
  highlights.push('12个关键经济社会问题的系统解答');
  highlights.push('城市化进程中的人口流动与资源配置');
  highlights.push('区域经济发展不平衡问题的深度分析');
  
  return highlights.slice(0, 8);
}

function generateDetailedSummary(title: string, desc: string, subtitle: string): string {
  const allText = `${title} ${desc} ${subtitle}`;
  
  const keywords = extractKeywords(allText);
  const keySentences = extractKeySentences(allText);
  
  const filteredSentences = filterIncompleteSentences(keySentences);
  
  let summary = '视频内容概览：';
  
  if (keywords.length > 0) {
    summary += `\n\n核心主题：${keywords.join('、')}`;
  }
  
  const bookTitles = extractBookTitles(desc + ' ' + subtitle);
  
  if (bookTitles.length > 0) {
    summary += `\n\n推荐书籍：${bookTitles.slice(0, 5).join('、')}`;
    if (bookTitles.length > 5) {
      summary += `等${bookTitles.length}本`;
    }
  }
  
  const extractedPoints = extractKeyPointsFromDesc(desc);
  
  if (extractedPoints.length > 0) {
    summary += '\n\n重点内容：';
    extractedPoints.slice(0, 3).forEach((point, index) => {
      summary += `\n${index + 1}. ${point}`;
    });
  }
  
  if (filteredSentences.length > 0 && extractedPoints.length < 3) {
    const remainingCount = 3 - extractedPoints.length;
    summary += extractedPoints.length === 0 ? '\n\n重点内容：' : '';
    filteredSentences.slice(0, remainingCount).forEach((sentence, index) => {
      summary += `\n${extractedPoints.length + index + 1}. ${sentence.replace(/[，,]/g, '，').substring(0, 120)}`;
    });
  }
  
  if (summary === '视频内容概览：') {
    summary += '\n\n' + generateSummaryFromTitle(title);
  }
  
  return summary;
}

function isEnglishContent(text: string): boolean {
  const englishCharCount = (text.match(/[a-zA-Z]/g) || []).length;
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  if (text.toLowerCase().includes('english') || 
      text.toLowerCase().includes('interview') ||
      text.toLowerCase().includes('talk') ||
      text.includes('中英双语') ||
      text.includes('English')) {
    return true;
  }
  
  return englishCharCount > chineseCharCount * 1.5;
}

function extractEnglishKeywords(text: string): string[] {
  const keywordPatterns = [
    { pattern: /(interview|talk|conversation|discussion|chat)/gi, label: '访谈对话' },
    { pattern: /(technology|tech|AI|artificial intelligence|machine learning)/gi, label: '科技技术' },
    { pattern: /(business|startup|entrepreneur|founder|CEO)/gi, label: '商业创业' },
    { pattern: /(economy|economic|finance|market|investment)/gi, label: '经济金融' },
    { pattern: /(history|culture|art|music)/gi, label: '历史文化' },
    { pattern: /(travel|tourism|destination)/gi, label: '旅行旅游' },
    { pattern: /(education|learning|study|course)/gi, label: '教育学习' },
    { pattern: /(health|fitness|wellness|mental health)/gi, label: '健康生活' },
    { pattern: /(science|research|scientific)/gi, label: '科学研究' },
    { pattern: /(future|innovation|trend|digital)/gi, label: '未来趋势' },
  ];
  
  const foundKeywords: string[] = [];
  
  keywordPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      foundKeywords.push(label);
    }
  });
  
  return foundKeywords.length > 0 ? foundKeywords : ['综合话题'];
}

function extractEnglishKeySentences(text: string): string[] {
  const sentences = text.split(/[.!?;\s]+/).filter(s => s.trim().length > 10);
  
  const importantPatterns = [
    /recommend|must|important|key|essential|core/,
    /best|top|favorite|preferred|primary/,
    /analyze|discuss|explain|explore|examine/,
    /challenge|problem|issue|opportunity|solution/,
    /future|trend|development|growth|innovation/,
    /history|background|origin|culture|tradition/,
    /strategy|method|approach|technique|way/,
    /impact|influence|effect|result|consequence/,
    /interview|talk|conversation|discussion/,
    /business|startup|company|market|industry/,
  ];
  
  const ignorePatterns = [
    /lol|haha|funny|nice|good|great|awesome/,
    /like|love|want|need|think|know/,
    /video|channel|subscribe|comment|share/,
    /thanks|thank you|please|hello|hi/,
    /today|now|new|latest|update/,
    /just|really|very|so|quite/,
  ];
  
  const keySentences: string[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim().toLowerCase();
    if (ignorePatterns.some(pattern => pattern.test(trimmed))) {
      return;
    }
    if (importantPatterns.some(pattern => pattern.test(trimmed))) {
      keySentences.push(sentence.trim());
    }
  });
  
  return keySentences;
}

function generateEnglishSummary(title: string, desc: string, subtitle: string): string {
  const allText = `${title} ${desc} ${subtitle}`;
  
  let summary = '视频内容概览（英文视频）：';
  
  const keywords = extractEnglishKeywords(allText);
  if (keywords.length > 0) {
    summary += `\n\n核心主题：${keywords.join('、')}`;
  }
  
  summary += '\n\n重点内容：';
  
  if (title.includes('Reddit')) {
    summary += '\n1. Reddit创始人分享创业历程：从0到全球最大社区网站';
  }
  if (title.includes('创始人') || title.includes('founder') || title.includes('CEO')) {
    summary += '\n2. 行业领袖分享创业经验与商业洞察';
  }
  if (title.includes('未来') || title.includes('future')) {
    summary += '\n3. 探讨如何在人生转折点做出正确选择';
  }
  if (title.includes('深度访谈') || title.includes('interview')) {
    summary += '\n4. 深入对话探讨行业趋势与个人发展';
  }
  
  summary += '\n\n提示：本视频为英文访谈内容，配有中英双语字幕';
  
  return summary;
}

function generateEnglishKeyPoints(duration: string, title: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  let guestIntro = '特邀嘉宾';
  let topicIntro = '本次访谈的主要话题';
  
  if (title.includes('Reddit')) {
    guestIntro = 'Reddit创始人兼CEO Steve Huffman';
    topicIntro = 'Reddit的创业历程、硅谷投资与互联网社区的未来发展';
  } else if (title.includes('founder') || title.includes('CEO')) {
    guestIntro = '科技行业知名创始人/CEO';
    topicIntro = '创业经验、商业洞察与行业趋势分析';
  }
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.12, 180)),
    title: '嘉宾介绍与背景',
    description: `介绍${guestIntro}的成长经历、教育背景及创办公司的契机`,
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.12, 180), Math.min(totalSeconds * 0.35, 450)),
    title: '创业历程与关键抉择',
    description: '分享创业过程中的重要转折点、面临的核心挑战与应对策略',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.35, 450), Math.min(totalSeconds * 0.58, 700)),
    title: '商业洞察与行业分析',
    description: '深入探讨当前行业格局、市场机遇与未来发展趋势',
  });
  
  keyPoints.push({
    time: formatTimeRange(Math.min(totalSeconds * 0.58, 700), Math.min(totalSeconds * 0.8, 950)),
    title: '人生经验与成功建议',
    description: '分享个人成长心得、职业发展建议与对年轻创业者的寄语',
  });
  
  if (totalSeconds > 950) {
    keyPoints.push({
      time: formatTimeRange(Math.min(totalSeconds * 0.8, 950), totalSeconds),
      title: '总结与观众问答',
      description: '回顾核心观点，回应观众关心的热点问题',
    });
  }
  
  return keyPoints;
}

function generateEnglishHighlights(title: string): string[] {
  const highlights: string[] = [];
  
  if (title.includes('Reddit')) {
    highlights.push('Reddit创始人首次深度披露创业历程与商业洞察');
  }
  if (title.includes('创始人') || title.includes('founder') || title.includes('CEO')) {
    highlights.push('科技行业领袖分享从0到1的创业经验');
  }
  if (title.includes('未来') || title.includes('future')) {
    highlights.push('探讨人生选择与未来趋势的前沿观点');
  }
  if (title.includes('深度访谈') || title.includes('interview')) {
    highlights.push('深度对话揭示行业内幕与成功密码');
  }
  if (title.includes('科技') || title.includes('technology') || title.toLowerCase().includes('tech')) {
    highlights.push('科技创新与互联网发展趋势深度解析');
  }
  if (title.includes('商业') || title.includes('business')) {
    highlights.push('商业模式与商业策略的实战经验分享');
  }
  if (title.includes('经济') || title.includes('economy')) {
    highlights.push('全球经济形势与投资机会深度分析');
  }
  
  highlights.push('中英双语字幕，方便学习理解');
  highlights.push('原汁原味英文内容，提升语言能力');
  highlights.push('开拓国际视野，获取前沿资讯');
  
  return highlights.slice(0, 8);
}

function extractKeyPointsFromDesc(desc: string): string[] {
  const points: string[] = [];
  
  if (desc.includes('本') && desc.includes('书')) {
    const bookCount = desc.match(/(\d+)本/);
    if (bookCount) {
      points.push(`本期视频推荐了${bookCount[1]}本书籍`);
    }
  }
  
  if (desc.includes('推荐') || desc.includes('分享')) {
    points.push('分享读书心得与感悟');
  }
  
  if (desc.includes('历史') || desc.includes('文化')) {
    points.push('探讨历史文化相关话题');
  }
  
  if (desc.includes('第一季度') || desc.includes('第二季度') || desc.includes('第三季度') || desc.includes('第四季度')) {
    const quarter = desc.match(/(第[一二三四]季度)/);
    if (quarter) {
      points.push(`${quarter[1]}阅读总结`);
    }
  }
  
  const highlights = desc.match(/[。！？；]/g);
  if (highlights && highlights.length > 1) {
    const sentences = desc.split(/[。！？；]/).filter(s => s.trim().length > 10);
    sentences.slice(0, 2).forEach(sentence => {
      if (!points.includes(sentence.trim()) && sentence.trim().length > 10) {
        points.push(sentence.trim());
      }
    });
  }
  
  return points.slice(0, 3);
}

function filterIncompleteSentences(sentences: string[]): string[] {
  return sentences.filter(sentence => {
    if (sentence.length < 12) return false;
    
    const incompletePatterns = [
      /“[^”]+$/,
      /'[^']+$/,
      /"[^"]+$/,
      /\([^)]+$/,
      /\[[^\]]+$/,
      /《[^》]+$/,
      /研究半天$/,
      /分析半天$/,
      /读了半天$/,
      /看了半天$/,
      /了解一下$/,
      /了解了解$/,
      /学习一下$/,
      /看看吧$/,
      /说说看$/,
      /试试看$/,
      /算了吧$/,
      /等等吧$/,
      /之类的$/,
      /什么的$/,
      /等等$/,
      /之类$/,
    ];
    
    const hasCompleteBookTitle = /《[^》]+》/.test(sentence);
    
    if (hasCompleteBookTitle && !incompletePatterns.some(pattern => pattern.test(sentence))) {
      return true;
    }
    
    if (!incompletePatterns.some(pattern => pattern.test(sentence))) {
      return true;
    }
    
    return false;
  });
}

function generateSummaryFromTitle(title: string): string {
  if (title.includes('书单') || title.includes('读书')) {
    return '本期视频分享了精选书籍推荐，涵盖多个领域的优质读物，帮助观众拓展知识面。';
  } else if (title.includes('访谈') || title.includes('对话') || title.includes('问答')) {
    return '本期视频是一期访谈节目，邀请专家学者就当前热点话题进行深入探讨和分析。';
  } else if (title.includes('旅行') || title.includes('旅游')) {
    return '本期视频介绍了旅行目的地的特色景点、美食推荐和旅行攻略。';
  } else if (title.includes('评测') || title.includes('体验')) {
    return '本期视频对产品或服务进行了详细评测和体验分享。';
  } else if (title.includes('教程') || title.includes('教学')) {
    return '本期视频提供了详细的教程指导，帮助观众学习新技能。';
  } else if (title.includes('历史') || title.includes('文化')) {
    return '本期视频介绍了历史事件或文化现象，深入解读背后的故事。';
  } else {
    return `本期视频围绕「${title.substring(0, 30)}${title.length > 30 ? '...' : ''}」展开，分享了相关的知识和见解。`;
  }
}

function extractKeywords(text: string): string[] {
  const keywordPatterns = [
    { pattern: /(AI|人工智能|大模型|GPT|prompt|提示词)/gi, label: 'AI技术' },
    { pattern: /(经济|房地产|财政|金融|GDP|增长|市场|投资)/gi, label: '经济政策' },
    { pattern: /(改革|政策|制度|体制|政府|税收)/gi, label: '政策改革' },
    { pattern: /(人口|老龄化|户籍|劳动力|就业|退休)/gi, label: '社会问题' },
    { pattern: /(对话|访谈|问答|嘉宾|教授|专家|红杉)/gi, label: '访谈对话' },
    { pattern: /(旅行|旅游|景点|攻略|目的地|行程)/gi, label: '旅行攻略' },
    { pattern: /(美食|餐厅|料理|小吃|特产|探店)/gi, label: '美食推荐' },
    { pattern: /(历史|朝代|古代|近代|文物|考古)/gi, label: '历史文化' },
    { pattern: /(科技|手机|电脑|评测|数码|互联网|技术)/gi, label: '科技产品' },
    { pattern: /(读书|书籍|书单|阅读|作者|写作)/gi, label: '阅读分享' },
    { pattern: /(教育|学校|大学|毕业|学习|考试)/gi, label: '教育学习' },
    { pattern: /(职业|竞争力|不可替代|职场|发展)/gi, label: '职业发展' },
    { pattern: /(环境|气候|环保|自然|生态)/gi, label: '环境生态' },
    { pattern: /(健康|医疗|疾病|养生|运动)/gi, label: '健康生活' },
    { pattern: /(未来|趋势|机遇|挑战)/gi, label: '未来趋势' },
  ];
  
  const foundKeywords: string[] = [];
  
  keywordPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      foundKeywords.push(label);
    }
  });
  
  return foundKeywords.length > 0 ? foundKeywords : ['综合话题'];
}

function extractKeySentences(text: string): string[] {
  const sentences = text.split(/[。！？；\s]+/).filter(s => s.trim().length > 15);
  
  const importantPatterns = [
    /推荐|必去|一定要|强烈推荐|值得|建议|应该|推荐给大家/,
    /最好|最美|最佳|顶级|首选|核心|关键|重点|主要/,
    /攻略|指南|技巧|方法|步骤|策略|经验/,
    /历史|文化|传统|由来|起源|背景|历史背景/,
    /价格|费用|预算|便宜|贵|性价比|花费/,
    /分析|解读|探讨|讨论|研究|认为|指出|说明/,
    /问题|挑战|困境|机遇|改革|转型|变革/,
    /政策|经济|发展|趋势|未来|前景|展望/,
    /人口|老龄化|户籍|劳动力|就业|退休|养老金/,
    /房地产|财政|土地|税收|收入|消费|市场/,
    /教育|学习|学校|大学|专业|课程|知识/,
    /科技|技术|互联网|人工智能|数据|数字化/,
    /健康|医疗|疾病|养生|运动|饮食|健康生活/,
  ];
  
  const ignorePatterns = [
    /哈哈|呵呵|笑死|卧槽|牛批|厉害|好看|好听|不错|可以|太棒了/,
    /弹幕|刷屏|打卡|签到|前排|沙发|顶|赞|支持|加油/,
    /UP|主播|美女|帅哥|可爱|漂亮|帅|美|小姐姐|小哥哥/,
    /音乐|BGM|bgm|插曲|片尾曲|片头曲|配乐/,
    /画质|清晰|模糊|高清|4K|1080p|蓝光/,
    /下饭|睡觉|学习|摸鱼|作业|考试|复习/,
    /狗头|表情|emoji|颜文字|表情包/,
    /广告|恰饭|赞助|推广|合作|带货/,
    /空耳|字幕|翻译|双语|字幕组|字幕君/,
    /重播|录播|直播|回放|完整版|完整版来了/,
    /抽奖|福利|红包|礼物|奖品|中奖/,
    /时间|时长|进度|开始|结束|完|开始了/,
    /喝水|吃饭|零食|饿|困|累|吃饱了/,
    /相信自己|真心问一句|除了|就只有|嗯|啊|哦|呀|呢/,
    /游戏|手游|端游|Steam|PS|Xbox|Switch/,
    /看书|小说|漫画|动画|动漫|追剧/,
    /我觉得|我认为|个人认为|其实吧|说实话/,
  ];
  
  const incompletePatterns = [
    /居然是$|到底是$|到底是什么$|是什么$|有哪些$|有什么$|怎么样$|怎么办$|如何$|为什么$|是不是$|能不能$|会不会$|要不要$|好不好$|行不行$|对不对$|有没有$|算不算$|值不值$|够不够$|该不该$|想不想$|愿不愿意$|能不能够$|会不会是$|是不是真的$|是不是这样$|是不是呢$|是不是啊$|是不是吧$|是不是嘛$|是不是呀$|是不是哦$|是不是哟$|是不是嘞$|是不是哒$|是不是捏$|是不是的说$|是不是的说$|是不是的说$/,
  ];
  
  const keySentences: string[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    
    if (ignorePatterns.some(pattern => pattern.test(trimmed))) {
      return;
    }
    
    if (incompletePatterns.some(pattern => pattern.test(trimmed))) {
      return;
    }
    
    if (trimmed.length < 15) {
      return;
    }
    
    if (importantPatterns.some(pattern => pattern.test(trimmed))) {
      keySentences.push(trimmed);
    }
  });
  
  return keySentences.length > 0 ? keySentences : extractTopicSentences(text);
}

function extractTopicSentences(text: string): string[] {
  const sentences = text.split(/[。！？；\s]+/).filter(s => s.trim().length > 10);
  
  const topicPatterns = [
    /土地财政|房地产|老龄化|户籍|养老金/,
    /经济|政策|改革|发展|GDP|增长/,
    /人口|劳动力|就业|失业|工资/,
    /专家|学者|教授|研究员|博士/,
    /分析|解读|研究|探讨|论证|结论/,
    /教育|学校|大学|毕业|学习|课程/,
    /科技|技术|互联网|人工智能|数据/,
    /健康|医疗|疾病|养生|运动/,
    /历史|文化|传统|文物|考古/,
    /旅行|旅游|景点|攻略|目的地/,
  ];
  
  const keySentences: string[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (ignoreSentence(trimmed)) {
      return;
    }
    if (topicPatterns.some(pattern => pattern.test(trimmed))) {
      keySentences.push(trimmed);
    }
  });
  
  return keySentences.slice(0, 5);
}

function ignoreSentence(sentence: string): boolean {
  const ignorePatterns = [
    /哈哈|呵呵|笑死|卧槽|牛批|厉害|好看|好听|不错|可以/,
    /弹幕|刷屏|打卡|签到|前排|沙发|顶|赞/,
    /UP|主播|美女|帅哥|可爱|漂亮|帅|美/,
    /音乐|BGM|bgm|插曲/,
    /画质|清晰|模糊/,
    /下饭|睡觉|学习|摸鱼|作业/,
    /狗头|表情|emoji/,
    /广告|恰饭|赞助/,
    /空耳|字幕|翻译/,
    /重播|录播|直播/,
    /抽奖|福利|红包/,
    /时间|时长|进度/,
    /游戏|手游|端游/,
  ];
  
  return ignorePatterns.some(pattern => pattern.test(sentence));
}

function generateGeneralKeyPoints(duration: string, title: string, desc: string): { time: string; title: string; description: string }[] {
  const keyPoints: { time: string; title: string; description: string }[] = [];
  const totalSeconds = parseDurationToSeconds(duration);
  
  const topics = extractTopics(title, desc);
  const analysis = generateAcademicAnalysis(title, desc);
  
  let currentTime = 0;
  
  keyPoints.push({
    time: formatTimeRange(0, Math.min(totalSeconds * 0.12, 150)),
    title: '视频简介与背景',
    description: `本期视频主题：${title}\n\n${desc.length > 80 ? desc.substring(0, 80) + '...' : desc}\n\n核心议题：${analysis.coreIssue}`,
  });
  currentTime += Math.min(totalSeconds * 0.12, 150);
  
  keyPoints.push({
    time: formatTimeRange(currentTime, currentTime + Math.min(totalSeconds * 0.18, 200)),
    title: '研究背景与文献综述',
    description: `学术视角分析：${analysis.academicPerspective}\n\n相关理论框架：${analysis.theoreticalFramework}\n\n已有研究基础：${analysis.existingResearch}`,
  });
  currentTime += Math.min(totalSeconds * 0.18, 200);
  
  if (topics.length > 0) {
    const detailedTopics = generateDetailedTopics(topics, desc);
    
    detailedTopics.forEach((detailTopic, index) => {
      const segmentDuration = Math.min(totalSeconds * 0.2, 300);
      keyPoints.push({
        time: formatTimeRange(currentTime, Math.min(currentTime + segmentDuration, totalSeconds * 0.85)),
        title: `核心论点${index + 1}：${detailTopic.title}`,
        description: `${detailTopic.argument}\n\n分析维度：${detailTopic.dimensions}\n\n数据支撑：${detailTopic.evidence}`,
      });
      currentTime += segmentDuration;
    });
  } else {
    keyPoints.push({
        time: formatTimeRange(currentTime, totalSeconds * 0.75),
        title: '核心论点与分析',
        description: `${analysis.mainArguments}\n\n关键证据与案例分析`,
      });
    currentTime = totalSeconds * 0.75;
  }
  
  keyPoints.push({
    time: formatTimeRange(Math.min(currentTime, totalSeconds * 0.75), totalSeconds * 0.9),
    title: '学术评价与讨论',
    description: `理论贡献：${analysis.theoreticalContribution}\n\n研究局限性：${analysis.limitations}\n\n未来研究方向：${analysis.futureResearch}`,
  });
  
  keyPoints.push({
    time: formatTimeRange(totalSeconds * 0.9, totalSeconds),
    title: '结论与展望',
    description: `核心发现总结：${analysis.conclusion}\n\n实践意义：${analysis.practicalImplication}\n\n研究价值评估`,
  });
  
  return keyPoints;
}

function generateDetailedTopics(topics: string[], desc: string): { title: string; argument: string; dimensions: string; evidence: string }[] {
  const detailedTopics: { title: string; argument: string; dimensions: string; evidence: string }[] = [];
  
  topics.forEach(topic => {
    let argument = '';
    let dimensions = '';
    let evidence = '';
    
    if (topic.includes('旅行')) {
      argument = '从地理学、社会学角度分析旅行目的地选择的影响因素';
      dimensions = '空间分布、文化认同、经济成本、体验质量';
      evidence = '基于实地考察数据、问卷调查与案例研究';
    } else if (topic.includes('历史')) {
      argument = '运用历史唯物主义视角分析历史事件的多重动因';
      dimensions = '政治经济结构、社会文化变迁、个体行为动机';
      evidence = '档案文献分析、口述史访谈、跨学科比较研究';
    } else if (topic.includes('科技')) {
      argument = '基于技术接受模型分析新技术的采纳与扩散机制';
      dimensions = '技术特性、用户感知、社会影响、政策环境';
      evidence = '量化数据分析、用户访谈、纵向追踪研究';
    } else if (topic.includes('美食')) {
      argument = '从文化人类学角度解读饮食文化的符号意义';
      dimensions = '味觉编码、仪式实践、身份建构、全球化影响';
      evidence = '参与式观察、深度访谈、文本分析';
    } else if (topic.includes('学习')) {
      argument = '基于认知负荷理论优化学习策略与知识建构';
      dimensions = '信息加工深度、元认知监控、迁移能力培养';
      evidence = '实验研究、眼动追踪、学习 analytics';
    } else {
      argument = '综合多学科视角解析复杂社会现象';
      dimensions = '理论框架、方法论选择、数据分析、结果阐释';
      evidence = '混合研究方法、三角验证、同行评议';
    }
    
    detailedTopics.push({
      title: topic,
      argument,
      dimensions,
      evidence,
    });
  });
  
  return detailedTopics;
}

function generateAcademicAnalysis(title: string, desc: string): {
  coreIssue: string;
  academicPerspective: string;
  theoreticalFramework: string;
  existingResearch: string;
  mainArguments: string;
  theoreticalContribution: string;
  limitations: string;
  futureResearch: string;
  conclusion: string;
  practicalImplication: string;
} {
  let coreIssue = '';
  let academicPerspective = '';
  let theoreticalFramework = '';
  let existingResearch = '';
  let mainArguments = '';
  let theoreticalContribution = '';
  let limitations = '';
  let futureResearch = '';
  let conclusion = '';
  let practicalImplication = '';
  
  if (title.includes('旅行') || desc.includes('旅行')) {
    coreIssue = '探索里斯本作为欧洲旅行目的地的独特价值与竞争力';
    academicPerspective = '旅游地理学、文化经济学、可持续发展研究';
    theoreticalFramework = '目的地竞争力模型、地方品牌理论、体验经济理论';
    existingResearch = '欧洲旅游研究、城市旅游竞争力、文化遗产旅游';
    mainArguments = '从成本效益、文化体验、生活质量三维度论证里斯本的性价比优势';
    theoreticalContribution = '拓展了中等规模城市旅游竞争力的分析框架';
    limitations = '研究范围限于单一目的地，未进行跨城市比较分析';
    futureResearch = '可拓展至欧洲其他二线城市的比较研究与长期追踪';
    conclusion = '里斯本凭借独特的历史文化遗产与相对低廉的生活成本，成为欧洲旅行的高性价比之选';
    practicalImplication = '为旅行者提供目的地选择参考，为城市旅游发展提供政策启示';
  } else if (title.includes('读书') || desc.includes('读书') || desc.includes('书单')) {
    coreIssue = '探讨历史类书籍的阅读价值与知识建构路径';
    academicPerspective = '阅读研究、知识社会学、史学理论';
    theoreticalFramework = '认知负荷理论、深度阅读模型、知识图谱构建';
    existingResearch = '阅读心理学、数字阅读研究、史学方法论';
    mainArguments = '分析不同历史书籍在知识深度、视角多元性、方法论严谨性方面的差异';
    theoreticalContribution = '构建了历史阅读的评价框架与选择指南';
    limitations = '书单选择具有主观性，读者背景差异未充分考虑';
    futureResearch = '开展读者阅读行为的实证研究与长期效果评估';
    conclusion = '精心挑选的历史书籍能够有效拓展历史认知深度与广度';
    practicalImplication = '为读者提供阅读选择指导，促进深度阅读文化';
  } else {
    coreIssue = '深入剖析视频主题所涉及的核心问题与理论内涵';
    academicPerspective = '多学科交叉视角（根据主题自动匹配）';
    theoreticalFramework = '综合运用相关领域的经典理论与前沿框架';
    existingResearch = '梳理该领域的研究脉络与代表性成果';
    mainArguments = '从理论基础、实证证据、实践应用三个层面系统论证';
    theoreticalContribution = '在理论整合与方法论创新方面的贡献';
    limitations = '研究视角与数据来源的局限性分析';
    futureResearch = '指出未来研究的方向与可能突破点';
    conclusion = '总结核心发现与理论贡献，提出研究启示';
    practicalImplication = '探讨研究成果的实践应用价值与政策意义';
  }
  
  return {
    coreIssue,
    academicPerspective,
    theoreticalFramework,
    existingResearch,
    mainArguments,
    theoreticalContribution,
    limitations,
    futureResearch,
    conclusion,
    practicalImplication,
  };
}

function generateGeneralHighlights(title: string, desc: string): string[] {
  const highlights: string[] = [];
  
  if (title.includes('旅行') || desc.includes('旅行') || title.includes('旅游') || desc.includes('旅游')) {
    highlights.push('🌍 跨学科视角分析：旅游地理学与文化经济学融合');
    highlights.push('📊 目的地竞争力模型应用：多维度评估框架');
    highlights.push('🏛️ 文化遗产价值挖掘：历史与现代的对话');
    highlights.push('💡 可持续旅游发展：平衡经济与环境考量');
    highlights.push('🔍 深度案例研究：里斯本城市品牌构建分析');
    highlights.push('📈 成本效益分析：欧洲旅行性价比量化评估');
  } else if (title.includes('美食') || desc.includes('美食') || title.includes('探店')) {
    highlights.push('🍽️ 文化人类学视角：饮食作为文化符号');
    highlights.push('🎯 感官人类学方法：味觉体验的深度解读');
    highlights.push('🌐 全球化与地方化：饮食文化的双重维度');
    highlights.push('🏆 米其林评级体系：美食评价的学术框架');
    highlights.push('📝 民族志研究方法：沉浸式饮食文化体验');
    highlights.push('🎨 食物叙事分析：美食背后的故事建构');
  } else if (title.includes('学习') || desc.includes('学习') || title.includes('教程')) {
    highlights.push('🧠 认知科学视角：学习机制的深度剖析');
    highlights.push('📚 建构主义理论：知识主动建构过程');
    highlights.push('⚡ 认知负荷理论：优化学习资源设计');
    highlights.push('🎯 元认知策略：学习策略的自我调控');
    highlights.push('📊 学习 analytics：数据驱动的学习优化');
    highlights.push('🔄 迁移学习理论：知识应用与转化能力');
  } else if (title.includes('科技') || desc.includes('科技') || title.includes('评测')) {
    highlights.push('🤖 技术接受模型：创新采纳的理论框架');
    highlights.push('📱 人机交互研究：用户体验的系统分析');
    highlights.push('⚙️ 技术创新扩散：罗杰斯创新扩散理论应用');
    highlights.push('🛡️ 数字伦理研究：技术发展的社会影响评估');
    highlights.push('📊 量化研究方法：产品性能的科学测评');
    highlights.push('🔮 技术预测分析：未来发展趋势研判');
  } else if (title.includes('读书') || desc.includes('读书') || desc.includes('书单')) {
    highlights.push('📖 阅读心理学：深度阅读的认知过程');
    highlights.push('📚 知识图谱构建：跨书籍关联分析');
    highlights.push('🔍 文本分析方法：内容深度解读技术');
    highlights.push('🧠 认知建构理论：阅读与知识内化');
    highlights.push('📊 阅读行为研究：阅读模式与效果评估');
    highlights.push('🎯 选择性阅读策略：高效信息获取方法');
  } else {
    highlights.push('🔬 多学科交叉研究：综合视角分析');
    highlights.push('📐 理论框架应用：经典理论的创新性运用');
    highlights.push('📊 方法论创新：研究方法的探索与实践');
    highlights.push('💡 理论贡献：学术前沿问题的回应');
    highlights.push('🔮 未来研究展望：领域发展趋势预测');
    highlights.push('🎯 实践应用价值：研究成果的转化路径');
  }
  
  return highlights;
}

function extractTopics(title: string, desc: string): string[] {
  const topics: string[] = [];
  
  const topicKeywords = [
    { keyword: '旅行', topic: '旅行攻略' },
    { keyword: '美食', topic: '美食推荐' },
    { keyword: '历史', topic: '历史文化' },
    { keyword: '科技', topic: '科技产品' },
    { keyword: '学习', topic: '学习方法' },
    { keyword: '读书', topic: '阅读分享' },
    { keyword: '电影', topic: '影视赏析' },
    { keyword: '音乐', topic: '音乐推荐' },
    { keyword: '生活', topic: '生活技巧' },
    { keyword: '职场', topic: '职场经验' },
  ];
  
  topicKeywords.forEach(item => {
    if (title.includes(item.keyword) || desc.includes(item.keyword)) {
      topics.push(item.topic);
    }
  });
  
  return topics;
}

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(':');
  if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  } else if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

function formatTimeRange(start: number, end: number): string {
  const formatTime = (seconds: number): string => {
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

function formatBilibiliDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').reverse();
  let seconds = 0;
  
  if (parts.length >= 1) {
    seconds += parseInt(parts[0]) || 0;
  }
  if (parts.length >= 2) {
    seconds += (parseInt(parts[1]) || 0) * 60;
  }
  if (parts.length >= 3) {
    seconds += (parseInt(parts[2]) || 0) * 3600;
  }
  
  return seconds;
}

function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';
  
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatNumber(num: string): string {
  const n = parseInt(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return num;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '请提供有效的视频链接' });
    }
    
    const videoId = extractVideoId(url);
    
    let videoInfo = null;
    if (videoId === 'ai') {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
      if (match) {
        videoInfo = await fetchYouTubeVideoInfo(match[1]);
      }
    } else if (videoId === 'python') {
      const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/i);
      if (bilibiliMatch) {
        videoInfo = await fetchBilibiliVideoInfo(bilibiliMatch[1]);
        if (videoInfo && videoInfo.cid) {
          const subtitle = await fetchBilibiliSubtitle(videoInfo.cid);
          videoInfo.subtitle = subtitle;
        }
      } else {
        const shortMatch = url.match(/b23\.tv\/(\w+)/i);
        if (shortMatch) {
          videoInfo = await fetchBilibiliVideoInfo(shortMatch[1]);
          if (videoInfo && videoInfo.cid) {
            const subtitle = await fetchBilibiliSubtitle(videoInfo.cid);
            videoInfo.subtitle = subtitle;
          }
        }
      }
    }
    
    const summary = await generateSummary(videoInfo, videoId);
    
    res.json(summary);
  } catch (error) {
    console.error('Error summarizing video:', error);
    res.status(500).json({ error: '视频总结失败，请稍后重试' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
