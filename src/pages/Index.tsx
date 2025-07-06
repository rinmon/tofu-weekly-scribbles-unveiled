import { Header } from "@/components/Header";
import { WeeklyIssueCard } from "@/components/WeeklyIssueCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* ヒーローセクション */}
      <section className="gradient-light py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              TOFUラボ週刊情報誌
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up">
              Discord、ウェブサイト、YouTubeからの情報を収集し、<br />
              毎週の話題とハイライトをまとめた情報誌です
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button size="lg" asChild>
                <Link to="/create">
                  <Plus className="w-5 h-5 mr-2" />
                  新しい週刊号を作成
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                今週のハイライト
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* 検索・フィルターセクション */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="週刊号を検索..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </Button>
              <div className="flex gap-2">
                <Badge variant="outline">全て (3)</Badge>
                <Badge variant="secondary">公開済み (2)</Badge>
                <Badge variant="outline">下書き (1)</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-tofu border">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">総週刊号数</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-tofu border">
            <div className="text-2xl font-bold text-tofu-blue">55</div>
            <div className="text-sm text-muted-foreground">Discord投稿</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-tofu border">
            <div className="text-2xl font-bold text-tofu-purple">12</div>
            <div className="text-sm text-muted-foreground">サイト更新</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-tofu border">
            <div className="text-2xl font-bold text-destructive">6</div>
            <div className="text-sm text-muted-foreground">YouTube動画</div>
          </div>
        </div>

        {/* 週刊号一覧 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">最新の週刊号</h2>
            <Button variant="outline" asChild>
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                新規作成
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleIssues.map((issue) => (
              <div key={issue.id} className="animate-slide-up">
                <WeeklyIssueCard issue={issue} />
              </div>
            ))}
          </div>
        </div>

        {/* 空の状態 */}
        {sampleIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                まだ週刊号がありません
              </h3>
              <p className="text-muted-foreground mb-6">
                最初の週刊号を作成して、TOFUラボの情報をまとめましょう
              </p>
              <Button asChild>
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
  );
};

export default Index;
