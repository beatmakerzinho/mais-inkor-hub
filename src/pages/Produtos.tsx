
import { MainLayout } from "@/components/layout/MainLayout";
import { Search } from "lucide-react";

export default function Produtos() {
  return (
    <MainLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Lista de Produtos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualize e pesquise todos os produtos da empresa
            </p>
          </div>
        </div>
        
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mais-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4" />
              <span className="px-2.5 py-0.5 text-xs font-medium text-mais-700 bg-mais-50 rounded-full">
                Categoria
              </span>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Produto exemplo {i}</h3>
              <p className="mt-1 text-sm text-gray-500">Descrição breve do produto...</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
