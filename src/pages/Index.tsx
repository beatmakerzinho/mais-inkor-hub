
import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { hasSupabaseCredentials, signOut } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LogOut, User } from "lucide-react";

export default function Index() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Index page rendered", { user, isAuthenticated, loading });
  }, [user, isAuthenticated, loading]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto text-center animate-fadeIn">
        <span className="px-3 py-1 text-sm font-medium text-mais-700 bg-mais-50 rounded-full">
          Bem-vindo ao MAIS INKOR
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Sistema Interno
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Acesse produtos, participe do programa de gamificação e compartilhe materiais de marketing.
        </p>

        {!hasSupabaseCredentials() && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800">Configuração do Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700">
                Para utilizar todas as funcionalidades, conecte este projeto ao Supabase fornecendo as
                credenciais no arquivo .env: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="mt-8 p-4 text-center">
            <div className="animate-pulse">Carregando...</div>
          </div>
        ) : isAuthenticated ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sua Conta</CardTitle>
                <CardDescription>
                  Informações sobre seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full grid place-items-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-sm text-gray-500">ID: {user?.id.substring(0, 8)}...</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acesso Rápido</CardTitle>
                <CardDescription>
                  Acesse as principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" className="justify-between">
                  <Link to="/produtos">
                    Produtos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link to="/gamificacao">
                    Gamificação
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link to="/questionarios">
                    Questionários
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link to="/marketing">
                    Marketing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Acesso ao Sistema</CardTitle>
                <CardDescription>
                  Faça login para acessar todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-2">
                <Button asChild size="lg">
                  <Link to="/login">
                    Fazer Login / Criar Conta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
