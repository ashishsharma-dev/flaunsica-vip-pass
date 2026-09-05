import { useState, useEffect, useRef, useCallback } from "react";

export interface SlideItem {
  id: string;
  image: string;
  title: string;
  designer?: string;
  tagline?: string;
  category?: string;
}

interface CuratedSliderProps {
  items: SlideItem[];
  autoplayInterval?: number;
}

export function CuratedSlider({ items, autoplayInterval = 5000 }: CuratedSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = items.length;

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
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [isPaused, total, autoplayInterval, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (items.length === 0) return null;

  return (
    <div
      className="curated-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="curated-slider-viewport">
        <div
          className="curated-slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`curated-slide ${idx === current ? "is-active" : ""}`}
            >
              <div className="curated-slide-card">
                <div className="curated-slide-image-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="curated-slide-img"
                    loading="lazy"
                  />
                  <div className="curated-slide-gradient" />
                </div>
                <div className="curated-slide-info">
                  {item.category && (
                    <span className="curated-slide-cat">{item.category}</span>
                  )}
                  <h3 className="curated-slide-title">{item.title}</h3>
                  {item.designer && (
                    <p className="curated-slide-designer">Curated by {item.designer}</p>
                  )}
                  {item.tagline && (
                    <p className="curated-slide-tagline">{item.tagline}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {total > 1 && (
        <>
          <button
            type="button"
            className="slider-nav-btn btn-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="slider-nav-btn btn-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots-row">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`slider-dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
