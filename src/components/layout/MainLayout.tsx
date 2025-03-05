
import { useState, useEffect } from "react";
import { Menu, X, Plus, Package, Trophy, Share2 } from "lucide-react";
import { SideNavigation } from "./SideNavigation";
import { useLocation } from "react-router-dom";
import { CreateMissaoModal } from "@/components/modals/CreateMissaoModal";
import { CreateProdutoModal } from "@/components/modals/CreateProdutoModal";
import { CreateMaterialModal } from "@/components/modals/CreateMaterialModal";
import { AuthForm } from "@/components/auth/AuthForm";
import { supabase } from "@/lib/supabase";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Verificar estado inicial de autenticação
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Escutar mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log("Auth state:", { isAuthenticated, loading });

  const getAddButtonLabel = () => {
    switch (location.pathname) {
      case "/produtos":
        return "Adicionar Produto";
      case "/gamificacao":
        return "Criar Missão";
      case "/marketing":
        return "Adicionar Material";
      default:
        return "Adicionar";
    }
  };

  const getAddButtonIcon = () => {
    switch (location.pathname) {
      case "/produtos":
        return <Package className="w-5 h-5" />;
      case "/gamificacao":
        return <Trophy className="w-5 h-5" />;
      case "/marketing":
        return <Share2 className="w-5 h-5" />;
      default:
        return <Plus className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mais-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 grid place-items-center">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-sm border border-gray-200"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 h-screen bg-white border-r border-gray-200 shadow-sm z-40`}
        >
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="w-8 h-8 bg-mais-600 rounded-lg grid place-items-center">
              <span className="text-white font-semibold">M</span>
            </div>
            <span className="font-semibold text-gray-900">MAIS INKOR</span>
          </div>
          <SideNavigation onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64 pb-24">
          <div className="container py-8 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Modals */}
      {location.pathname === "/produtos" && (
        <CreateProdutoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
      {location.pathname === "/gamificacao" && (
        <CreateMissaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
      {location.pathname === "/marketing" && (
        <CreateMaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Bottom Menu - Only show for authenticated users and on relevant pages */}
      {isAuthenticated && location.pathname !== "/" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:left-64 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-mais-600 text-white px-4 py-3 rounded-lg hover:bg-mais-700 transition-colors"
            >
              {getAddButtonIcon()}
              <span className="font-medium">{getAddButtonLabel()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
