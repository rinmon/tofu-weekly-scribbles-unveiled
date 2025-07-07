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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekPeriod, setWeekPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [canSave, setCanSave] = useState(true);

  // 週番号・期間の自動計算
  const calculateWeekInfo = (date: Date | null) => {
    if (!date) {
      setWeek("");
      setWeekPeriod("");
      setStartDate("");
      setEndDate("");
      return;
    }
    // ISO週番号（日本式：月曜始まり）
    const getWeekNumber = (d: Date) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = (date.getUTCDay() + 6) % 7; // 月曜=0
      date.setUTCDate(date.getUTCDate() - dayNum + 3);
      const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
      const weekNum = 1 + Math.round(
        ((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
      );
      return weekNum;
    };

    const weekNum = getWeekNumber(date);
    const year = date.getFullYear();
    setWeek(`${year}-W${weekNum.toString().padStart(2, "0")}`);

    // 週の開始日（月曜）
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - dayOfWeek + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setStartDate(monday.toISOString().split('T')[0]);
    setEndDate(sunday.toISOString().split('T')[0]);
    setWeekPeriod(`${monday.toISOString().split('T')[0]} ～ ${sunday.toISOString().split('T')[0]}`);
  };

  // 入力時重複チェック
  const checkDuplicate = async (value: string, field: 'week' | 'title') => {
    if (!value) {
      setDuplicateWarning("");
      setCanSave(true);
      return;
    }
    const { data } = await supabase
      .from('weekly_issues')
      .select('*')
      .eq(field, value);
    if (data && data.length > 0) {
      setDuplicateWarning(`${field === 'week' ? '週' : 'タイトル'}が既に存在します`);
      setCanSave(false);
    } else {
      setDuplicateWarning("");
      setCanSave(true);
    }
  };

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
    if (!title || !week || !summary || !startDate || !endDate) {
      toast({
        title: "入力エラー",
        description: "タイトル、週、要約、期間は必須項目です。",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 週刊号をSupabaseに保存
      const { data, error } = await supabase
        .from('weekly_issues')
        .insert({
          title,
          week_period: weekPeriod,
          week,
          start_date: startDate,
          end_date: endDate,
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
            {duplicateWarning && (
              <span className="text-destructive text-sm ml-4">{duplicateWarning}</span>
            )}
            <PlusCircle className="w-5 h-5 text-primary" />
            新しい週刊号を作成
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="week">対象週（開始日を選択）</Label>
              <Input
                id="week"
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ""}
                onChange={e => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  setSelectedDate(date);
                  calculateWeekInfo(date);
                  // タイトル自動生成もここで
                  if (date) {
                    const weekNum = (() => {
                      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                      const dayNum = (d.getUTCDay() + 6) % 7;
                      d.setUTCDate(d.getUTCDate() - dayNum + 3);
                      const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
                      return 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
                    })();
                    setTitle(`TOFUラボ週刊情報誌（${date.getFullYear()}年第${weekNum}週）`);
                  }
                }}
              />
              {weekPeriod && (
                <div className="text-sm text-muted-foreground">
                  週番号: <span className="font-mono">{week}</span> ／ 期間: <span className="font-mono">{weekPeriod}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  checkDuplicate(e.target.value, 'title');
                }}
                placeholder="例: TOFUラボ週刊情報誌（2025年第27週）"
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
        <Button onClick={handleSave} disabled={isLoading || !canSave}>
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