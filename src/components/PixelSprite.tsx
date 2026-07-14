import { memo, type CSSProperties } from "react";
import "./PixelSprite.css";

export type PixelPalette = Record<string, string>;

interface PixelSpriteProps {
  matrix: string[];
  palette: PixelPalette;
  pixelSize?: number;
  facing?: "left" | "right";
  bob?: boolean;
  style?: CSSProperties;
  className?: string;
}

// Sprites render one <div> per pixel (dozens to 100+ per instance), so a
// parent re-render (e.g. CarRunner's run-cycle interval firing every 110ms
// while a key is held) would otherwise redo that whole diff for every
// mounted sprite even though matrix/palette rarely change.
export const PixelSprite = memo(function PixelSprite({
  matrix,
  palette,
  pixelSize = 4,
  facing = "right",
  bob = false,
  style,
  className,
}: PixelSpriteProps) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  return (
    <div
      className={["pixel-sprite", bob ? "pixel-sprite--bob" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
        transform: `${style?.transform ?? ""} scaleX(${facing === "left" ? -1 : 1})`,
        imageRendering: "pixelated",
      }}
    >
      {matrix.flatMap((row, y) =>
        [...row].map((char, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              background: char === "." ? "transparent" : palette[char],
            }}
          />
        )),
      )}
    </div>
  );
});
