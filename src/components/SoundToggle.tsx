import { useState } from "react";
import { sfx, setMuted, isMuted } from "../audio/beep";
import "./SoundToggle.css";

// Rendered as a sibling of the scene transitions in App.tsx (not nested
// inside TitleScreen) so it stays genuinely pinned to the viewport — a
// `position: fixed` element inside a `transform`-animated ancestor (the
// scene fade/scale transition) is fixed to that ancestor instead of the
// real viewport, which drifted the button into the theme toggle on mobile.
export function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfx.select();
  };

  return (
    <button className="sound-toggle" onClick={toggle}>
      {muted ? "SOUND: OFF" : "SOUND: ON"}
    </button>
  );
}
