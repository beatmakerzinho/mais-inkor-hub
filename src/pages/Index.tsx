
import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log("Index page rendered");
  }, []);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto text-center animate-fadeIn">
        <span className="px-3 py-1 text-sm font-medium text-mais-700 bg-mais-50 rounded-full">
          Bem-vindo ao MAIS INKOR
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Sistema Interno
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Acesse produtos, participe do programa de gamificação e compartilhe materiais de marketing.
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Configuração do Supabase</h2>
          <p className="text-sm text-gray-600 mb-4">
            Para utilizar todas as funcionalidades, conecte este projeto ao Supabase.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
