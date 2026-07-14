import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useKeyboard } from "../hooks/useKeyboard";
import { sfx } from "../audio/beep";
import { navNodes, profile } from "../config/content";
import { PixelSprite } from "./PixelSprite";
import { heroMatrix, heroPalette } from "../config/sprites";
import "./Overworld.css";

interface OverworldProps {
  onSelect: (nodeId: string) => void;
  onExit: () => void;
  interactive?: boolean;
}

// Each node gets its own resting hue instead of a uniform gold — lets the
// map read as a color-coded legend rather than only differentiating on hover.
const NODE_ACCENT: Record<string, string> = {
  about: "var(--accent)",
  skills: "var(--accent-3)",
  experience: "var(--accent-5)",
  projects: "var(--accent-2)",
  contact: "var(--panel-border)",
};

// The wide horizontal spread (nodes strung out left-to-right with a
// sine-wave vertical stagger) only has room to breathe on a desktop-width
// screen. Percentages that give 70+px of gap at 1280px compress to ~15px
// on a 375px phone, so badges and labels collide. Below the mobile
// breakpoint, stack nodes in a single vertical column instead.
function computePositions(count: number, vertical: boolean) {
  return Array.from({ length: count }, (_, i) => {
    if (vertical) {
      // Starts below the HUD + hint bar and ends above the CarRunner
      // strip at the bottom of the screen (see the matching CSS media
      // query that repositions .overworld__hint to make room up top).
      const x = 50;
      const y = count === 1 ? 50 : 26 + (i * 48) / (count - 1);
      return { x, y };
    }
    const x = count === 1 ? 50 : 12 + (i * 76) / (count - 1);
    const y = 50 + Math.sin(i * 1.8 + 0.4) * 24;
    return { x, y };
  });
}

const MOBILE_BREAKPOINT = 640;

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isNarrow;
}

export function Overworld({
  onSelect,
  onExit,
  interactive = true,
}: OverworldProps) {
  const isNarrow = useIsNarrow();
  const positions = useMemo(
    () => computePositions(navNodes.length, isNarrow),
    [isNarrow],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [walking, setWalking] = useState(false);
  const facingRef = useRef<"left" | "right">("right");

  const [{ x, y }, api] = useSpring(() => ({
    x: positions[0].x,
    y: positions[0].y,
    config: { tension: 170, friction: 22 },
  }));

  // Re-snap the avatar (no animation) if the layout switches between the
  // wide horizontal spread and the narrow vertical stack — e.g. resizing
  // or rotating across the mobile breakpoint — since `positions` itself
  // changes shape and the old coordinates no longer line up with any node.
  useEffect(() => {
    api.set({ x: positions[activeIndex].x, y: positions[activeIndex].y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  const moveTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= navNodes.length) return;
    if (nextIndex === activeIndex) return;
    facingRef.current =
      positions[nextIndex].x >= positions[activeIndex].x ? "right" : "left";
    setActiveIndex(nextIndex);
    setWalking(true);
    sfx.move();
    api.start({
      x: positions[nextIndex].x,
      y: positions[nextIndex].y,
      onRest: () => setWalking(false),
    });
  };

  useKeyboard({
    ArrowRight: () => moveTo(activeIndex + 1),
    ArrowDown: () => moveTo(activeIndex + 1),
    ArrowLeft: () => moveTo(activeIndex - 1),
    ArrowUp: () => moveTo(activeIndex - 1),
    Enter: () => {
      sfx.select();
      onSelect(navNodes[activeIndex].id);
    },
    " ": () => {
      sfx.select();
      onSelect(navNodes[activeIndex].id);
    },
    Escape: () => {
      sfx.back();
      onExit();
    },
  }, interactive);

  const pathD = positions
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const activeNode = navNodes[activeIndex];

  return (
    <div className="overworld">
      <div className="overworld__hud">
        <div className="overworld__hud-left">
          <div className="overworld__title">{profile.name.toUpperCase()}</div>
          <div className="overworld__subtitle">WORLD MAP</div>
        </div>
      </div>

      <svg
        className="overworld__path-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-5)"
          strokeWidth={0.6}
          strokeDasharray="2.2 2.2"
          opacity={0.65}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {navNodes.map((node, i) => (
        <button
          key={node.id}
          className={`overworld__node ${i === activeIndex ? "overworld__node--active" : ""}`}
          style={{
            left: `${positions[i].x}%`,
            top: `${positions[i].y}%`,
            background: "none",
            border: "none",
            "--node-accent": NODE_ACCENT[node.id] ?? "var(--accent)",
          } as CSSProperties}
          onClick={() => {
            if (i === activeIndex) {
              sfx.select();
              onSelect(node.id);
            } else {
              moveTo(i);
            }
          }}
        >
          <div className="overworld__node-badge">{node.icon}</div>
          <div className="overworld__node-label">{node.label}</div>
        </button>
      ))}

      <animated.div
        className="overworld__avatar"
        style={{
          left: x.to((v) => `${v}%`),
          top: y.to((v) => `calc(${v}% - 2.2rem)`),
        }}
      >
        <PixelSprite
          matrix={heroMatrix}
          palette={heroPalette}
          pixelSize={4}
          facing={facingRef.current}
          bob={walking}
        />
      </animated.div>

      <div className="overworld__hint">
        &larr; &rarr; MOVE &middot; ENTER: OPEN "{activeNode.label}" &middot;
        ESC: TITLE
      </div>
    </div>
  );
}
