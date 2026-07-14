import { useEffect, useRef, useState } from "react";
import { useSpring, animated, to, easings } from "@react-spring/web";
import { useKeyboard } from "../hooks/useKeyboard";
import { sfx } from "../audio/beep";
import { PixelSprite } from "./PixelSprite";
import { skills } from "../config/content";
import {
  heroMatrix,
  heroRunMatrixA,
  heroRunMatrixB,
  heroPalette,
  barrelMatrix,
  barrelPalette,
  coneMatrix,
  conePalette,
  crateMatrix,
  cratePalette,
  caltropMatrix,
  caltropPalette,
} from "../config/sprites";
import "./CarRunner.css";

type ObstacleType = "barrel" | "cone" | "crate" | "caltrop";

const OBSTACLE_TYPES: Record<
  ObstacleType,
  { matrix: string[]; palette: Record<string, string>; width: number }
> = {
  barrel: { matrix: barrelMatrix, palette: barrelPalette, width: 56 },
  cone: { matrix: coneMatrix, palette: conePalette, width: 42 },
  crate: { matrix: crateMatrix, palette: cratePalette, width: 56 },
  caltrop: { matrix: caltropMatrix, palette: caltropPalette, width: 49 },
};
const OBSTACLE_TYPE_LIST = Object.keys(OBSTACLE_TYPES) as ObstacleType[];

interface ObstacleMeta {
  id: number;
  type: ObstacleType;
}

interface ObstacleState {
  x: number;
  width: number;
  awarded: boolean;
}

interface SkillPopup {
  id: number;
  text: string;
}

const PLAYER_PIXEL_SIZE = 6;
const PLAYER_WIDTH = 10 * PLAYER_PIXEL_SIZE;
// Wide obstacles (barrel/crate, 56px) can sit in the player's X-range for
// ~450-530ms at the speeds seen in the first few seconds of a run. The old
// -32 threshold only counted ~350ms of the arc as "cleared", so those
// obstacles were mathematically un-clearable no matter how well-timed the
// jump was. -22 (paired with the taller/longer arc below) gives ~525ms.
const JUMP_CLEAR_Y = -22;
const BEST_KEY = "gamr-intro-best-score";
const FALLBACK_WIDTH = 1280;
const HUD_UPDATE_INTERVAL = 90;
const RUN_FRAME_INTERVAL = 110;

let nextObstacleId = 0;

function readBest(): number {
  if (typeof window === "undefined") return 0;
  const stored = window.localStorage.getItem(BEST_KEY);
  return stored ? parseInt(stored, 10) || 0 : 0;
}

interface CarRunnerProps {
  playable: boolean;
}

