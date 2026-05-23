import { useState } from "react";
import {
  Play,
  Clock,
  User,
  Share2,
  Bookmark,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Loader2,
  Link2,
  FileText,
  Star,
  Zap,
  AlertCircle,
} from "lucide-react";

interface VideoSummary {
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
  published: string;
  summary: string;
  keyPoints: {
    time: string;
    title: string;
    description: string;
    videoUrl: string;
  }[];
  highlights: string[];
}

function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [currentBvid, setCurrentBvid] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "视频总结失败");
      }

      const data = await response.json();
      // 提取 BV 号
      const bvidMatch = videoUrl.match(/(BV[\w]+)/i);
      if (bvidMatch) {
        setCurrentBvid(bvidMatch[1]);
      } else if (data.videoUrl) {
        const dataBvidMatch = data.videoUrl.match(/(BV[\w]+)/i);
        if (dataBvidMatch) {
          setCurrentBvid(dataBvidMatch[1]);
        }
      }
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "视频总结失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      const text = `${summary.title}\n\n${summary.summary}\n\n要点：\n${summary.keyPoints.map((k) => `${k.time} - ${k.title}`).join("\n")}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              视频提纲总结
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            输入视频链接，快速获取视频核心内容要点，让您事半功倍地掌握视频精华
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link2 className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="请输入视频链接（支持YouTube、B站等平台）..."
              className="w-full pl-12 pr-40 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !videoUrl.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  总结
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            <p className="mt-4 text-gray-400">正在分析视频内容...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">{error}</p>
            <p className="text-gray-500 mt-2">请检查视频链接是否正确，或稍后重试</p>
          </div>
        )}

        {summary && !loading && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-2/5">
                  <div className="w-full h-48 md:h-full bg-black">
                    {currentBvid ? (
                      <iframe
                        src={`https://player.bilibili.com/player.html?bvid=${currentBvid}&page=1&t=${currentVideoTime}&high_quality=1&danmaku=0`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                        <img 
                          src={summary.thumbnail} 
                          alt={summary.title}
                          className="w-full h-full object-cover opacity-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <a 
                            href={summary.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                          >
                            <Play className="w-5 h-5" />
                            点击在新窗口打开
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur rounded-full text-white text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {summary.duration}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:w-3/5">
                  <h2 className="text-xl font-bold text-white mb-3">{summary.title}</h2>
                  <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {summary.channel}
                    </span>
                    <span>{summary.views} 观看</span>
                    <span>{summary.published}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
                  <div className="flex gap-3 mt-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                      <Bookmark className="w-4 h-4" />
                      收藏
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          已复制
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          复制要点
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-white">核心要点</h3>
              </div>
              <div className="space-y-4">
                {summary.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                        {point.time}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{point.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{point.description}</p>
                        <button
                          onClick={() => setCurrentVideoTime(parseInt(point.videoUrl.match(/t=(\d+)/)[1]) || 0)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25"
                        >
                          <Play className="w-4 h-4" />
                          跳转到该片段
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">精彩亮点</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!summary && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Play className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">输入视频链接开始总结</h3>
            <p className="text-gray-500">支持 YouTube、B站等主流视频平台</p>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>视频提纲总结工具 - 让观看更高效</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
