import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";

const baseUrl = `${(import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL}`;

const profileImages = [
  "a1.jpg",
  "a2.jpg",
  "a3.jpg",
  "a4.jpg",
  "a5.jpg",
  "a6.jpg",
  "a7.jpg",
];

const loadingImage = "loadingp.jpg";

export default function OmeTV() {
  const { viewMode } = useApp();
  const isDesktop = viewMode === "desktop";

  const imageUrls = useMemo(() => profileImages.map((file) => `${baseUrl}omeTV/${file}`), []);
  const loadingUrl = `${baseUrl}omeTV/${loadingImage}`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(imageUrls[0]);
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const handleFindNext = () => {
    if (isLoadingTransition || imageUrls.length === 0) {
      return;
    }

    setIsLoadingTransition(true);
    setDisplayedImage(loadingUrl);

    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % imageUrls.length;
        setDisplayedImage(imageUrls[nextIndex]);
        return nextIndex;
      });
      setIsLoadingTransition(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`min-h-full ${isDesktop ? "px-8 pt-8 pb-10" : "px-5 pt-8 pb-8"}`}>
      <div className="mb-6">
        <h1 className={`font-semibold text-gray-900 mb-1 ${isDesktop ? "text-4xl" : "text-3xl"}`}>OmeStudy</h1>
        <p className="text-gray-500">Study-call style UI demo with rotating profile images.</p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className={`grid gap-4 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/95 aspect-[4/3] relative" aria-label="Matched panel">
            <img
              src={displayedImage}
              alt={isLoadingTransition ? "Finding next person" : "Matched profile"}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoadingTransition ? "opacity-70" : "opacity-100"}`}
            />

            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/50 text-white text-xs font-medium tracking-wide">
              Match #{currentIndex + 1}
            </div>

            {isLoadingTransition && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <div className="px-4 py-2 rounded-full bg-white/90 text-gray-800 text-sm font-medium flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Finding next person...
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-[4/3] relative" aria-label="Your camera panel">
            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/10 text-white text-xs font-medium tracking-wide">
              You
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleFindNext}
            disabled={isLoadingTransition}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingTransition ? "animate-spin" : ""}`} />
            Find next person
          </button>
        </div>
      </section>
    </div>
  );
}
