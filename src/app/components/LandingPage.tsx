import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Leaf,
  Music2,
  Pause,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const highlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Plan by energy level",
    description:
      "Get task suggestions based on your current study energy so you can avoid burnout.",
    icon: Leaf,
  },
  {
    title: "Focus on what matters",
    description:
      "Sort your work by difficulty and time to prioritize tasks in the right order.",
    icon: BrainCircuit,
  },
  {
    title: "Clear daily progress",
    description:
      "Track completed tasks and see your learning momentum at a glance.",
    icon: Clock3,
  },
  {
    title: "Reliable study space",
    description:
      "Built with a clean and friendly interface to support a smooth study experience.",
    icon: ShieldCheck,
  },
];

const quickFlow = [
  {
    step: "Step 1",
    title: "Log in",
    description: "Start your study account and keep your progress in one place.",
  },
  {
    step: "Step 2",
    title: "Add your tasks",
    description: "Enter assignments, deadlines, and difficulty so the system can guide you.",
  },
  {
    step: "Step 3",
    title: "Study strategically",
    description: "Follow energy-based recommendations and complete goals day by day.",
  },
];

const testimonials = [
  {
    quote:
      "I used to study in random order. With energy-based suggestions, I now start with the right tasks and feel less overwhelmed.",
    author: "Thanh Son",
    role: "Computer Science Student",
  },
  {
    quote:
      "The planner keeps my day clear. I can see what to do first and finish more work without burning out.",
    author: "Ngoc Phu",
    role: "Information Technology Student",
  },
  {
    quote:
      "Simple layout, practical flow, and better focus. It helps me stay consistent across multiple courses every week.",
    author: "Minh Khoa",
    role: "Software Engineering Student",
  },
];

const musicSourcePath = `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}music/homepage-theme.mp3`;
const bannerImagePaths = [
  `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}banner/banner1.jpg`,
  `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}banner/banner2.png`,
  `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}banner/banner3.jpg`,
];

