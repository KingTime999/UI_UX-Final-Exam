import { useState, useEffect, useRef } from "react";
import { BrainCircuit, CheckCircle2, Play, Pause, RotateCcw, Timer, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const baseUrl = `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}`;
const backgroundGifBase = `${baseUrl}backgroundgif/`;
const vibeGifs = ["anime1.gif", "anime2.gif", "anime3.gif", "anime4.gif"].map(
  (fileName) => `${backgroundGifBase}${fileName}`
);
const celebrationGif = `${backgroundGifBase}yehhh.gif`;

type FireworkParticle = {
  id: number;
  left: string;
  top: string;
  colorClass: string;
  delay: string;
  duration: string;
};

export default function Focus() {
  const { tasks, energyLevel, toggleTaskComplete, viewMode, addFocusSeconds, recordStudySession, focusSeconds } = useApp();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isDeepFocusOpen, setIsDeepFocusOpen] = useState(false);
  const [deepFocusMinutes, setDeepFocusMinutes] = useState(45);
  const [deepFocusSecondsLeft, setDeepFocusSecondsLeft] = useState(45 * 60);
  const [isDeepFocusRunning, setIsDeepFocusRunning] = useState(false);
  const [showCelebrationGif, setShowCelebrationGif] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [activeVibeGifIndex, setActiveVibeGifIndex] = useState(0);
  const celebrationTimeoutRef = useRef<number | null>(null);
  const fireworksTimeoutRef = useRef<number | null>(null);
  const fireworksRef = useRef<FireworkParticle[]>(createFireworkParticles());

  const recommendedTasks = getRecommendedTasks(tasks, energyLevel);
  const currentTask = recommendedTasks[currentTaskIndex];

  useEffect(() => {
    if (!currentTask) return;
    setTimerSeconds(currentTask.estimatedTime * 60);
    setIsTimerRunning(false);
  }, [currentTask?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          addFocusSeconds(1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, addFocusSeconds]);

  useEffect(() => {
    if (isDeepFocusRunning) {
      return;
    }
    setDeepFocusSecondsLeft(deepFocusMinutes * 60);
  }, [deepFocusMinutes, isDeepFocusRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDeepFocusRunning && deepFocusSecondsLeft > 0) {
      interval = setInterval(() => {
        setDeepFocusSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsDeepFocusRunning(false);
            return 0;
          }
          addFocusSeconds(1);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isDeepFocusRunning, deepFocusSecondsLeft, addFocusSeconds]);

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current !== null) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
      if (fireworksTimeoutRef.current !== null) {
        window.clearTimeout(fireworksTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveVibeGifIndex((prev) => (prev + 1) % vibeGifs.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = () => {
    if (currentTask) {
      toggleTaskComplete(currentTask.id);
      recordStudySession();
      setIsTimerRunning(false);
      setShowCelebrationGif(true);
      setShowFireworks(true);
      if (celebrationTimeoutRef.current !== null) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
      if (fireworksTimeoutRef.current !== null) {
        window.clearTimeout(fireworksTimeoutRef.current);
      }
      celebrationTimeoutRef.current = window.setTimeout(() => {
        setShowCelebrationGif(false);
      }, 2200);
      fireworksTimeoutRef.current = window.setTimeout(() => {
        setShowFireworks(false);
      }, 2200);
      if (currentTaskIndex < recommendedTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    }
  };

  const handleReset = () => {
    if (currentTask) {
      setTimerSeconds(currentTask.estimatedTime * 60);
    }
    setIsTimerRunning(false);
  };

  const resetDeepFocus = () => {
    setIsDeepFocusRunning(false);
    setDeepFocusSecondsLeft(deepFocusMinutes * 60);
  };

  const isDesktop = viewMode === "desktop";
  const isMobile = !isDesktop;
  const containerClass = isDesktop ? "max-w-6xl mx-auto" : "";
  const elapsedSeconds = currentTask ? currentTask.estimatedTime * 60 - timerSeconds : 0;
  const deepFocusEarnedSeconds = deepFocusMinutes * 60 - deepFocusSecondsLeft;
  const nextVibeGifIndex = (activeVibeGifIndex + 1) % vibeGifs.length;

  if (!energyLevel) {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center px-5 py-8 ${containerClass}`}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Focus Mode
          </h2>
          <p className="text-gray-600 mb-6">
            Check in with your energy level on the Home page to start your
            focused study session
          </p>
          <a
            href="/app"
            className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (recommendedTasks.length === 0) {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center px-5 py-8 ${containerClass}`}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            All Done!
          </h2>
          <p className="text-gray-600 mb-6">
            You've completed all your recommended tasks. Great work!
          </p>
          <a
            href="/app/tasks"
            className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors"
          >
            View All Tasks
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full ${isMobile ? "px-4 py-5 pb-36" : "px-5 py-8"} ${containerClass}`}>
      <div className={`grid gap-6 ${isDesktop ? "lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start" : "grid-cols-1"}`}>
        <div>
          {/* Progress */}
          <div className={`bg-white rounded-3xl shadow-sm mb-5 ${isMobile ? "p-4" : "p-6"}`}>
            <p className="text-sm text-gray-500 mb-2">
              Task {currentTaskIndex + 1} of {recommendedTasks.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentTaskIndex + 1) / recommendedTasks.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className={`relative bg-white rounded-3xl shadow-sm mb-5 overflow-hidden ${isMobile ? "p-4" : "p-8"}`}>
            <img
              src={vibeGifs[activeVibeGifIndex]}
              alt="focus vibe"
              className="absolute right-3 top-3 h-14 w-14 rounded-xl object-cover opacity-25 md:h-16 md:w-16"
            />
            <img
              src={vibeGifs[nextVibeGifIndex]}
              alt="focus vibe"
              className="absolute left-3 bottom-3 h-12 w-12 rounded-xl object-cover opacity-20 md:h-14 md:w-14"
            />
            <div className="text-center mb-5">
              <p className={`font-medium text-gray-500 mb-2 ${isMobile ? "text-xs" : "text-sm"}`}>Time Remaining</p>
              <div className={`font-semibold text-gray-900 mb-2 tabular-nums ${isMobile ? "text-5xl" : "text-6xl"}`}>
                {formatTime(timerSeconds)}
              </div>
              <p className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>
                Estimated duration: {currentTask.estimatedTime} minutes
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                disabled={timerSeconds === 0}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-700 text-white rounded-full flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTimerRunning ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <Play className="w-6 h-6 ml-1 sm:w-7 sm:h-7" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {timerSeconds === 0 && (
              <p className={`text-center text-emerald-700 font-medium ${isMobile ? "text-xs" : "text-sm"}`}>
                Timer finished. You can complete this task now.
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Deep Focus
              </span>
              <button
                type="button"
                onClick={() => setIsDeepFocusOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
              >
                <BrainCircuit className="w-4 h-4" />
                Start Deep Focus
              </button>
            </div>
          </div>

          {/* Current Task */}
          <div className={`bg-white rounded-3xl shadow-sm mb-5 ${isMobile ? "p-4" : "p-6"}`}>
            <div className="text-center">
              <h2 className={`font-semibold text-gray-900 mb-3 leading-snug ${isMobile ? "text-lg" : "text-xl"}`}>
                {currentTask.title}
              </h2>
              <div className={`inline-flex items-center gap-2 text-gray-600 mb-1 ${isMobile ? "text-xs flex-wrap justify-center" : "text-sm"}`}>
                <span>{currentTask.course}</span>
                <span className="text-gray-300">•</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentTask.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : currentTask.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentTask.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className={`w-full bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-lg ${isMobile ? "py-4 text-base" : "py-5 text-lg"}`}
          >
            <CheckCircle2 className={`${isMobile ? "w-5 h-5" : "w-6 h-6"}`} />
            Complete Task
          </button>

          {/* Other Tasks */}
          {recommendedTasks.length > 1 && (
            <div className="mt-5">
              <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wide">
                Up Next
              </p>
              <div className="space-y-2">
                {recommendedTasks
                  .slice(currentTaskIndex + 1, currentTaskIndex + 3)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-50 rounded-xl p-3 text-sm"
                    >
                      <div className="font-medium text-gray-700 mb-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">{task.course}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <aside className={`space-y-4 ${isMobile ? "mt-2" : ""}`}>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Session Snapshot
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700 mb-1">Focused</p>
                <p className="text-lg font-semibold text-emerald-900">{formatTime(elapsedSeconds)}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-xs text-blue-700 mb-1">Total Points</p>
                <p className="text-lg font-semibold text-blue-900">{focusSeconds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Focus Tips
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Work in short bursts and take a 2-5 minute break between tasks.</li>
              <li>Keep only one tab or app open for this task to avoid distractions.</li>
              <li>When the timer ends, mark complete and move to the next task.</li>
            </ul>
          </div>

          <div className={`bg-white rounded-2xl shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Focus Vibe
            </h3>
            <div className="relative h-72 sm:h-80 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
              {vibeGifs.map((gifPath, index) => (
                <img
                  key={`${gifPath}-${index}`}
                  src={gifPath}
                  alt={`background gif ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === activeVibeGifIndex ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                {vibeGifs.map((gifPath, index) => (
                  <button
                    key={`focus-vibe-dot-${gifPath}`}
                    type="button"
                    onClick={() => setActiveVibeGifIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeVibeGifIndex ? "w-5 bg-white" : "w-2.5 bg-white/60"
                    }`}
                    aria-label={`Show vibe gif ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">GIF auto-switches every 5 seconds.</p>
          </div>
        </aside>
      </div>

      {showCelebrationGif && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <img
            src={celebrationGif}
            alt="task completed"
            className="h-56 w-56 sm:h-72 sm:w-72 object-contain drop-shadow-2xl"
          />
        </div>
      )}

      {showFireworks && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {fireworksRef.current.map((particle) => (
            <span
              key={particle.id}
              className={`absolute h-3 w-3 rounded-full ${particle.colorClass} animate-ping`}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}

      {isDeepFocusOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm px-3 py-4 flex items-center justify-center">
          <div
            className={`w-full rounded-3xl bg-[#081a14] border border-emerald-800/80 text-emerald-50 shadow-2xl ${
              isMobile
                ? "max-w-[390px] max-h-[calc(100vh-1.5rem)] overflow-y-auto p-4 mx-auto"
                : "max-w-3xl p-5 sm:p-8"
            }`}
          >
            <div className={`flex items-start justify-between gap-4 ${isMobile ? "mb-4" : "mb-6"}`}>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Deep Focus</p>
                <h3 className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl"} font-semibold mt-2`}>
                  Lock-in Session
                </h3>
                <p className={`${isMobile ? "text-xs" : "text-sm"} text-emerald-200/85 mt-2 leading-relaxed`}>
                  Minimal distractions, long concentration block, and animated focus background.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeepFocusRunning(false);
                  setIsDeepFocusOpen(false);
                }}
                className="shrink-0 rounded-full border border-emerald-700 p-2 text-emerald-200 hover:bg-emerald-900/60"
                aria-label="Close deep focus"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl border border-emerald-800/80 ${
                isMobile ? "h-56 mb-4" : "h-52 sm:h-72 mb-6"
              }`}
            >
              {vibeGifs.map((gifPath, index) => (
                <img
                  key={`deep-${gifPath}-${index}`}
                  src={gifPath}
                  alt={`deep focus gif ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === activeVibeGifIndex ? "opacity-80" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081a14] via-transparent to-transparent" />
              <p className={`absolute bottom-3 left-3 text-xs text-emerald-100/90 ${isMobile ? "max-w-[12rem]" : ""}`}>
                Auto switch every 5 seconds
              </p>
            </div>

            <div className="text-center">
              <p className={`text-emerald-300 ${isMobile ? "text-xs mb-1" : "text-sm mb-2"}`}>Session Timer</p>
              <p className={`${isMobile ? "text-4xl" : "text-4xl sm:text-6xl"} font-semibold tabular-nums mb-4 sm:mb-5`}>
                {formatTime(deepFocusSecondsLeft)}
              </p>
              <p className={`${isMobile ? "text-[11px]" : "text-xs"} text-emerald-200/85 mb-3 sm:mb-4 leading-relaxed`}>
                Deep Focus scoring is identical: 1 second = 1 point | This session: +{deepFocusEarnedSeconds} points
              </p>
              <p className={`${isMobile ? "text-[11px] mb-4" : "text-xs mb-6"} text-emerald-300/90`}>
                Global total points: {focusSeconds}
              </p>

              <div className={`grid gap-2 ${isMobile ? "grid-cols-1 mb-4" : "flex flex-wrap items-center justify-center mb-5"}`}>
                {[25, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    disabled={isDeepFocusRunning}
                    onClick={() => setDeepFocusMinutes(minutes)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      deepFocusMinutes === minutes
                        ? "bg-emerald-500 text-emerald-950"
                        : "bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800"
                    } disabled:opacity-50 ${isMobile ? "w-full py-3" : ""}`}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>

              <div className={`flex items-center justify-center ${isMobile ? "flex-col gap-2" : "gap-3"}`}>
                <button
                  type="button"
                  onClick={() => setIsDeepFocusRunning((previous) => !previous)}
                  disabled={deepFocusSecondsLeft === 0}
                  className={`${isMobile ? "w-full h-12 rounded-2xl" : "w-14 h-14 rounded-full"} bg-emerald-500 text-emerald-950 flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50`}
                >
                  {isDeepFocusRunning ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                  )}
                  {isMobile && (
                    <span className="ml-2 text-sm font-medium">
                      {isDeepFocusRunning ? "Pause session" : "Start session"}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetDeepFocus}
                  className={`${isMobile ? "w-full h-11 rounded-2xl" : "w-12 h-12 rounded-full"} bg-emerald-900/80 text-emerald-100 flex items-center justify-center hover:bg-emerald-800`}
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isMobile && <span className="ml-2 text-sm font-medium">Reset timer</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function createFireworkParticles(): FireworkParticle[] {
  const colors = ["bg-yellow-300", "bg-pink-400", "bg-blue-300", "bg-emerald-300", "bg-orange-300"];
  return Array.from({ length: 24 }).map((_, index) => ({
    id: index,
    left: `${8 + Math.random() * 84}%`,
    top: `${8 + Math.random() * 72}%`,
    colorClass: colors[index % colors.length],
    delay: `${(index % 6) * 0.08}s`,
    duration: `${0.8 + (index % 5) * 0.18}s`,
  }));
}

function getRecommendedTasks(tasks: any[], energyLevel: any) {
  if (!energyLevel) return [];

  const incompleteTasks = tasks.filter((task) => task.status === "todo");

  if (energyLevel === "low") {
    return incompleteTasks
      .filter((task) => task.difficulty === "Easy")
      .slice(0, 3);
  } else if (energyLevel === "medium") {
    return incompleteTasks
      .filter((task) => task.difficulty === "Easy" || task.difficulty === "Medium")
      .slice(0, 4);
  } else {
    return incompleteTasks.slice(0, 5);
  }
}