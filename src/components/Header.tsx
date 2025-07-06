import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b shadow-tofu">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TOFUラボ</h1>
              <p className="text-sm text-muted-foreground">週刊情報誌</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              週刊号一覧
            </Link>
            <Link 
              to="/create" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              新しい号を作成
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/">
                <Calendar className="w-4 h-4 mr-2" />
                今週の号
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">新規作成</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};