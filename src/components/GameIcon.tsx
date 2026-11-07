import Image from "next/image";

/** A game's picture: its image when it has one, otherwise its emoji. Decorative (the name sits next to it). */
export default function GameIcon({
  emoji,
  image,
  size = 36,
}: {
  emoji: string;
  image?: string;
  /** Pixel size of the image; emojis keep the surrounding font size. */
  size?: number;
}) {
  if (!image) return <span aria-hidden>{emoji}</span>;
  return (
    <Image
      src={image}
      alt=""
      width={size}
      height={size}
      unoptimized
      aria-hidden
      className="inline-block shrink-0 align-[-0.2em]"
      style={{ width: size, height: size }}
    />
  );
}