export default function LandingPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const { setViewMode, viewMode } = useApp();
  const isMobilePreview = viewMode === "mobile";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBannerIndex((previousIndex) => (previousIndex + 1) % bannerImagePaths.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveTestimonialIndex((previousIndex) => (previousIndex + 1) % testimonials.length);
    }, 7000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleViewModeToggle = (mode: "mobile" | "desktop") => {
    setViewMode(mode);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setMusicError(null);
      audio.volume = 0.35;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setMusicError("Unable to play music. Please check the file and browser interaction.");
      setIsPlaying(false);
    }
  };

  const handleAudioError = () => {
    setMusicError("Music file was not found. Please place the file in the correct path.");
    setIsPlaying(false);
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-gradient-to-b from-emerald-50 via-lime-50 to-green-100 text-emerald-950 font-vietnam ${
        isMobilePreview ? "mx-auto max-w-md border-x border-emerald-100 shadow-xl shadow-emerald-900/10" : ""
      }`}
    >
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-200/70 blur-3xl home-float-slow" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-lime-300/70 blur-3xl home-float-fast" />

      <audio ref={audioRef} loop onError={handleAudioError}>
        <source src={musicSourcePath} type="audio/mpeg" />
      </audio>

      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/75 backdrop-blur-xl">
        <div
          className={`mx-auto flex w-full items-center justify-between px-4 py-4 ${
            isMobilePreview ? "max-w-md" : "max-w-6xl sm:px-6 lg:px-8"
          }`}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/25 transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Log in
          </Link>

          <div
            className={`items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm text-emerald-700 ${
              isMobilePreview ? "hidden" : "hidden sm:flex"
            }`}
          >
            <Leaf className="h-4 w-4" />
            <span>Study Planner | Energy-based Learning</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewModeToggle(isMobilePreview ? "desktop" : "mobile")}
              className={`inline-flex items-center gap-2 rounded-full border bg-white/85 px-3 py-2.5 text-sm font-semibold transition ${
                isMobilePreview
                  ? "border-emerald-600 text-emerald-900"
                  : "border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:text-emerald-900"
              }`}
              title={isMobilePreview ? "Switch to desktop view" : "Switch to mobile view"}
            >
              <Smartphone className="h-4 w-4" />
              <span>{isMobilePreview ? "Desktop" : "Mobile"}</span>
            </button>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/85 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main
        className={`relative mx-auto w-full px-4 pb-20 ${
          isMobilePreview ? "max-w-md pt-6" : "max-w-6xl pt-10 sm:px-6 sm:pt-14 lg:px-8"
        }`}
      >
        <section className={`grid items-start gap-8 ${isMobilePreview ? "" : "lg:grid-cols-[1.2fr_0.8fr]"}`}>
          <div className="home-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Smart learning platform
            </div>

            <h1
              className={`font-fraunces leading-tight text-emerald-950 ${
                isMobilePreview ? "text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"
              }`}
            >
              Study Planner helps you learn better every day.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-900/85 sm:text-lg">
              This website introduces an energy-based learning approach. You can manage assignments,
              prioritize important work, and keep a sustainable study pace throughout the semester.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                Start learning now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900"
              >
                Sign up
              </Link>
            </div>

            <div
              className={`mt-10 grid gap-3 ${
                isMobilePreview ? "grid-cols-1" : "items-stretch sm:grid-cols-3"
              }`}
            >
              <div className="h-full rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
                <p className="text-2xl font-bold text-emerald-800">+50</p>
                <p className="mt-1 min-h-12 text-sm text-emerald-700">Starter task ideas</p>
              </div>
              <div className="h-full rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
                <p className="text-2xl font-bold text-emerald-800">3 levels</p>
                <p className="mt-1 min-h-12 text-sm text-emerald-700">Energy modes for smarter planning</p>
              </div>
              <div className="h-full rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
                <p className="text-2xl font-bold text-emerald-800">100%</p>
                <p className="mt-1 min-h-12 text-sm text-emerald-700">Designed for learning goals</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-sm">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Today tip</p>
                <p className="mt-1 text-sm leading-relaxed text-emerald-900/90">
                  Split study time into two 25-minute sessions with a 5-minute break to keep focus steady.
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-emerald-100 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Student feedback</p>
                <p className="mt-2 min-h-16 text-sm leading-relaxed text-emerald-900/90">
                  "{testimonials[activeTestimonialIndex].quote}"
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">{testimonials[activeTestimonialIndex].author}</p>
                    <p className="text-xs text-emerald-700/80">{testimonials[activeTestimonialIndex].role}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {testimonials.map((testimonial, index) => (
                      <button
                        key={`${testimonial.author}-${index}`}
                        type="button"
                        onClick={() => setActiveTestimonialIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeTestimonialIndex ? "w-6 bg-emerald-700" : "w-2.5 bg-emerald-300"
                        }`}
                        aria-label={`Show testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-fade-in-delay">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white/90 shadow-xl shadow-emerald-900/10">
              <div className="relative aspect-[16/9] w-full bg-emerald-50">
                {bannerImagePaths.map((imagePath, index) => (
                  <img
                    key={imagePath}
                    src={imagePath}
                    alt={`Homepage banner ${index + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      index === activeBannerIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 p-3">
                {bannerImagePaths.map((imagePath, index) => (
                  <button
                    key={`${imagePath}-dot`}
                    type="button"
                    onClick={() => setActiveBannerIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeBannerIndex ? "w-6 bg-emerald-700" : "w-2.5 bg-emerald-300"
                    }`}
                    aria-label={`Show banner ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <aside
              className={`mt-6 rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-xl shadow-emerald-900/5 ${
                isMobilePreview ? "" : "sm:p-7"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <BookOpen className="h-4 w-4" />
                Website overview
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-emerald-950">Study in a way that fits your energy</h2>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-emerald-900/90">
                <li className="rounded-xl bg-emerald-50 px-4 py-3">
                  Smart recommendations for low, medium, and high energy states.
                </li>
                <li className="rounded-xl bg-lime-50 px-4 py-3">
                  A distraction-light interface so you always know what to do next.
                </li>
                <li className="rounded-xl bg-green-50 px-4 py-3">
                  Track your progress and stay motivated every day.
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-700/95 p-4 text-emerald-50">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4" />
                  Built for students
                </div>
                <p className="mt-2 text-sm leading-relaxed text-emerald-50/95">
                  Works for both solo study and collaborative coursework.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={`font-fraunces text-emerald-950 ${isMobilePreview ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            What this homepage offers
          </h2>
          <div className={`mt-6 grid gap-4 ${isMobilePreview ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-4"}`}>
            {highlights.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10"
              >
                <div className="inline-flex rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-emerald-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800/85">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-sm sm:p-7">
            <h3 className="text-2xl font-semibold text-emerald-950">Quick start flow</h3>
            <div className="mt-5 space-y-3">
              {quickFlow.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/65 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{item.step}</p>
                  <p className="mt-1 text-base font-semibold text-emerald-900">{item.title}</p>
                  <p className="mt-1 text-sm text-emerald-800/85">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-900/10 bg-emerald-950 text-emerald-50">
        <div
          className={`mx-auto w-full px-4 py-8 ${
            isMobilePreview ? "max-w-md" : "max-w-6xl sm:px-6 lg:px-8"
          }`}
        >
          <p className="text-sm text-emerald-50/90">This website is for educational purposes only.</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-50/85">
            Built by: Lê Tấn Nguyện-2374802010354, Võ Ngọc Phú-2374802010354,
            Nguyễn Thanh Sơn-2374802010436, Trần Minh Khoa-2374802010341.
          </p>
        </div>
      </footer>

      <button
        type="button"
        onClick={toggleMusic}
        className={`fixed bottom-6 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:bg-emerald-900 ${
          isMobilePreview ? "right-4" : "right-5"
        }`}
        aria-label="Toggle background music"
      >
        <Music2 className="h-4 w-4" />
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            Stop music
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Play music
          </>
        )}
      </button>

      {musicError && (
        <div className="fixed bottom-24 right-5 z-30 w-72 rounded-2xl border border-red-200 bg-white/95 p-3 text-xs shadow-lg">
          <p className="text-red-600">{musicError}</p>
        </div>
      )}
    </div>
  );
}
