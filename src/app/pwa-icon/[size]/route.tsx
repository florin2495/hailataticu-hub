import { renderIcon } from "@/lib/pwa-icon";

const SIZES: Record<string, [number, number]> = {
  "192": [192, 0.62],
  "512": [512, 0.62],
  maskable: [512, 0.5],
};

export function generateStaticParams() {
  return Object.keys(SIZES).map((size) => ({ size }));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ size: string }> },
) {
  const { size } = await ctx.params;
  const spec = SIZES[size];
  if (!spec) return new Response("Not found", { status: 404 });
  return renderIcon(spec[0], spec[1]);
}
