
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SideNavigation } from "./SideNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
