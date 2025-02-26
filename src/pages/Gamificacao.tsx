
import { MainLayout } from "@/components/layout/MainLayout";
import { Trophy, Star, Target } from "lucide-react";

export default function Gamificacao() {
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

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gradient-to-br from-mais-500 to-mais-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5" />
              <span className="font-medium">Seus Pontos</span>
            </div>
            <p className="mt-4 text-3xl font-bold">0</p>
            <p className="mt-1 text-sm text-mais-100">Posição: #1</p>
          </div>

          {/* Missões disponíveis */}
          <div className="col-span-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Missões Disponíveis</h2>
            <div className="grid gap-4">
              {[
                "Responder questionário sobre produtos",
                "Fazer check-in no evento mensal",
                "Manter 100% de presença essa semana",
              ].map((mission, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="w-10 h-10 bg-mais-50 rounded-lg grid place-items-center">
                    <Target className="w-5 h-5 text-mais-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mission}</p>
                    <p className="text-sm text-gray-500">+50 pontos</p>
                  </div>
                  <button className="px-3 py-1 text-sm font-medium text-mais-600 bg-mais-50 rounded-lg hover:bg-mais-100 transition-colors">
                    Iniciar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
