import { useState, useEffect } from "react";
import { CheckCircle2, Play, Pause, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Focus() {
  const { tasks, energyLevel, toggleTaskComplete, viewMode } = useApp();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const recommendedTasks = getRecommendedTasks(tasks, energyLevel);
  const currentTask = recommendedTasks[currentTaskIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = () => {
    if (currentTask) {
      toggleTaskComplete(currentTask.id);
      setIsTimerRunning(false);
      setTimerSeconds(0);
      if (currentTaskIndex < recommendedTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    }
  };

  const handleReset = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const containerClass = viewMode === "desktop" ? "max-w-3xl mx-auto" : "";

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
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
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
            href="/tasks"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            View All Tasks
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex flex-col items-center justify-center px-5 py-8 ${containerClass}`}>
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Task {currentTaskIndex + 1} of {recommendedTasks.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentTaskIndex + 1) / recommendedTasks.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-semibold text-gray-900 mb-2 tabular-nums">
              {formatTime(timerSeconds)}
            </div>
            <p className="text-sm text-gray-500">
              Estimated: {currentTask.estimatedTime} minutes
            </p>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
            >
              {isTimerRunning ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Task */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
              {currentTask.title}
            </h2>
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-1">
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
          className="w-full py-5 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-lg text-lg"
        >
          <CheckCircle2 className="w-6 h-6" />
          Complete Task
        </button>

        {/* Other Tasks */}
        {recommendedTasks.length > 1 && (
          <div className="mt-6">
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
    </div>
  );
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