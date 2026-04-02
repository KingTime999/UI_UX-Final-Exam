import { CheckCircle2, Clock, Flame } from "lucide-react";
import { EnergyLevel, useApp } from "../context/AppContext";

const rankTiers = [
  { key: "iron", label: "Iron", minPoints: 0, image: "1sat.png" },
  { key: "bronze", label: "Bronze", minPoints: 30000, image: "2dong.png" },
  { key: "silver", label: "Silver", minPoints: 90000, image: "3bac.png" },
  { key: "gold", label: "Gold", minPoints: 180000, image: "4vang.png" },
  { key: "platinum", label: "Platinum", minPoints: 360000, image: "5bachkim.png" },
  { key: "emerald", label: "Emerald", minPoints: 600000, image: "6lucbao.png" },
  { key: "diamond", label: "Diamond", minPoints: 900000, image: "6lucbao.png" },
  { key: "master", label: "Master", minPoints: 1250000, image: "8caothu.png" },
  { key: "grandmaster", label: "Grandmaster", minPoints: 1800000, image: "9daicaothu.png" },
  { key: "challenger", label: "Challenger", minPoints: 2500000, image: "10thachdau.png" },
] as const;

const studyQuotes = [
  "Small focus sessions build unstoppable momentum.",
  "Consistency beats intensity when the goal is mastery.",
  "One more focused minute today is one less regret tomorrow.",
  "You do not need perfect conditions to make real progress.",
  "Keep showing up. Your future self is counting on this session.",
];

const focusTips = {
  low: "Pick one easy task and do just 10 minutes to get started.",
  medium: "Use a 25-minute sprint, then take a 5-minute break.",
  high: "Tackle your hardest task first while your energy is high.",
  none: "Set your energy level first to unlock personalized task suggestions.",
} as const;

