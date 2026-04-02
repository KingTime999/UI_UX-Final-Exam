import { Award, Globe2, Info, Lock, Trophy } from "lucide-react";
import { useApp } from "../context/AppContext";

interface RankEntry {
  name: string;
  country: string;
  city: string;
  points: number;
}

interface RankTier {
  level: number;
  name: string;
  minPoints: number;
  image: string;
}

const mockRankData: RankEntry[] = [
  { name: "Lee Sang-hyeok", country: "South Korea", city: "Seoul", points: 2460500 },
  { name: "Diego Alvarez", country: "Spain", city: "Barcelona", points: 2374000 },
  { name: "Amina Noor", country: "UAE", city: "Dubai", points: 2261500 },
  { name: "Noah Martin", country: "Canada", city: "Toronto", points: 2156000 },
  { name: "Sofia Rossi", country: "Italy", city: "Milan", points: 2039500 },
  { name: "Emi Tanaka", country: "Japan", city: "Tokyo", points: 1933000 },
  { name: "Lucas Dias", country: "Brazil", city: "Rio de Janeiro", points: 1790500 },
  { name: "Nina Muller", country: "Germany", city: "Berlin", points: 1695000 },
  { name: "Kofi Mensah", country: "Ghana", city: "Accra", points: 1607000 },
  { name: "Arjun Mehta", country: "India", city: "Mumbai", points: 1522500 },
];

const baseUrl = `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}`;
const rankFolderBase = `${baseUrl}rankfolder/`;

const rankTiers: RankTier[] = [
  { level: 1, name: "Iron", minPoints: 0, image: "1sat.png" },
  { level: 2, name: "Bronze", minPoints: 30000, image: "2dong.png" },
  { level: 3, name: "Silver", minPoints: 90000, image: "3bac.png" },
  { level: 4, name: "Gold", minPoints: 180000, image: "4vang.png" },
  { level: 5, name: "Platinum", minPoints: 360000, image: "5bachkim.png" },
  { level: 6, name: "Emerald", minPoints: 600000, image: "6lucbao.png" },
  { level: 7, name: "Diamond", minPoints: 900000, image: "6lucbao.png" },
  { level: 8, name: "Master", minPoints: 1250000, image: "8caothu.png" },
  { level: 9, name: "Grandmaster", minPoints: 1800000, image: "9daicaothu.png" },
  { level: 10, name: "Challenger", minPoints: 2500000, image: "10thachdau.png" },
];

export default function WorldRank() {
  const { focusSeconds, userProfile, viewMode, studyStreak } = useApp();
  const isDesktop = viewMode === "desktop";

  const currentUserName = userProfile?.fullName?.trim() || "John Anderson";

  const leaderboard = [
    ...mockRankData,
    {
      name: currentUserName,
      country: "Vietnam",
      city: "Ho Chi Minh City",
      points: focusSeconds,
    },
  ]
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const currentUserRank = leaderboard.find((entry) => entry.name === currentUserName && entry.city === "Ho Chi Minh City");
  const currentTier = [...rankTiers].reverse().find((tier) => focusSeconds >= tier.minPoints) ?? rankTiers[0];

  return (
    <div className={`min-h-full ${isDesktop ? "px-8 pt-8 pb-10" : "px-5 pt-8 pb-8"}`}>
      <div className="mb-8">
        <h1 className={`font-semibold text-gray-900 mb-1 ${isDesktop ? "text-4xl" : "text-3xl"}`}>World Rank</h1>
        <p className="text-gray-500">Global learning leaderboard (mock data for 10 users).</p>
      </div>

      <div className={`grid gap-6 ${isDesktop ? "grid-cols-[1.25fr_0.75fr]" : "grid-cols-1"}`}>
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-700" />
              Global Leaderboard
            </h2>
            <span className="text-sm text-gray-500">Top {leaderboard.length}</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.name === currentUserName && entry.city === "Ho Chi Minh City";
              return (
                <div
                  key={`${entry.name}-${entry.city}`}
                  className={`rounded-xl border px-4 py-3 flex items-center justify-between ${
                    isCurrentUser
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${entry.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-tight">
                        {entry.name} {isCurrentUser ? "(You)" : ""}
                      </p>
                      <p className="text-xs text-gray-500">{entry.city}, {entry.country}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Your Standing
            </h3>
            <p className="text-sm text-gray-500 mb-1">Current rank</p>
            <p className="text-3xl font-semibold text-gray-900 mb-3">#{currentUserRank?.rank ?? "-"}</p>
            <p className="text-sm text-gray-500 mb-1">Your points</p>
            <p className="text-2xl font-semibold text-emerald-700">{focusSeconds.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              How scoring works
            </h3>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900 space-y-2">
              <p>Only study time from Focus Mode is counted.</p>
              <p>
                Formula: <strong>1 second = 1 point</strong>
              </p>
              <p>Example: studying for 3,600 seconds gives you 3,600 points.</p>
              <p>This score is synced with your score on the Home page.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Rank Ladder (10 Levels)
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Your global rank tier is determined by Focus points. 1 second = 1 point.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            Current tier: {currentTier.name}
          </div>
        </div>

        <div className={`grid gap-4 ${isDesktop ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {rankTiers.map((tier) => {
            const unlocked = focusSeconds >= tier.minPoints;
            const nextTier = rankTiers[tier.level] ?? null;
            return (
            <article
              key={tier.level}
              className={`rounded-2xl border p-4 shadow-sm ${
                unlocked
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={`${rankFolderBase}${tier.image}`}
                    alt={`${tier.name} badge`}
                    className={`h-16 w-16 object-contain ${unlocked ? "" : "opacity-40 grayscale"}`}
                  />
                  {!unlocked && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-gray-900 p-1 text-white shadow">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900">Level {tier.level}: {tier.name}</h4>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        unlocked
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Reach {tier.minPoints.toLocaleString()} points to unlock this rank.
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Next: {nextTier ? `${nextTier.minPoints.toLocaleString()} points` : "Max tier"}
                  </p>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
