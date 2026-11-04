/** Shared OG/Twitter image. Next.js replaces (not merges) openGraph per page, so pages must re-include images. */
export const ogImages = [
  { url: "/og.png", width: 1200, height: 630, alt: "Wayalabs ribbon mark and Wayalabs.com" },
];
export const pageOpenGraph = (url: string) => ({ url, images: ogImages });
