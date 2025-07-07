import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { WeeklyIssueForm } from "@/components/WeeklyIssueForm";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyIssue } from "@/integrations/supabase/custom-types";
import { useToast } from "@/hooks/use-toast";

const IssueEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issue, setIssue] = useState<WeeklyIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("weekly_issues")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      toast({
        title: "データ取得エラー",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    setIssue({ ...data, status: data.status as 'draft' | 'published' | 'archived' });
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }
  if (!issue) {
    return <div className="p-8 text-center text-destructive">週刊号が見つかりません</div>;
  }

  // WeeklyIssueFormに初期値と編集モードを渡す（未実装なら今後拡張）
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WeeklyIssueForm initialData={issue} mode="edit" />
      </div>
    </div>
  );
};

export default IssueEdit;
