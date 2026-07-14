import { useMemo } from "react";
import "./NatureScenery.css";

const CLOUDS = [
  { top: "10%", scale: 1, duration: 46, delay: -4 },
  { top: "20%", scale: 0.65, duration: 62, delay: -30 },
  { top: "6%", scale: 0.5, duration: 38, delay: -14 },
];

const BIRDS = [
  { top: "22%", duration: 24, delay: -3 },
  { top: "30%", duration: 30, delay: -16 },
];

// Witches on broomsticks, crossing near the moon's altitude for the
// classic silhouette-against-the-moon look.
const WITCHES = [
  { top: "13%", duration: 34, delay: -6, scale: 1 },
  { top: "9%", duration: 46, delay: -28, scale: 0.7 },
];

const TREE_COUNT = 16;
const STAR_COUNT = 40;
const SAND_COUNT = 18;

export function NatureScenery() {
  const trees = useMemo(
    () =>
      Array.from({ length: TREE_COUNT }, (_, i) => ({
        left: (i / TREE_COUNT) * 100 + ((i * 13) % 5),
        scale: 0.7 + ((i * 53) % 40) / 100,
        delay: ((i * 7) % 10) * 0.35,
      })),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 53) % 60,
        delay: (i % 10) * 0.3,
      })),
    [],
  );

  const sandMotes = useMemo(
    () =>
      Array.from({ length: SAND_COUNT }, (_, i) => ({
        left: (i * 29) % 100,
        top: 30 + ((i * 41) % 60),
        duration: 6 + (i % 7),
        delay: -(i * 1.3),
      })),
    [],
  );

  return (
    <div className="nature-scenery" aria-hidden>
      <div className="nature-scenery__sky" />

      <div className="nature-scenery__stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="nature-scenery__star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="nature-scenery__sun" />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="nature-scenery__cloud"
          style={{
            top: c.top,
            transform: `scale(${c.scale})`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      {BIRDS.map((b, i) => (
        <svg
          key={i}
          className="nature-scenery__bird"
          viewBox="0 0 24 12"
          style={{
            top: b.top,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <path
            d="M0 6 Q6 0 12 6 Q18 0 24 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      ))}

      {WITCHES.map((w, i) => (
        <svg
          key={i}
          className="nature-scenery__witch"
          viewBox="0 0 34 20"
          style={{
            top: w.top,
            width: `${34 * w.scale}px`,
            height: `${20 * w.scale}px`,
            animationDuration: `${w.duration}s`,
            animationDelay: `${w.delay}s`,
          }}
        >
          <line
            x1="3"
            y1="16"
            x2="21"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <polygon points="0,17.5 6,13.5 6.5,17 3,19.5" fill="currentColor" />
          <polygon points="16,7.5 25,10 21,17.5 14,14.5" fill="currentColor" />
          <circle cx="24" cy="6.5" r="2.6" fill="currentColor" />
          <polygon points="20.8,6 27.5,4 24.4,-0.5" fill="currentColor" />
        </svg>
      ))}

      {sandMotes.map((s, i) => (
        <span
          key={i}
          className="nature-scenery__sand"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <div className="nature-scenery__hill-track nature-scenery__hill-track--palace">
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--palace" />
        </div>
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--palace" />
        </div>
      </div>

      <div className="nature-scenery__hill-track nature-scenery__hill-track--back">
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--back" />
        </div>
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--back" />
        </div>
      </div>

      <div className="nature-scenery__hill-track nature-scenery__hill-track--mid">
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--mid" />
        </div>
        <div className="nature-scenery__hill-segment">
          <div className="nature-scenery__hill-shape nature-scenery__hill-shape--mid" />
        </div>
      </div>

      <div className="nature-scenery__hill-track nature-scenery__hill-track--front">
        {[0, 1].map((segment) => (
          <div className="nature-scenery__hill-segment" key={segment}>
            <div className="nature-scenery__hill-shape nature-scenery__hill-shape--front" />
            <div className="nature-scenery__trees">
              {trees.map((t, i) => (
                <div
                  key={i}
                  className="nature-scenery__tree"
                  style={{
                    left: `${t.left}%`,
                    transform: `scale(${t.scale})`,
                    animationDelay: `${t.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
