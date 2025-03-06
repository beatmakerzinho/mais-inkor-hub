
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase, hasSupabaseCredentials } from "@/lib/supabase";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Gamificacao from "./pages/Gamificacao";
import Marketing from "./pages/Marketing";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Questionarios from "./pages/Questionarios";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    console.log("App mounted");
    console.log("Has Supabase credentials:", hasSupabaseCredentials());
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase auth event: ${event}`, session);
      if (event === 'SIGNED_IN') {
        toast({
          title: "Login realizado",
          description: "Você está conectado",
        });
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado",
        });
      }
    });

    setIsInitialized(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (!isInitialized) {
    return <div className="flex min-h-screen items-center justify-center">Carregando aplicação...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/gamificacao" element={<Gamificacao />} />
              <Route path="/questionarios" element={<Questionarios />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
