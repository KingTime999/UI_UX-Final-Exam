import { Disc3, Heart, Mic2, Play, Repeat2, Shuffle, SkipBack, SkipForward, Waves, Music2 } from "lucide-react";
import { useApp } from "../context/AppContext";

const playlists = [
  { name: "Deep Focus", mood: "Calm synths", duration: "42 min", accent: "from-emerald-500 to-teal-400" },
  { name: "Exam Sprint", mood: "Fast tempo", duration: "38 min", accent: "from-lime-400 to-emerald-600" },
  { name: "Late Night Review", mood: "Warm ambient", duration: "55 min", accent: "from-cyan-500 to-blue-500" },
];

const queue = [
  { title: "Neon Notes", artist: "Study Loop", length: "3:45" },
  { title: "Half-Life Focus", artist: "Quiet Sparks", length: "4:21" },
  { title: "Green Room", artist: "Campus Pulse", length: "2:58" },
  { title: "Momentum", artist: "Focus District", length: "5:04" },
];

export default function MusicMixer() {
  const { viewMode, studyStreak, focusSeconds } = useApp();
  const isDesktop = viewMode === "desktop";
  const isMobile = !isDesktop;

  return (
    <div className={`min-h-full bg-[#eef7e9] ${isDesktop ? "px-8 py-8" : "px-4 py-5 pb-28"}`}>
      <div className={isDesktop ? "space-y-6" : "space-y-4"}>
        <header className={`flex flex-col ${isMobile ? "gap-3" : "gap-4 sm:flex-row sm:items-end sm:justify-between"}`}>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-emerald-700">
              <Music2 className="h-3.5 w-3.5" />
              Spotify-inspired mix
            </div>
            <h1 className={`mt-4 font-semibold tracking-tight text-gray-900 ${isDesktop ? "text-4xl" : "text-2xl"}`}>
              Music Mixer
            </h1>
            <p className={`mt-2 max-w-2xl leading-relaxed text-gray-600 ${isDesktop ? "text-sm sm:text-base" : "text-sm"}`}>
              A visual-only listening screen with curated study playlists and a Spotify-like arrangement, rethemed to match the app style.
            </p>
          </div>

          <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "flex"}`}>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Focus points</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{focusSeconds.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Study streak</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-700">{studyStreak}d</p>
            </div>
          </div>
        </header>

        <div className={`grid gap-6 ${isDesktop ? "lg:grid-cols-[1.15fr_0.85fr]" : "grid-cols-1"}`}>
          <section className={`overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-6 sm:p-7"}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-700">Now playing</p>
                <h2 className={`mt-2 font-semibold text-gray-900 ${isMobile ? "text-xl" : "text-2xl sm:text-3xl"}`}>Green Room Session</h2>
              </div>
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 font-medium text-emerald-700 transition hover:bg-emerald-100 ${isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"}`}
              >
                <Heart className="h-4 w-4 text-emerald-700" />
                Save mix
              </button>
            </div>

            <div className={`mt-6 grid gap-5 ${isDesktop ? "lg:grid-cols-[240px_1fr]" : "grid-cols-1"}`}>
              <div className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-500 p-5 shadow-sm">
                <div className="absolute inset-x-5 top-5 h-20 rounded-full bg-white/25 blur-2xl" />
                <div className="relative flex h-full min-h-[220px] flex-col justify-between rounded-[24px] border border-white/20 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/90">
                    <span>Study beats</span>
                    <span>Live</span>
                  </div>

                  <div className="flex flex-1 items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-6 rounded-full bg-white/20 blur-2xl" />
                      <div className={`relative flex items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-inner ${isMobile ? "h-36 w-36" : "h-40 w-40"}`}>
                        <div className={`flex items-center justify-center rounded-full border border-white/20 bg-white/10 ${isMobile ? "h-24 w-24" : "h-28 w-28"}`}>
                          <Disc3 className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} text-white`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white">
                    <div className="flex items-center justify-between">
                      <span>Progress</span>
                      <span>1:42 / 3:45</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/30">
                      <div className="h-2 w-2/5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Track details</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Neon Notes</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    A calm, layered mix with a green glow, designed to feel like a focus playlist inside a music app.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-emerald-100">Lo-fi</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-emerald-100">Instrumental</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-emerald-100">Focus</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-emerald-100">Study</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {playlists.map((playlist) => (
                    <div key={playlist.name} className={`rounded-[24px] border border-emerald-100 bg-gradient-to-br ${playlist.accent} p-4 shadow-sm`}>
                      <p className="text-sm font-semibold text-white">{playlist.name}</p>
                      <p className="mt-1 text-xs text-white/80">{playlist.mood}</p>
                      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/70">{playlist.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-[28px] border border-emerald-100 bg-emerald-50/60 ${isMobile ? "p-4" : "p-4 sm:p-5"}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button type="button" className="rounded-full bg-white p-3 text-gray-700 border border-emerald-100 transition hover:bg-emerald-50">
                    <Shuffle className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full bg-white p-3 text-gray-700 border border-emerald-100 transition hover:bg-emerald-50">
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full bg-emerald-600 px-5 py-4 text-white shadow-sm transition hover:bg-emerald-700">
                    <Play className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-full bg-white p-3 text-gray-700 border border-emerald-100 transition hover:bg-emerald-50">
                    <SkipForward className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full bg-white p-3 text-gray-700 border border-emerald-100 transition hover:bg-emerald-50">
                    <Repeat2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Waves className="h-4 w-4 text-emerald-600" />
                  Visual player controls only
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-emerald-100">
                <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className={`rounded-[28px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Mic2 className="h-4 w-4 text-emerald-600" />
                Studio notes
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 border border-emerald-100">Queue is visual only, no actual playback logic here.</div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 border border-emerald-100">The UI keeps a Spotify-like structure but now matches your app's bright palette.</div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 border border-emerald-100">Use it as a mood board for study sessions, playlists, and focus time.</div>
              </div>
            </div>

            <div className={`rounded-[28px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-gray-900`}>Queue</h3>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-700">4 tracks</span>
              </div>

              <div className="mt-4 space-y-3">
                {queue.map((track, index) => (
                  <div key={track.title} className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{index + 1}. {track.title}</p>
                      <p className="text-xs text-gray-500">{track.artist}</p>
                    </div>
                    <span className="text-xs text-gray-500">{track.length}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-[28px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Study mode</p>
            <h4 className="mt-2 text-lg font-semibold text-gray-900">Low distraction</h4>
            <p className="mt-2 text-sm text-gray-600">Muted visuals and steady rhythm for reading or note review.</p>
          </div>
          <div className={`rounded-[28px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Night session</p>
            <h4 className="mt-2 text-lg font-semibold text-gray-900">Warm ambient</h4>
            <p className="mt-2 text-sm text-gray-600">A softer look for late-night revision and long focus blocks.</p>
          </div>
          <div className={`rounded-[28px] border border-emerald-100 bg-white shadow-sm ${isMobile ? "p-4" : "p-5"}`}>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Study pulse</p>
            <h4 className="mt-2 text-lg font-semibold text-gray-900">Momentum</h4>
            <p className="mt-2 text-sm text-gray-600">A compact visual deck for building a consistent learning rhythm.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
