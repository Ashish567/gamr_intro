import { useEffect, useRef } from "react";

export type GameKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | " "
  | "Escape";

export type KeyHandlers = Partial<Record<GameKey, () => void>>;

const TRACKED: GameKey[] = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  " ",
  "Escape",
];

/**
 * Fires handlers on keydown for game-relevant keys and prevents the
 * default scroll/behavior. Handlers are read from a ref each render so
 * callers don't need to memoize them.
 */
export function useKeyboard(handlers: KeyHandlers, active = true) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!active) return;

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key as GameKey;
      if (!TRACKED.includes(key)) return;
      const handler = handlersRef.current[key];
      if (!handler) return;
      e.preventDefault();
      if (e.repeat) return;
      handler();
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);
}
