
import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { Trophy, Star, Target, FileQuestion, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { CreateMissaoModal } from "@/components/modals/CreateMissaoModal";
import { useMissoes } from "@/hooks/useMissoes";
import { usePontuacao } from "@/hooks/usePontuacao";
import { Link, useNavigate } from "react-router-dom";

export default function Gamificacao() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { missoes, isLoading: missaoLoading } = useMissoes();
  const { pontuacao, isLoading: pontuacaoLoading, userRank } = usePontuacao();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-full" />
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-mais-100 rounded-xl grid place-items-center">
            <Trophy className="w-6 h-6 text-mais-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gamificação</h1>
            <p className="text-sm text-gray-500">Complete missões e ganhe recompensas</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-gradient-to-br from-mais-500 to-mais-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5" />
              <span className="font-medium">Seus Pontos</span>
            </div>
            {pontuacaoLoading ? (
              <div className="mt-4 animate-pulse">
                <div className="h-8 w-24 bg-white/20 rounded"></div>
                <div className="mt-1 h-5 w-16 bg-white/20 rounded"></div>
              </div>
            ) : (
              <>
                <p className="mt-4 text-3xl font-bold">{pontuacao?.pontos || 0}</p>
                <p className="mt-1 text-sm text-mais-100">
                  Posição: #{userRank >= 0 ? userRank + 1 : '?'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <FileQuestion className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Questionários</span>
            </div>
            <p className="mt-4 text-3xl font-bold">Desafie-se</p>
            <p className="mt-1 text-sm text-gray-500">
              Responda questionários e ganhe pontos extras
            </p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link to="/questionarios">Ver Questionários</Link>
            </Button>
          </div>
        </div>

        {/* Missões disponíveis */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Missões Disponíveis</h2>
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Criar Missão
            </Button>
          )}
        </div>
        
        {missaoLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : missoes && missoes.length > 0 ? (
          <div className="grid gap-4">
            {missoes.map((mission) => (
              <div
                key={mission.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="w-10 h-10 bg-mais-50 rounded-lg grid place-items-center">
                  <Target className="w-5 h-5 text-mais-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{mission.titulo}</p>
                  <p className="text-sm text-gray-500">+{mission.pontos} pontos</p>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-mais-600 bg-mais-50 rounded-lg hover:bg-mais-100 transition-colors">
                  Iniciar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Nenhuma missão disponível</CardTitle>
              <CardDescription>
                As novas missões serão adicionadas em breve
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <CreateMissaoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
