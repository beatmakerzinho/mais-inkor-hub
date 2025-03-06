
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Image, Download, Plus, File } from "lucide-react";
import { CreateMaterialModal } from "@/components/modals/CreateMaterialModal";
import { useMarketing } from "@/hooks/useMarketing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Marketing() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { materiais, isLoading } = useMarketing();
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg grid place-items-center">
              <File className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Mídias de Marketing</h1>
              <p className="mt-1 text-sm text-gray-500">
                Acesse e compartilhe materiais de divulgação
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <Skeleton className="w-full aspect-video rounded-lg mb-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="w-32 h-5 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : materiais && materiais.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.map((material) => (
              <div
                key={material.id}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full grid place-items-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{material.titulo}</h3>
                    <p className="text-sm text-gray-500">{material.tipo}</p>
                  </div>
                  <a 
                    href={material.arquivo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-mais-600 transition-colors"
                    download
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500">Nenhum material de marketing cadastrado</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Material
            </Button>
          </div>
        )}
      </div>

      <CreateMaterialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
