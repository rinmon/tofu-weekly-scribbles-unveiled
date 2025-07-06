import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Search, LogOut, Settings, Database, Plus, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/30 shadow-dark">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* ナビゲーション */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-neon rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg text-foreground hidden md:block">
                TOFUラボ
              </span>
            </Link>
            
            <nav className="flex items-center space-x-2">
              <Link to="/">
                <Button 
                  variant={isActiveRoute('/') ? 'default' : 'ghost'}
                  size="sm"
                  className={isActiveRoute('/') ? 'gradient-primary' : 'hover-glow'}
                >
                  <Home className="w-4 h-4 mr-2" />
                  ホーム
                </Button>
              </Link>
              
              <Link to="/collect">
                <Button 
                  variant={isActiveRoute('/collect') ? 'default' : 'ghost'}
                  size="sm"
                  className={isActiveRoute('/collect') ? 'gradient-primary' : 'hover-glow'}
                >
                  <Database className="w-4 h-4 mr-2" />
                  データ収集
                </Button>
              </Link>
              
              <Link to="/create">
                <Button 
                  variant={isActiveRoute('/create') ? 'default' : 'ghost'}
                  size="sm"
                  className={isActiveRoute('/create') ? 'gradient-primary' : 'hover-glow'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  週刊号作成
                </Button>
              </Link>
            </nav>
          </div>

          {/* 検索バー */}
          <div className="flex-1 max-w-md mx-8">
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

            {/* ユーザーメニュー */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-glow">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-card border-border/50 shadow-dark"
              >
                <DropdownMenuLabel className="text-foreground">
                  アカウント
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-secondary/50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>設定</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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