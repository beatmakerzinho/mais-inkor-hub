
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Plus, Users } from "lucide-react";
import { CreateQuestionarioModal } from "@/components/modals/CreateQuestionarioModal";
import { useQuestionarios } from "@/hooks/useQuestionarios";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Questionarios() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { questionarios, isLoading } = useQuestionarios();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <MainLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg grid place-items-center">
              <FileQuestion className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Questionários</h1>
              <p className="text-sm text-gray-500">
                Crie e gerencie questionários para o programa de gamificação
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Questionário
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : questionarios && questionarios.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {questionarios.map((questionario) => (
              <Card key={questionario.id}>
                <CardHeader>
                  <CardTitle>{questionario.titulo}</CardTitle>
                  <CardDescription>
                    {questionario.descricao?.substring(0, 100)}
                    {questionario.descricao && questionario.descricao.length > 100 ? '...' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{questionario.respostas || 0} respostas</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Pontos:</span> {questionario.pontos}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Nenhum questionário encontrado</CardTitle>
              <CardDescription>
                Crie o primeiro questionário para o programa de gamificação
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Questionário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateQuestionarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