export default function Home() {
  const {
    tasks,
    energyLevel,
    setEnergyLevel,
    toggleTaskComplete,
    viewMode,
    focusSeconds,
    studyStreak,
  } = useApp();

  const completedToday = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const totalTasksToday = getRecommendedTasks(tasks, energyLevel).length;
  const recommendedTasks = getRecommendedTasks(tasks, energyLevel);
  const isDesktop = viewMode === "desktop";

  const energyLevels: { value: EnergyLevel; label: string; emoji: string }[] = [
    { value: "low", label: "Low", emoji: "😴" },
    { value: "medium", label: "Medium", emoji: "🙂" },
    { value: "high", label: "High", emoji: "⚡" },
  ];

  const streakProgress = Math.min(studyStreak / 7, 1);
  const currentTier = [...rankTiers].reverse().find((tier) => focusSeconds >= tier.minPoints) ?? rankTiers[0];
  const currentTierIndex = rankTiers.findIndex((tier) => tier.key === currentTier.key);
  const nextTier = rankTiers[currentTierIndex + 1] ?? null;
  const rankProgress = nextTier
    ? Math.min((focusSeconds - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints), 1)
    : 1;
  const rankBadgeImage = `${import.meta.env.BASE_URL}rankfolder/${currentTier.image}`;

  const quoteOfDay = studyQuotes[new Date().getDate() % studyQuotes.length];
  const tipOfDay = energyLevel ? focusTips[energyLevel] : focusTips.none;

  return (
    <div className={`min-h-full ${isDesktop ? "px-8 pt-8 pb-8" : "px-5 pt-8 pb-8"}`}>
      <div className="mb-8">
        <h1 className={`font-semibold text-gray-900 mb-1 ${isDesktop ? "text-4xl" : "text-3xl"}`}>Today's Study</h1>
        <p className={`text-gray-500 ${isDesktop ? "text-base" : "text-sm"}`}>Monday, March 9</p>
      </div>

      <div className={isDesktop ? "space-y-8" : ""}>
        <div className={isDesktop ? "grid grid-cols-12 gap-6 items-start" : "space-y-4"}>
          <div className={isDesktop ? "col-span-4 space-y-4" : ""}>
            <div
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                isDesktop ? "min-h-[232px]" : "h-fit"
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-5">How's your energy today?</h2>
              <div className="grid grid-cols-3 gap-3">
                {energyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setEnergyLevel(level.value)}
                    className={`py-4 px-3 rounded-xl border-2 transition-all ${
                      energyLevel === level.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{level.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${isDesktop ? "min-h-[254px]" : "h-fit"}`}>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700 mb-2">Quote of the day</div>
              <p className="text-lg leading-relaxed text-gray-800">"{quoteOfDay}"</p>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="text-xs font-semibold uppercase tracking-wide text-sky-700 mb-2">Focus tip</div>
                <p className="text-base leading-relaxed text-gray-800">{tipOfDay}</p>
              </div>
            </div>
          </div>

          <div className={isDesktop ? "col-span-8 space-y-4" : "space-y-4"}>
            <div
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                isDesktop ? "min-h-[232px]" : "h-fit"
              }`}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-5">Daily Summary</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 leading-tight">{completedToday}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 leading-tight">{totalTasksToday}</div>
                  <div className="text-sm text-gray-500">Today</div>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="text-xl font-semibold text-amber-500 mb-2">#</div>
                  <div className="text-2xl font-semibold text-gray-900 leading-tight">
                    {tasks.filter((task) => task.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>

            <div className={`grid gap-4 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
              <div
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between ${
                  isDesktop ? "min-h-[254px]" : "h-fit"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-emerald-700 mb-1">Rank Score</div>
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{focusSeconds.toLocaleString()}</div>
                    <p className="mt-2 text-sm text-gray-500">1 second in Focus Mode = 1 point.</p>
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img src={rankBadgeImage} alt={`${currentTier.label} rank badge`} className="w-16 h-16 object-contain" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">
                      {currentTier.label} Badge
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    <span>Progress to next badge</span>
                    <span>{Math.round(rankProgress * 100)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${rankProgress * 100}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-emerald-700">
                    {nextTier
                      ? `${Math.max(nextTier.minPoints - focusSeconds, 0).toLocaleString()} points to ${nextTier.label}`
                      : "Max rank reached"}
                  </p>
                </div>
              </div>

              <div
                className={`bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col justify-between ${
                  isDesktop ? "min-h-[254px]" : "h-fit"
                }`}
              >
                <div className="flex items-center gap-2 mb-4 text-orange-700 font-semibold">
                  <Flame className="w-5 h-5" />
                  Study Streak
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-4xl font-semibold text-gray-900 leading-none">{studyStreak}</div>
                    <p className="mt-2 text-sm text-gray-500">Consecutive study days tracked from completed focus sessions.</p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-wide text-orange-700 font-semibold">Goal</div>
                    <div className="text-lg font-semibold text-orange-800">7 days</div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-orange-50/70 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-orange-700">
                    <span>Weekly streak progress</span>
                    <span>{studyStreak}/7</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-orange-100">
                    <div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${streakProgress * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={isDesktop ? "pt-2" : "mt-6"}>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            {energyLevel ? "Recommended for you" : "Select your energy level to see recommendations"}
          </h2>

          {!energyLevel && (
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-600 text-lg">
                Check in with your energy level above to get personalized task recommendations
              </p>
            </div>
          )}

          {energyLevel && recommendedTasks.length === 0 && (
            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-gray-600 text-lg">Great job! All recommended tasks are complete.</p>
            </div>
          )}

          <div className="space-y-4">
            {recommendedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={() => toggleTaskComplete(task.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete }: { task: any; onComplete: () => void }) {
  const difficultyColors: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-3 leading-snug">{task.title}</h3>
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="text-gray-600 font-medium">{task.course}</span>
          <span className="text-gray-300">•</span>
          <span className={`px-2.5 py-1 rounded-md font-medium text-xs ${difficultyColors[task.difficulty]}`}>
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

  if (energyLevel === "low") {
    return incompleteTasks.filter((task) => task.difficulty === "Easy").slice(0, 3);
  }

  if (energyLevel === "medium") {
    return incompleteTasks
      .filter((task) => task.difficulty === "Easy" || task.difficulty === "Medium")
      .slice(0, 4);
  }

  return incompleteTasks.slice(0, 5);
}