export function CarRunner({ playable }: CarRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreElRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef(new Map<number, HTMLDivElement>());
  const positionsRef = useRef(new Map<number, ObstacleState>());
  const playerXRef = useRef(0);

  // Rendered obstacle list is structural only (id/type). Position/width live
  // in refs and are pushed straight to the DOM every frame — keeping this out
  // of React state avoids a 60fps re-render storm of the pixel-art sprites.
  const [obstacles, setObstacles] = useState<ObstacleMeta[]>([]);
  const [best, setBest] = useState(readBest);
  const [paused, setPaused] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [playerX, setPlayerX] = useState(0);
  const [running, setRunning] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [popup, setPopup] = useState<SkillPopup | null>(null);
  const popupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupIdRef = useRef(0);

  const playableRef = useRef(playable);
  const pausedRef = useRef(paused);
  const crashedRef = useRef(crashed);
  const jumpingRef = useRef(false);
  const scoreAccumRef = useRef(0);
  const spawnAccumRef = useRef(0);
  const nextSpawnRef = useRef(1000);
  const speedRef = useRef(220);

  useEffect(() => {
    playableRef.current = playable;
  }, [playable]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    crashedRef.current = crashed;
  }, [crashed]);

  // Keep the runner centered on the track regardless of viewport width.
  useEffect(() => {
    const updatePosition = () => {
      const width = containerRef.current?.clientWidth ?? FALLBACK_WIDTH;
      const x = width / 2 - PLAYER_WIDTH / 2;
      playerXRef.current = x;
      setPlayerX(x);
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  // The character auto-runs in step with the scrolling road (this is an
  // endless runner — legs/arms should always be mid-stride while the scene
  // is active), pausing only when paused, crashed, or off-screen.
  useEffect(() => {
    setRunning(playable && !paused && !crashed);
  }, [playable, paused, crashed]);

  useEffect(() => {
    if (!running) {
      setRunFrame(0);
      return;
    }
    const id = setInterval(() => setRunFrame((f) => (f === 0 ? 1 : 0)), RUN_FRAME_INTERVAL);
    return () => clearInterval(id);
  }, [running]);

  const [{ y, spin }, api] = useSpring(() => ({
    y: 0,
    spin: 0,
    config: { tension: 300, friction: 20 },
  }));

  // A different flourish each jump keeps the runner feeling alive instead
  // of mechanically repeating the same arc — a full spin most of the time,
  // occasionally a double spin or a sharp snap-turn.
  const JUMP_MOTIONS = [
    { spin: 360, weight: 3 },
    { spin: -360, weight: 3 },
    { spin: 720, weight: 1 },
    { spin: 180, weight: 2 },
  ];
  const pickJumpSpin = () => {
    const table = JUMP_MOTIONS.flatMap((m) => Array(m.weight).fill(m.spin));
    return table[Math.floor(Math.random() * table.length)];
  };

  // Duration-based (not tension/friction) so the arc is exact and
  // predictable: physical springs either overshoot and bounce before
  // settling (real airtime way longer than it looks — the previous bug)
  // or, once clamped to stop overshoot, reach "rest" so fast the character
  // barely leaves the ground long enough to clear anything. A taller, longer
  // arc gives a real ~525ms of clearance (y at/above JUMP_CLEAR_Y), enough
  // to clear the widest obstacles even early in a run when speed is low
  // (see JUMP_CLEAR_Y comment), with no hidden lockout tail after landing.
  const jump = () => {
    if (jumpingRef.current || crashedRef.current || pausedRef.current) return;
    jumpingRef.current = true;
    sfx.move();
    const spinTarget = pickJumpSpin();
    api.set({ spin: 0 });
    api.start({
      to: async (next) => {
        await next({
          y: -60,
          spin: spinTarget,
          config: { duration: 300, easing: easings.easeOutQuad },
        });
        await next({
          y: 0,
          config: { duration: 360, easing: easings.easeInQuad },
        });
        api.set({ spin: 0 });
      },
      onRest: () => {
        jumpingRef.current = false;
      },
    });
  };

  const togglePause = () => {
    if (!playableRef.current) return;
    setPaused((p) => !p);
    sfx.select();
  };

  const showSkillPopup = () => {
    const skill = skills[Math.floor(Math.random() * skills.length)];
    if (!skill) return;
    popupIdRef.current += 1;
    setPopup({ id: popupIdRef.current, text: skill.name });
    sfx.confirm();
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    popupTimeoutRef.current = setTimeout(() => setPopup(null), 1300);
  };

  useKeyboard(
    {
      ArrowUp: jump,
      " ": jump,
      Escape: togglePause,
    },
    playable,
  );

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();
    let lastHudUpdate = 0;

    const triggerCrash = () => {
      crashedRef.current = true;
      setCrashed(true);
      sfx.back();
      const finalScore = Math.floor(scoreAccumRef.current / 100);
      setBest((b) => {
        const nextBest = Math.max(b, finalScore);
        window.localStorage.setItem(BEST_KEY, String(nextBest));
        return nextBest;
      });

      setTimeout(() => {
        positionsRef.current.clear();
        elRefs.current.clear();
        setObstacles([]);
        scoreAccumRef.current = 0;
        spawnAccumRef.current = 0;
        if (scoreElRef.current) scoreElRef.current.textContent = "SCORE 0000";
        crashedRef.current = false;
        setCrashed(false);
      }, 900);
    };

    const tick = (time: number) => {
      const delta = Math.min(time - lastTime, 48);
      lastTime = time;

      if (!pausedRef.current && !crashedRef.current) {
        const width = containerRef.current?.clientWidth ?? FALLBACK_WIDTH;
        speedRef.current = 220 + Math.min(scoreAccumRef.current / 40, 160);
        const moveBy = (speedRef.current * delta) / 1000;

        let needsPrune = false;
        for (const [id, state] of positionsRef.current) {
          state.x -= moveBy;
          const el = elRefs.current.get(id);
          if (el) el.style.left = `${state.x}px`;
          if (state.x < -50) needsPrune = true;
        }

        if (needsPrune) {
          setObstacles((prev) =>
            prev.filter((o) => {
              const alive = (positionsRef.current.get(o.id)?.x ?? -999) >= -50;
              if (!alive) {
                positionsRef.current.delete(o.id);
                elRefs.current.delete(o.id);
              }
              return alive;
            }),
          );
        }

        spawnAccumRef.current += delta;
        if (spawnAccumRef.current > nextSpawnRef.current) {
          spawnAccumRef.current = 0;
          // Wider, more forgiving gap — the previous 0.9-1.8s window could
          // land a new obstacle before the jump animation's lockout even
          // cleared once speed ramped up, making later obstacles unavoidable.
          nextSpawnRef.current = 1500 + Math.random() * 1100;
          const id = nextObstacleId++;
          const type =
            OBSTACLE_TYPE_LIST[
              Math.floor(Math.random() * OBSTACLE_TYPE_LIST.length)
            ];
          positionsRef.current.set(id, {
            x: width + 20,
            width: OBSTACLE_TYPES[type].width,
            awarded: false,
          });
          setObstacles((prev) => [...prev, { id, type }]);
        }

        if (playableRef.current) {
          scoreAccumRef.current += delta;

          if (time - lastHudUpdate > HUD_UPDATE_INTERVAL) {
            lastHudUpdate = time;
            if (scoreElRef.current) {
              const displayScore = Math.floor(scoreAccumRef.current / 100);
              scoreElRef.current.textContent = `SCORE ${displayScore.toString().padStart(4, "0")}`;
            }
          }

          const playerLeft = playerXRef.current;
          const playerRight = playerLeft + PLAYER_WIDTH;
          const playerY = y.get();
          for (const state of positionsRef.current.values()) {
            const overlapX = playerRight > state.x && playerLeft < state.x + state.width;
            if (!overlapX) continue;
            if (playerY > JUMP_CLEAR_Y) {
              triggerCrash();
              break;
            }
            if (!state.awarded) {
              state.awarded = true;
              showSkillPopup();
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [y]);

  const playerMatrix = running ? (runFrame === 0 ? heroRunMatrixA : heroRunMatrixB) : heroMatrix;

  return (
    <div className="car-runner" ref={containerRef}>
      <div className="car-runner__texture" />
      <div
        className="car-runner__grass"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />
      <div
        className="car-runner__guardrail"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />

      <div
        className="car-runner__road"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />
      <div
        className="car-runner__road car-runner__road--shoulder"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />
      <div
        className="car-runner__curb"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />

      <animated.div
        className={`car-runner__player ${crashed ? "car-runner__player--crashed" : ""}`}
        style={{
          left: playerX,
          transform: to(
            [y, spin],
            (yv, sv) => `translateY(${yv}px) rotate(${sv}deg)`,
          ),
        }}
      >
        <PixelSprite matrix={playerMatrix} palette={heroPalette} pixelSize={PLAYER_PIXEL_SIZE} />
      </animated.div>

      {popup && (
        <div
          key={popup.id}
          className="car-runner__skill-popup"
          style={{ left: playerX + PLAYER_WIDTH / 2 }}
        >
          +{popup.text}
        </div>
      )}

      {obstacles.map((o) => (
        <div
          className="car-runner__obstacle"
          key={o.id}
          ref={(el) => {
            if (el) elRefs.current.set(o.id, el);
            else elRefs.current.delete(o.id);
          }}
          style={{ left: positionsRef.current.get(o.id)?.x ?? -100 }}
        >
          <PixelSprite
            matrix={OBSTACLE_TYPES[o.type].matrix}
            palette={OBSTACLE_TYPES[o.type].palette}
            pixelSize={7}
          />
        </div>
      ))}

      {playable && (
        <div className="car-runner__hud">
          <div className="car-runner__stats">
            <div className="car-runner__score" ref={scoreElRef}>
              SCORE 0000
            </div>
            <div className="car-runner__best">
              BEST {best.toString().padStart(4, "0")}
            </div>
          </div>
          <div className="car-runner__hint">
            {paused ? "PAUSED · ESC TO RESUME" : "↑/SPACE JUMP · ESC PAUSE"}
          </div>
        </div>
      )}
    </div>
  );
}
