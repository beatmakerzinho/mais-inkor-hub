
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Search, Plus, Package2 } from "lucide-react";
import { CreateProdutoModal } from "@/components/modals/CreateProdutoModal";
import { useProdutos } from "@/hooks/useProdutos";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Produtos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { produtos, isLoading } = useProdutos();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    navigate("/login");
    return null;
  }

  const filteredProdutos = produtos?.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg grid place-items-center">
              <Package2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Lista de Produtos</h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualize e pesquise todos os produtos da empresa
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
        
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mais-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <Skeleton className="w-24 h-5 rounded-full mb-2" />
                <Skeleton className="w-full h-6 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        ) : filteredProdutos && filteredProdutos.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProdutos.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div 
                  className="w-full h-48 bg-gray-100 rounded-lg mb-4 bg-cover bg-center"
                  style={produto.imagem_url ? { backgroundImage: `url(${produto.imagem_url})` } : {}}
                />
                <span className="px-2.5 py-0.5 text-xs font-medium text-mais-700 bg-mais-50 rounded-full">
                  {produto.categoria}
                </span>
                <h3 className="mt-2 text-lg font-medium text-gray-900">{produto.nome}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {produto.descricao?.substring(0, 100)}
                  {produto.descricao && produto.descricao.length > 100 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum produto encontrado para esta busca' : 'Nenhum produto cadastrado'}
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        )}
      </div>

      <CreateProdutoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </MainLayout>
  );
}
