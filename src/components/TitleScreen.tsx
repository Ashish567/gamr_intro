import { useSpring, animated, useTrail } from "@react-spring/web";
import { useKeyboard } from "../hooks/useKeyboard";
import { sfx } from "../audio/beep";
import { profile } from "../config/content";
import "./TitleScreen.css";

interface TitleScreenProps {
  onStart: () => void;
}

const LINES = [profile.name, profile.role];

export function TitleScreen({ onStart }: TitleScreenProps) {
  const container = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 120, friction: 20 },
  });

  const trail = useTrail(LINES.length, {
    from: { opacity: 0, transform: "translateY(-24px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 210, friction: 14 },
    delay: 200,
  });

  const start = () => {
    sfx.confirm();
    onStart();
  };

  useKeyboard({
    Enter: start,
  });

  return (
    <animated.div className="title-screen" style={container}>
      <div className="title-screen__eyebrow">A SOFTWARE ENGINEER'S SANDS OF TIME</div>

      <div>
        {trail.map((style, i) => (
          <animated.div
            key={LINES[i]}
            style={style}
            className={i === 0 ? "title-screen__name" : "title-screen__role"}
          >
            {LINES[i]}
          </animated.div>
        ))}
      </div>

      <div className="title-screen__press-start" onClick={start}>
        PRESS START
      </div>

      <div className="title-screen__hint">
        ARROW KEYS TO MOVE &middot; ENTER TO SELECT
      </div>
    </animated.div>
  );
}
