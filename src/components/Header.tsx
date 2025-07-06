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
import { Bell, User, Search, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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