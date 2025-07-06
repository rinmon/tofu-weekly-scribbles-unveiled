import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/30 shadow-dark">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 検索バー */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="週刊号を検索..."
                className="pl-10 bg-background/50 border-border/50 hover-neon focus:border-neon-blue"
              />
            </div>
          </div>

          {/* 右側メニュー */}
          <div className="flex items-center space-x-4">
            {/* 通知 */}
            <Button variant="ghost" size="sm" className="relative hover-glow">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* ユーザー */}
            <Button variant="ghost" size="sm" className="hover-glow">
              <User className="h-5 w-5" />
            </Button>

            {/* ステータス */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/30 rounded-full border border-border/30">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-neon"></div>
              <span className="text-xs text-neon-green font-medium">オンライン</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};