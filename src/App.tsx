import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import { NatureScenery } from "./components/NatureScenery";
import { CRTOverlay } from "./components/CRTOverlay";
import { TitleScreen } from "./components/TitleScreen";
import { Overworld } from "./components/Overworld";
import { SectionPanel } from "./components/SectionPanel";
import { CarRunner } from "./components/CarRunner";
import { ThemeToggle } from "./components/ThemeToggle";
import { SoundToggle } from "./components/SoundToggle";
import { useTheme } from "./hooks/useTheme";
import { unlockAudio } from "./audio/beep";

type Scene = "title" | "overworld";

function App() {
  const [scene, setScene] = useState<Scene>("title");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const transitions = useTransition(scene, {
    from: { opacity: 0, transform: "scale(1.04)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.97)" },
    config: { tension: 210, friction: 24 },
    exitBeforeEnter: true,
  });

  return (
    <>
      <NatureScenery />
      <CRTOverlay />
      <CarRunner playable={scene === "title"} />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <SoundToggle />

      {transitions((style, item) =>
        item === "title" ? (
          <animated.div style={style}>
            <TitleScreen onStart={() => setScene("overworld")} />
          </animated.div>
        ) : (
          <animated.div style={style}>
            <Overworld
              onSelect={(id) => setActiveSection(id)}
              onExit={() => setScene("title")}
              interactive={!activeSection}
            />
          </animated.div>
        ),
      )}

      {activeSection && (
        <SectionPanel
          sectionId={activeSection}
          onClose={() => setActiveSection(null)}
        />
      )}
    </>
  );
}

export default App;
