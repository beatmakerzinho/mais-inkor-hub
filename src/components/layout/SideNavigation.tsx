
import { Home, Package, Trophy, Share2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Gamificação", href: "/gamificacao", icon: Trophy },
  { name: "Marketing", href: "/marketing", icon: Share2 },
];

export function SideNavigation() {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-mais-100 text-mais-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon
              className={`w-5 h-5 transition-colors ${
                isActive ? "text-mais-600" : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
