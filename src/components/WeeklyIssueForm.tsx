import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Source {
  id: string;
  type: "discord" | "website" | "youtube";
  title: string;
  content: string;
  url?: string;
  date: string;
}

export const WeeklyIssueForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [summary, setSummary] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const addSource = (type: "discord" | "website" | "youtube") => {
    const newSource: Source = {
      id: `${type}-${Date.now()}`,
      type,
      title: "",
      content: "",
      url: "",
      date: new Date().toISOString().split('T')[0]
    };
    setSources([...sources, newSource]);
  };

  const updateSource = (id: string, field: keyof Source, value: string) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const removeSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const handleSave = async () => {
    if (!title || !week || !summary) {
      toast({
        title: "入力エラー",
        description: "タイトル、週、要約は必須項目です。",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 週の期間から開始日と終了日を計算（簡易版）
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // 週刊号をSupabaseに保存
      const { data, error } = await supabase
        .from('weekly_issues')
        .insert({
          title,
          week_period: week,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          summary,
          highlights,
          content: JSON.parse(JSON.stringify({ 
            raw: content,
            sources: sources 
          })),
          status: 'draft',
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "保存完了",
        description: "週刊号が正常に保存されました。"
      });

      // ダッシュボードに戻る
      navigate('/');
    } catch (error: any) {
      toast({
        title: "保存エラー",
        description: error.message || "保存中にエラーが発生しました。",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            新しい週刊号を作成
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="TOFUラボ週刊号 #1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="week">週</Label>
              <Input
                id="week"
                placeholder="2024年1月第1週"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">要約</Label>
            <Textarea
              id="summary"
              placeholder="今週のTOFUラボの主要なトピックや出来事を簡潔にまとめてください"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>ハイライト</Label>
            <div className="flex gap-2">
              <Input
                placeholder="重要なトピックやキーワードを追加"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHighlight()}
              />
              <Button onClick={addHighlight} size="sm">
                追加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {highlight}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeHighlight(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>情報ソース</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="discord" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="discord">Discord</TabsTrigger>
              <TabsTrigger value="website">ウェブサイト</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
            </TabsList>

            <TabsContent value="discord" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Discord の情報</h3>
                <Button onClick={() => addSource("discord")} size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
              {sources.filter(s => s.type === "discord").map(source => (
                <SourceEditor 
                  key={source.id} 
                  source={source} 
                  onUpdate={updateSource}
                  onRemove={removeSource}
                />
              ))}
            </TabsContent>

            <TabsContent value="website" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">ウェブサイトの情報</h3>
                <Button onClick={() => addSource("website")} size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
              {sources.filter(s => s.type === "website").map(source => (
                <SourceEditor 
                  key={source.id} 
                  source={source} 
                  onUpdate={updateSource}
                  onRemove={removeSource}
                />
              ))}
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">YouTube の情報</h3>
                <Button onClick={() => addSource("youtube")} size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  追加
                </Button>
              </div>
              {sources.filter(s => s.type === "youtube").map(source => (
                <SourceEditor 
                  key={source.id} 
                  source={source} 
                  onUpdate={updateSource}
                  onRemove={removeSource}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>記事内容</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="週刊号の詳細な内容をMarkdown形式で入力してください..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="font-mono"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          プレビュー
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
};

const SourceEditor = ({ 
  source, 
  onUpdate, 
  onRemove 
}: { 
  source: Source; 
  onUpdate: (id: string, field: keyof Source, value: string) => void;
  onRemove: (id: string) => void;
}) => (
  <Card className="p-4">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          <Input
            placeholder="タイトル"
            value={source.title}
            onChange={(e) => onUpdate(source.id, "title", e.target.value)}
          />
          <Input
            placeholder="URL (オプション)"
            value={source.url || ""}
            onChange={(e) => onUpdate(source.id, "url", e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(source.id)}
          className="text-destructive hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Textarea
        placeholder="内容や要約"
        value={source.content}
        onChange={(e) => onUpdate(source.id, "content", e.target.value)}
        rows={3}
      />
    </div>
  </Card>
);