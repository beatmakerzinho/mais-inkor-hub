
import { SideNavigation } from "./SideNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed w-64 h-screen bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="w-8 h-8 bg-mais-600 rounded-lg grid place-items-center">
              <span className="text-white font-semibold">M</span>
            </div>
            <span className="font-semibold text-gray-900">MAIS INKOR</span>
          </div>
          <SideNavigation />
        </div>

        {/* Main content */}
        <main className="flex-1 ml-64">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
