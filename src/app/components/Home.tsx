import { useState } from "react";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useApp, EnergyLevel } from "../context/AppContext";

export default function Home() {
  const { tasks, energyLevel, setEnergyLevel, toggleTaskComplete, viewMode } = useApp();
  
  const completedToday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const totalTasksToday = getRecommendedTasks(tasks, energyLevel).length;

  const energyLevels: { value: EnergyLevel; label: string; emoji: string }[] = [
    { value: "low", label: "Low", emoji: "😴" },
    { value: "medium", label: "Medium", emoji: "🙂" },
    { value: "high", label: "High", emoji: "⚡" },
  ];

  const recommendedTasks = getRecommendedTasks(tasks, energyLevel);

  const isDesktop = viewMode === "desktop";

  return (
    <div className={`min-h-full ${isDesktop ? 'px-8 pt-8 pb-8' : 'px-5 pt-8 pb-8'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`font-semibold text-gray-900 mb-1 ${isDesktop ? 'text-4xl' : 'text-3xl'}`}>
          Today's Study
        </h1>
        <p className={`text-gray-500 ${isDesktop ? 'text-base' : 'text-sm'}`}>Monday, March 9</p>
      </div>

      <div className={isDesktop ? "grid grid-cols-[450px_1fr] gap-8" : ""}>
        <div>
          {/* Energy Check-in */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              How's your energy today?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {energyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setEnergyLevel(level.value)}
                  className={`py-5 px-3 rounded-xl border-2 transition-all ${
                    energyLevel === level.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{level.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {level.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-semibold text-gray-900 mb-1">{completedToday}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-semibold text-gray-900 mb-1">{totalTasksToday}</div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-50 mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-semibold text-gray-900 mb-1">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Recommended Tasks */}
        <div className={isDesktop ? "" : "mt-6"}>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            {energyLevel
              ? "Recommended for you"
              : "Select your energy level to see recommendations"}
          </h2>
          
          {!energyLevel && (
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-600 text-lg">
                Check in with your energy level above to get personalized task
                recommendations
              </p>
            </div>
          )}

          {energyLevel && recommendedTasks.length === 0 && (
            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-gray-600 text-lg">
                Great job! All recommended tasks are complete.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {recommendedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => toggleTaskComplete(task.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onComplete,
}: {
  task: any;
  onComplete: () => void;
}) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-3 leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="text-gray-600 font-medium">{task.course}</span>
          <span className="text-gray-300">•</span>
          <span
            className={`px-2.5 py-1 rounded-md font-medium text-xs ${
              difficultyColors[task.difficulty]
            }`}
          >
            {task.difficulty}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {task.estimatedTime}m
          </span>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-base"
      >
        Complete
      </button>
    </div>
  );
}

function getRecommendedTasks(tasks: any[], energyLevel: EnergyLevel) {
  if (!energyLevel) return [];

  const incompleteTasks = tasks.filter((task) => task.status === "todo");

  // Filter based on energy level
  if (energyLevel === "low") {
    return incompleteTasks
      .filter((task) => task.difficulty === "Easy")
      .slice(0, 3);
  } else if (energyLevel === "medium") {
    return incompleteTasks
      .filter((task) => task.difficulty === "Easy" || task.difficulty === "Medium")
      .slice(0, 4);
  } else {
    // high energy
    return incompleteTasks.slice(0, 5);
  }
}