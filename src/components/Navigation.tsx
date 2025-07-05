import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/elements", label: "Elements", icon: "🔍" },
    { path: "/console", label: "Console", icon: "💬" },
    { path: "/network", label: "Network", icon: "🌐" },
    { path: "/application", label: "Application", icon: "📦" },
  ];

  return (
    <nav className="bg-gradient-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">DT</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DevTools Тренажер
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                asChild
                className="transition-smooth hover:shadow-glow text-xs sm:text-sm px-2 sm:px-4"
                size="sm"
              >
                <Link to={item.path} className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-sm sm:text-base">{item.icon}</span>
                  <span className="hidden xs:inline sm:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;