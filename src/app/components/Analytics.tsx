import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, CheckCircle2, Clock, Target } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Analytics() {
  const { tasks, viewMode } = useApp();

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Calculate total study time (from completed tasks)
  const totalStudyTime = completedTasks.reduce(
    (sum, task) => sum + task.estimatedTime,
    0
  );

  // Weekly data (mock for demonstration)
  const weeklyData = [
    { day: "Mon", tasks: 3 },
    { day: "Tue", tasks: 5 },
    { day: "Wed", tasks: 2 },
    { day: "Thu", tasks: 4 },
    { day: "Fri", tasks: 6 },
    { day: "Sat", tasks: 1 },
    { day: "Sun", tasks: 2 },
  ];

  // Heatmap data (last 12 weeks, 7 days each)
  const heatmapData = generateHeatmapData();

  const containerClass = viewMode === "desktop" ? "max-w-6xl mx-auto" : "";
  const gridClass = viewMode === "desktop" ? "lg:grid-cols-4" : "grid-cols-2";

  return (
    <div className={`min-h-full px-5 pt-8 pb-8 ${containerClass}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500">Track your study progress</p>
      </div>

      {/* Stats Cards */}
      <div className={`grid ${gridClass} gap-3 mb-6`}>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {completedTasks.length}
          </div>
          <div className="text-xs text-gray-500">Tasks Completed</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500">Completion Rate</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {Math.round(totalStudyTime / 60)}h
          </div>
          <div className="text-xs text-gray-500">Study Time</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {(completedTasks.length / 7).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">Tasks per Day</div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Overview
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis hide />
              <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 4 ? "#3B82F6" : "#E5E7EB"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Study Heatmap */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Study Activity
        </h2>
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1 min-w-full">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <div className="w-8 text-xs text-gray-500">{day}</div>
                <div className="flex gap-1">
                  {heatmapData[dayIndex].map((value, weekIndex) => (
                    <div
                      key={weekIndex}
                      className={`w-3 h-3 rounded-sm ${getHeatmapColor(value)}`}
                      title={`${value} tasks`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Task Difficulty
        </h2>
        <div className="space-y-3">
          {["Easy", "Medium", "Hard"].map((difficulty) => {
            const difficultyTasks = completedTasks.filter(
              (task) => task.difficulty === difficulty
            );
            const percentage = totalTasks > 0
              ? (difficultyTasks.length / completedTasks.length) * 100
              : 0;
            
            const colors = {
              Easy: { bg: "bg-green-500", light: "bg-green-100" },
              Medium: { bg: "bg-yellow-500", light: "bg-yellow-100" },
              Hard: { bg: "bg-red-500", light: "bg-red-100" },
            };

            return (
              <div key={difficulty}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {difficultyTasks.length} tasks
                  </span>
                </div>
                <div className={`w-full h-2 ${colors[difficulty as keyof typeof colors].light} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${colors[difficulty as keyof typeof colors].bg} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function generateHeatmapData() {
  // Generate 12 weeks of data for each day
  const data: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const weekData: number[] = [];
    for (let week = 0; week < 12; week++) {
      // Random number of tasks (0-4) for demo
      weekData.push(Math.floor(Math.random() * 5));
    }
    data.push(weekData);
  }
  return data;
}

function getHeatmapColor(value: number) {
  if (value === 0) return "bg-gray-100";
  if (value === 1) return "bg-green-200";
  if (value === 2) return "bg-green-400";
  return "bg-green-600";
}