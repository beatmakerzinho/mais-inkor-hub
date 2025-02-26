
import { useState } from "react";
import { Menu, X, Plus, Package, Trophy, Share2 } from "lucide-react";
import { SideNavigation } from "./SideNavigation";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

// This would typically come from an auth system
const isAdmin = true; // Temporary flag for demonstration

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

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
          <div className="container py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Menu - Only show for admin and on relevant pages */}
      {isAdmin && location.pathname !== "/" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:left-64 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => {
                // This would typically open a modal or navigate to an add form
                console.log("Add button clicked:", getAddButtonLabel());
              }}
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
