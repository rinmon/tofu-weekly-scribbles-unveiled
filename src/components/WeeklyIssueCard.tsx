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
    <Card className="group hover-neon transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-blue/50 shadow-dark">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-neon-blue transition-colors">
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
          <div className="space-y-1 p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
            <div className="text-lg font-semibold text-neon-blue">
              {issue.sources.discord}
            </div>
            <div className="text-xs text-muted-foreground">Discord</div>
          </div>
          <div className="space-y-1 p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
            <div className="text-lg font-semibold text-neon-purple">
              {issue.sources.website}
            </div>
            <div className="text-xs text-muted-foreground">サイト</div>
          </div>
          <div className="space-y-1 p-2 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
            <div className="text-lg font-semibold text-neon-pink">
              {issue.sources.youtube}
            </div>
            <div className="text-xs text-muted-foreground">YouTube</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild className="hover-glow">
          <Link to={`/issue/${issue.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            詳細を見る
          </Link>
        </Button>
        <Button size="sm" asChild className="gradient-neon border-0 shadow-neon">
          <Link to={`/issue/${issue.id}/edit`}>
            <MessageSquare className="w-4 h-4 mr-2" />
            編集
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};