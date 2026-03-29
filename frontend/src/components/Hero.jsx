import { useEffect, useState, useRef, useCallback, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const AUTO_PLAY_INTERVAL = 4000;

const Hero = () => {
  const { backendUrl } = useContext(ShopContext);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/slides/hero-slides`,
        );
        setSlides(response.data.slides);
      } catch (err) {
        console.error("Failed to fetch hero slides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [slides.length, next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
  };

  const goTo = (index) => {
    setCurrent(index);
    resetTimer();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
      resetTimer();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        border: "1px solid #9ca3af",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding track */}
      <div
        style={{
          display: "flex",
          transition: "transform 500ms ease-in-out",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, i) => {
          const hasText =
            slide.eyebrow ||
            slide.heading ||
            slide.subheading ||
            slide.cta?.label;

          return (
            <div
              key={slide._id || i}
              style={{
                minWidth: "100%",
                display: "flex",
                flexDirection: "row",
                minHeight: "500px",
              }}
            >
              {/* Left text panel — only if text exists */}
              {hasText && (
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 32px",
                    backgroundColor: slide.bgColor || "#ffffff",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ color: slide.textColor || "#414141" }}>
                    {slide.eyebrow && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            width: "44px",
                            height: "2px",
                            backgroundColor: slide.textColor || "#414141",
                          }}
                        />
                        <p
                          style={{
                            fontWeight: 500,
                            fontSize: "14px",
                            textTransform: "uppercase",
                          }}
                        >
                          {slide.eyebrow}
                        </p>
                      </div>
                    )}

                    {slide.heading && (
                      <h1
                        className="prata-regular"
                        style={{
                          fontSize: "clamp(1.5rem, 3vw, 3rem)",
                          lineHeight: "1.4",
                          margin: "12px 0",
                        }}
                      >
                        {slide.heading}
                      </h1>
                    )}

                    {slide.subheading && (
                      <p style={{ fontSize: "14px", marginBottom: "16px" }}>
                        {slide.subheading}
                      </p>
                    )}

                    {slide.cta?.label && (
                      <a
                        href={slide.cta?.url || "#"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: 600,
                          fontSize: "14px",
                          textDecoration: "none",
                          color: slide.textColor || "#414141",
                        }}
                      >
                        <span style={{ textTransform: "uppercase" }}>
                          {slide.cta?.label}
                        </span>
                        <span
                          style={{
                            width: "44px",
                            height: "1px",
                            backgroundColor: slide.textColor || "#414141",
                          }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Image — full width if no text, half if text exists */}
              <div
                style={{
                  width: hasText ? "50%" : "100%",
                  minHeight: "500px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.heading || "slide"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    minHeight: "500px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full border-none cursor-pointer transition-all duration-300 ${
              i === current ? "w-7 h-3 bg-[#414141]" : "w-5 h-5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
