import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, ListTodo, Target, BarChart3, Monitor, Smartphone, LogOut, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { viewMode, setViewMode, isAuthenticated, logout } = useApp();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/focus", icon: Target, label: "Focus" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const containerClass = viewMode === "mobile" 
    ? "max-w-md mx-auto" 
    : "max-w-7xl mx-auto";

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  if (viewMode === "desktop") {
    return (
      <div className="h-screen flex bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Study Planner</h1>
            <p className="text-sm text-gray-500 mt-1">Energy-based learning</p>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode("mobile")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">Mobile View</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className={`h-screen flex flex-col bg-gray-50 ${containerClass}`}>
      {/* View Mode Toggle - Mobile */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Study Planner</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("desktop")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-colors ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
