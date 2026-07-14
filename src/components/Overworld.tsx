import { useMemo, useRef, useState, type CSSProperties } from "react";
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

function computePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const x = count === 1 ? 50 : 12 + (i * 76) / (count - 1);
    const y = 50 + Math.sin(i * 1.8 + 0.4) * 24;
    return { x, y };
  });
}

export function Overworld({
  onSelect,
  onExit,
  interactive = true,
}: OverworldProps) {
  const positions = useMemo(() => computePositions(navNodes.length), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [walking, setWalking] = useState(false);
  const facingRef = useRef<"left" | "right">("right");

  const [{ x, y }, api] = useSpring(() => ({
    x: positions[0].x,
    y: positions[0].y,
    config: { tension: 170, friction: 22 },
  }));

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
        <div>
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
