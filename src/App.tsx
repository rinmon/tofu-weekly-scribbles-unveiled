import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/LoginForm";
import Index from "./pages/Index";
import CreateIssue from "./pages/CreateIssue";
import IssueDetail from "./pages/IssueDetail";
import DataCollection from "./pages/DataCollection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  console.log('AuthenticatedApp - Loading:', loading, 'User:', user?.email)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 gradient-neon rounded-2xl flex items-center justify-center mx-auto animate-glow">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground">システムを準備中...</p>
          <p className="text-xs text-muted-foreground">認証状態を確認しています</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, showing login form')
    return <LoginForm />;
  }

  console.log('User authenticated, showing main app')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create" element={<CreateIssue />} />
        <Route path="/collect" element={<DataCollection />} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthenticatedApp />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
