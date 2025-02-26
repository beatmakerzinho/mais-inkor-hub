
import { MainLayout } from "@/components/layout/MainLayout";
import { Image, Download } from "lucide-react";

export default function Marketing() {
  return (
    <MainLayout>
      <div className="animate-fadeIn">
        <h1 className="text-2xl font-semibold text-gray-900">Mídias de Marketing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Acesse e compartilhe materiais de divulgação
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full grid place-items-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Material {i}</h3>
                  <p className="text-sm text-gray-500">Mídia de divulgação</p>
                </div>
                <button className="p-2 text-gray-500 hover:text-mais-600 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
