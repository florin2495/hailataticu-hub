import { ImageResponse } from "next/og";

// Opaque icon: indigo background, white dice with five pips.
// `scale` is the dice size as a fraction of the canvas (maskable stays inside the 80% safe zone).
export function renderIcon(size: number, scale: number) {
  const dice = Math.round(size * scale);
  const pip = Math.round(dice * 0.17);
  const inset = Math.round(dice * 0.2);
  const pos = [
    { top: inset, left: inset },
    { top: inset, right: inset },
    { top: (dice - pip) / 2, left: (dice - pip) / 2 },
    { bottom: inset, left: inset },
    { bottom: inset, right: inset },
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#4f46e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: dice,
            height: dice,
            background: "#ffffff",
            borderRadius: Math.round(dice * 0.22),
            display: "flex",
            position: "relative",
          }}
        >
          {pos.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: pip,
                height: pip,
                borderRadius: pip,
                background: "#312e81",
                ...p,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
