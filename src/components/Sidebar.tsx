import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Database, 
  Edit3, 
  History, 
  Settings, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "ダッシュボード", href: "/", icon: Home },
  { name: "情報収集", href: "/collect", icon: Database },
  { name: "編集", href: "/edit", icon: Edit3 },
  { name: "投稿履歴", href: "/history", icon: History },
  { name: "設定", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border/50 transition-all duration-300 ease-in-out relative",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-neon rounded-lg flex items-center justify-center animate-glow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">TOFUラボ</h1>
                <p className="text-xs text-muted-foreground">週刊情報誌</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 hover-glow"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="p-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-secondary/50 hover-glow",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 glow-neon-blue" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && (
                <span className="animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* クイックアクション */}
      <div className="absolute bottom-4 left-2 right-2">
        <Button 
          asChild 
          className={cn(
            "w-full gradient-neon hover:opacity-90 border-0 shadow-neon",
            collapsed && "px-2"
          )}
        >
          <Link to="/create">
            <PlusCircle className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && <span>新規作成</span>}
          </Link>
        </Button>
      </div>

      {/* ステータスインジケーター */}
      {!collapsed && (
        <div className="absolute bottom-16 left-4 right-4">
          <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">システム状態</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-neon"></div>
                <span className="text-neon-green font-medium">正常</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};