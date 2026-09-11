import { useState, useEffect, useRef, useCallback } from "react";

interface CategoryBannerSliderProps {
  banners: string[];
  alt: string;
  priority?: boolean;
}

export function CategoryBannerSlider({
  banners,
  alt,
  priority = false,
}: CategoryBannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, total, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Single banner image (no slider controls)
  if (total <= 1) {
    return (
      <div className="curation-edge-banner">
        <img
          src={encodeURI(banners[0] || "")}
          alt={alt}
          className="curation-edge-banner-img"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }

  // Multi-banner responsive slider
  return (
    <div
      className="curation-edge-banner relative select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={`${alt} Banner Slider`}
    >
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((src, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative">
            <img
              src={encodeURI(src)}
              alt={`${alt} banner ${idx + 1}`}
              className="curation-edge-banner-img"
              loading={priority && idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-80 group-hover:opacity-100 z-10 shadow-lg"
        aria-label="Previous banner"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-80 group-hover:opacity-100 z-10 shadow-lg"
        aria-label="Next banner"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/35 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === current
                ? "w-6 h-2 bg-[#9a2828] border border-white/40 shadow-xs"
                : "w-2 h-2 bg-white/70 hover:bg-white"
            }`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
