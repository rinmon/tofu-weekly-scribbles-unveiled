import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit3, Share, Calendar, Eye, MessageSquare, ExternalLink } from "lucide-react";

// サンプルデータ（実際の実装ではAPIから取得）
const sampleIssue = {
  id: "2",
  title: "TOFUラボ週刊号 #2",
  week: "2024年1月第2週",
  date: "2024/01/08 - 2024/01/14",
  summary: "KINOKAテンプレートがリリースされ、和風デザインに関する議論が盛り上がりました。また、SEO対策についてのワークショップも開催されました。",
  highlights: ["KINOKAテンプレート", "和風デザイン", "SEO対策", "ワークショップ"],
  sources: {
    discord: 22,
    website: 5,
    youtube: 1
  },
  status: "published" as const,
  publishedDate: "2024/01/15",
  wordpressUrl: "https://blog.tofulab.app/weekly-2",
  content: `
# TOFUラボ週刊号 #2

## 今週のハイライト

### 🎨 KINOKAテンプレート リリース

今週、待望の和風デザインテンプレート「KINOKA」がリリースされました。

**特徴:**
- さりげないあしらいが印象的な和デザイン
- モバイルファーストのレスポンシブデザイン
- Elementorで完全カスタマイズ可能

### 💬 Discord ハイライト

**和風デザインについての議論**
- 「日本の伝統色の使い方について」
- 「モダンと和の融合テクニック」
- 「KINOKAテンプレートの活用事例」

**技術的な話題**
- WordPressの高速化テクニック
- Elementorの新機能について
- SEO対策の最新情報

### 📺 YouTube 更新情報

**新着動画:**
- 「和風サイトの作り方 - KINOKAテンプレート解説」
  - 再生回数: 1,200回
  - 高評価: 98%

### 🌐 ウェブサイト更新

**新規記事:**
- 「2024年のWebデザイントレンド」
- 「SEO対策の基本と応用」
- 「Elementorプロの使い方ガイド」

**テンプレート更新:**
- KINOKAテンプレート v1.0 リリース
- 既存テンプレートのバグ修正

## コミュニティ統計

- 新規メンバー: 15名
- 投稿数: 156件  
- 質問解決数: 23件
- ワークショップ参加者: 42名

## 来週の予定

- FLEURテンプレートの制作開始予定
- SEO対策ワークショップ開催
- コミュニティイベント企画

---

*TOFUラボコミュニティで一緒に学びませんか？*  
[コミュニティに参加する](https://community.tofulab.app/)
  `
};

const IssueDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/30 shadow-dark">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover-glow">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-foreground">{sampleIssue.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {sampleIssue.week} - {sampleIssue.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={sampleIssue.status === "published" ? "default" : "secondary"}
                className="gradient-neon-alt border-0"
              >
                {sampleIssue.status === "published" ? "公開済み" : "下書き"}
              </Badge>
              <Button variant="outline" size="sm" className="hover-glow">
                <Share className="w-4 h-4 mr-2" />
                共有
              </Button>
              <Button size="sm" asChild className="gradient-neon border-0 shadow-neon">
                <Link to={`/issue/${id}/edit`}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  編集
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3 space-y-6">
            {/* 要約カード */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle className="flex items-center text-neon-blue">
                  <Eye className="w-5 h-5 mr-2" />
                  要約
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{sampleIssue.summary}</p>
              </CardContent>
            </Card>

            {/* ハイライト */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle className="flex items-center text-neon-purple">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  今週のハイライト
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sampleIssue.highlights.map((highlight, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 記事内容 */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle>記事内容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                    {sampleIssue.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 統計情報 */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle className="text-sm">情報ソース</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                  <span className="text-sm text-muted-foreground">Discord</span>
                  <span className="font-semibold text-neon-blue">{sampleIssue.sources.discord}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                  <span className="text-sm text-muted-foreground">ウェブサイト</span>
                  <span className="font-semibold text-neon-purple">{sampleIssue.sources.website}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                  <span className="text-sm text-muted-foreground">YouTube</span>
                  <span className="font-semibold text-neon-pink">{sampleIssue.sources.youtube}</span>
                </div>
              </CardContent>
            </Card>

            {/* 投稿情報 */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle className="text-sm">投稿情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">投稿日:</span>
                  <span className="text-foreground">{sampleIssue.publishedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ステータス:</span>
                  <Badge variant="default" className="gradient-neon-alt border-0 text-xs">
                    {sampleIssue.status === "published" ? "公開済み" : "下書き"}
                  </Badge>
                </div>
                {sampleIssue.wordpressUrl && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover-glow"
                  >
                    <a href={sampleIssue.wordpressUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      WordPressで見る
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* クイックアクション */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-dark">
              <CardHeader>
                <CardTitle className="text-sm">クイックアクション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover-glow"
                >
                  <Link to={`/issue/${id}/edit`}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    編集
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover-glow"
                >
                  <Share className="w-4 h-4 mr-2" />
                  共有
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;