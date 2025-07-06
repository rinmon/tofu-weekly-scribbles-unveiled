import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit3, Share, Calendar, Eye, MessageSquare, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyIssue, CollectedData } from "@/integrations/supabase/custom-types";
import { useToast } from "@/hooks/use-toast";

interface WeeklyIssueWithStats extends WeeklyIssue {
  sources?: {
    discord: number;
    website: number;
    youtube: number;
  };
}

const IssueDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [issue, setIssue] = useState<WeeklyIssueWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchIssueData();
  }, [id]);

  const fetchIssueData = async () => {
    try {
      // 週刊号のデータを取得
      const { data: issueData, error: issueError } = await supabase
        .from('weekly_issues')
        .select('*')
        .eq('id', id)
        .single();

      if (issueError) throw issueError;

      // ソース統計を取得
      const { data: sources } = await supabase
        .from('collected_data')
        .select('source_type')
        .eq('issue_id', id);

      const stats = (sources || []).reduce(
        (acc, item) => {
          acc[item.source_type] = (acc[item.source_type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      setIssue({
        ...issueData,
        status: issueData.status as 'draft' | 'published' | 'archived',
        sources: {
          discord: stats.discord || 0,
          website: stats.website || 0,
          youtube: stats.youtube || 0
        }
      } as WeeklyIssueWithStats);
    } catch (error: any) {
      toast({
        title: "データの取得に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 gradient-neon rounded-2xl flex items-center justify-center mx-auto animate-glow">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">週刊号を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">週刊号が見つかりません</h2>
          <p className="text-muted-foreground">指定された週刊号は存在しないか、削除された可能性があります。</p>
          <Button asChild className="gradient-neon border-0 shadow-neon">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ダッシュボードに戻る
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-foreground">{issue.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {issue.week_period} - {issue.start_date} ～ {issue.end_date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={issue.status === "published" ? "default" : "secondary"}
                className="gradient-neon-alt border-0"
              >
                {issue.status === "published" ? "公開済み" : "下書き"}
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
                <p className="text-foreground leading-relaxed">{issue.summary || "要約がありません。"}</p>
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
                  {issue.highlights && issue.highlights.length > 0 ? (
                    issue.highlights.map((highlight, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                      >
                        {highlight}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">ハイライトがありません。</p>
                  )}
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
                    {issue.content?.raw || "記事内容がありません。"}
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
                  <span className="font-semibold text-neon-blue">{issue.sources?.discord || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                  <span className="text-sm text-muted-foreground">ウェブサイト</span>
                  <span className="font-semibold text-neon-purple">{issue.sources?.website || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                  <span className="text-sm text-muted-foreground">YouTube</span>
                  <span className="font-semibold text-neon-pink">{issue.sources?.youtube || 0}</span>
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
                  <span className="text-muted-foreground">作成日:</span>
                  <span className="text-foreground">{new Date(issue.created_at).toLocaleDateString('ja-JP')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">更新日:</span>
                  <span className="text-foreground">{new Date(issue.updated_at).toLocaleDateString('ja-JP')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ステータス:</span>
                  <Badge variant="default" className="gradient-neon-alt border-0 text-xs">
                    {issue.status === "published" ? "公開済み" : "下書き"}
                  </Badge>
                </div>
                {issue.wordpress_url && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover-glow"
                  >
                    <a href={issue.wordpress_url} target="_blank" rel="noopener noreferrer">
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