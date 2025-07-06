import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { WeeklyIssueCard } from "@/components/WeeklyIssueCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, TrendingUp, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";

// サンプルデータ
const sampleIssues = [
  {
    id: "1",
    title: "TOFUラボ週刊号 #1",
    week: "2024年1月第1週",
    date: "2024/01/01 - 2024/01/07",
    summary: "新年を迎えたTOFUラボコミュニティでは、新しいElementorテンプレートの紹介と、WordPress保守管理に関する活発な議論が行われました。",
    highlights: ["新テンプレート", "保守管理", "コミュニティ議論"],
    sources: {
      discord: 15,
      website: 3,
      youtube: 2
    },
    status: "published" as const
  },
  {
    id: "2", 
    title: "TOFUラボ週刊号 #2",
    week: "2024年1月第2週",
    date: "2024/01/08 - 2024/01/14",
    summary: "KINOKAテンプレートがリリースされ、和風デザインに関する議論が盛り上がりました。また、SEO対策についてのワークショップも開催されました。",
    highlights: ["KINOKAテンプレート", "和風デザイン", "SEO対策"],
    sources: {
      discord: 22,
      website: 5,
      youtube: 1
    },
    status: "published" as const
  },
  {
    id: "3",
    title: "TOFUラボ週刊号 #3",
    week: "2024年1月第3週", 
    date: "2024/01/15 - 2024/01/21",
    summary: "FLEURテンプレートの制作過程が公開され、写真を活用したエレガントなサイト制作のテクニックが話題となりました。",
    highlights: ["FLEURテンプレート", "写真活用", "エレガントデザイン"],
    sources: {
      discord: 18,
      website: 4,
      youtube: 3
    },
    status: "draft" as const
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          {/* ヒーローセクション */}
          <section className="gradient-dark rounded-2xl p-8 border border-border/30 shadow-dark">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 gradient-neon rounded-xl flex items-center justify-center animate-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
                    TOFUラボ週刊情報誌
                  </h1>
                  <p className="text-neon-blue font-medium">自動化された情報収集システム</p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground animate-slide-up max-w-2xl">
                Discord、ウェブサイト、YouTubeからの情報を自動収集し、
                AIが整理・編集してWordPressに投稿する次世代の情報誌システムです
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <Button size="lg" asChild className="gradient-neon border-0 shadow-neon">
                  <Link to="/create">
                    <Plus className="w-5 h-5 mr-2" />
                    新しい週刊号を作成
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="hover-glow">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  今週のハイライト
                </Button>
                <Button variant="outline" size="lg" className="hover-glow">
                  <Activity className="w-5 h-5 mr-2" />
                  システム状態
                </Button>
              </div>
            </div>
          </section>

          {/* フィルター・検索セクション */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hover-glow">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </Button>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
                  全て (3)
                </Badge>
                <Badge variant="secondary" className="bg-neon-green/10 text-neon-green border-neon-green/30">
                  公開済み (2)
                </Badge>
                <Badge variant="outline" className="border-muted-foreground/30">
                  下書き (1)
                </Badge>
              </div>
            </div>
            
            <Button variant="outline" asChild className="hover-glow">
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                新規作成
              </Link>
            </Button>
          </div>

          {/* 統計ダッシュボード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-dark hover-neon">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">総週刊号数</div>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-neon-blue/20 shadow-dark glow-neon-blue">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-neon-blue">55</div>
                  <div className="text-sm text-muted-foreground">Discord投稿</div>
                </div>
                <div className="w-10 h-10 bg-neon-blue/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-blue" />
                </div>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-neon-purple/20 shadow-dark glow-neon-purple">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-neon-purple">12</div>
                  <div className="text-sm text-muted-foreground">サイト更新</div>
                </div>
                <div className="w-10 h-10 bg-neon-purple/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-neon-purple" />
                </div>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-neon-pink/20 shadow-dark glow-neon-pink">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-neon-pink">6</div>
                  <div className="text-sm text-muted-foreground">YouTube動画</div>
                </div>
                <div className="w-10 h-10 bg-neon-pink/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-neon-pink" />
                </div>
              </div>
            </div>
          </div>

          {/* 週刊号一覧 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">最新の週刊号</h2>
              <div className="flex items-center space-x-2 px-3 py-1 bg-neon-green/10 rounded-full border border-neon-green/20">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-neon"></div>
                <span className="text-xs text-neon-green font-medium">自動更新中</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleIssues.map((issue, index) => (
                <div 
                  key={issue.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <WeeklyIssueCard issue={issue} />
                </div>
              ))}
            </div>
          </div>

          {/* 空の状態 */}
          {sampleIssues.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  まだ週刊号がありません
                </h3>
                <p className="text-muted-foreground mb-6">
                  最初の週刊号を作成して、TOFUラボの情報をまとめましょう
                </p>
                <Button asChild className="gradient-neon border-0 shadow-neon">
                  <Link to="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    新しい週刊号を作成
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
