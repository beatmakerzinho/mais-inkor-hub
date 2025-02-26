
import { MainLayout } from "@/components/layout/MainLayout";

export default function Index() {
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
      </div>
    </MainLayout>
  );
}
