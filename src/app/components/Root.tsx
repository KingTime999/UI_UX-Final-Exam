import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, ListTodo, Target, BarChart3, Monitor, Smartphone, LogOut, UserCircle2, Trophy, Music2, Pause, Play, Webcam } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect, useRef, useState } from "react";

const appMusicSourcePath = `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}music/homepage-theme.mp3`;

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
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

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      return;
    }

    try {
      setMusicError(null);
      audio.volume = 0.35;
      await audio.play();
      setIsMusicPlaying(true);
    } catch {
      setMusicError("Unable to play music. Please click again after interacting with the page.");
      setIsMusicPlaying(false);
    }
  };

  const handleAudioError = () => {
    setMusicError("Music file was not found. Please check public/music/homepage-theme.mp3.");
    setIsMusicPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  const navItems = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/app/focus", icon: Target, label: "Focus" },
    { path: "/app/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/app/account", icon: UserCircle2, label: "Account" },
    { path: "/app/world-rank", icon: Trophy, label: "World Rank" },
    { path: "/app/music", icon: Music2, label: "Music" },
    { path: "/app/omestudy", icon: Webcam, label: "OmeStudy" },
  ];

  const containerClass = viewMode === "mobile" 
    ? "max-w-md mx-auto" 
    : "max-w-7xl mx-auto";

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  if (viewMode === "desktop") {
    return (
      <div className="h-screen flex bg-gradient-to-b from-emerald-50 via-lime-50 to-green-100">
        <audio ref={audioRef} loop onError={handleAudioError}>
          <source src={appMusicSourcePath} type="audio/mpeg" />
        </audio>

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
                        ? "text-emerald-700 bg-emerald-100" 
                        : "text-gray-700 hover:bg-emerald-50"
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
            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <Music2 className="w-5 h-5" />
              <span className="font-medium flex items-center gap-2">
                {isMusicPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Music On
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Music Off
                  </>
                )}
              </span>
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode("mobile")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors"
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

            {musicError && <p className="text-xs text-red-600 px-1">{musicError}</p>}
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
    <div className={`h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-lime-50 to-green-100 ${containerClass}`}>
      <audio ref={audioRef} loop onError={handleAudioError}>
        <source src={appMusicSourcePath} type="audio/mpeg" />
      </audio>

      {/* View Mode Toggle - Mobile */}
      <div className="bg-white/90 border-b border-emerald-100 px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Study Planner</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
            title={isMusicPlaying ? "Pause music" : "Play music"}
          >
            {isMusicPlaying ? <Pause className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setViewMode("desktop")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
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
      <div className="flex-1 overflow-y-auto pb-32">
        {musicError && <p className="px-5 pt-3 text-xs text-red-600">{musicError}</p>}
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-emerald-100 px-2 py-2 safe-area-bottom">
        <div className="grid grid-cols-4 gap-1 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-colors ${
                  isActive 
                    ? "text-emerald-700 bg-emerald-100" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[11px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
