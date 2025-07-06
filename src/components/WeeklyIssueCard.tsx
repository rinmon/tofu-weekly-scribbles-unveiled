import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface WeeklyIssue {
  id: string;
  title: string;
  week: string;
  date: string;
  summary: string;
  highlights: string[];
  sources: {
    discord: number;
    website: number;
    youtube: number;
  };
  status: "draft" | "published";
}

interface WeeklyIssueCardProps {
  issue: WeeklyIssue;
}

export const WeeklyIssueCard = ({ issue }: WeeklyIssueCardProps) => {
  return (
    <Card className="group hover:shadow-tofu-medium transition-all duration-300 border-border/50 hover:border-primary/20">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {issue.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {issue.week} - {issue.date}
            </p>
          </div>
          <Badge 
            variant={issue.status === "published" ? "default" : "secondary"}
            className="shrink-0"
          >
            {issue.status === "published" ? "公開済み" : "下書き"}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {issue.highlights.slice(0, 3).map((highlight, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {highlight}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-tofu-blue">
              {issue.sources.discord}
            </div>
            <div className="text-xs text-muted-foreground">Discord</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-tofu-purple">
              {issue.sources.website}
            </div>
            <div className="text-xs text-muted-foreground">サイト</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-destructive">
              {issue.sources.youtube}
            </div>
            <div className="text-xs text-muted-foreground">YouTube</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/issue/${issue.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            詳細を見る
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/issue/${issue.id}/edit`}>
            <MessageSquare className="w-4 h-4 mr-2" />
            編集
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};