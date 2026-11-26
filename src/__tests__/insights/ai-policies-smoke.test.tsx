import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { insightPosts } from "@/lib/data/insights";
import { isSafeSitePath } from "@/lib/safe-url";
import { insightImageSizes, InsightMarkdown } from "@/components/insights/InsightMarkdown";

vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
    target,
    rel,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
    target?: string;
    rel?: string;
  }) => (
    <a href={href} className={className} target={target} rel={rel}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    // Test stand-in for next/image so jsdom can assert src/alt without the optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

const FEATURED_SLUG = "ai-policies-us-china-2026";
const INFOGRAPHICS = [
  "/research/ai-race-nov2026/infographics/a-us-vs-china.png",
  "/research/ai-race-nov2026/infographics/b-policy-blocs.png",
  "/research/ai-race-nov2026/infographics/c-lab-landscape.png",
] as const;

function publicFile(urlPath: string) {
  return path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
}

function markdownImages(body: string): { alt: string; src: string }[] {
  return [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((match) => ({
    alt: match[1],
    src: match[2],
  }));
}

describe("Insights public assets", () => {
  const featured = insightPosts.find((post) => post.slug === FEATURED_SLUG);

  it("ships the featured post with a safe PDF path and a markdown body", () => {
    expect(featured).toBeDefined();
    expect(featured?.title).toMatch(/US–China AI Race/i);
    expect(featured?.pdfUrl).toBeDefined();
    expect(isSafeSitePath(featured!.pdfUrl!)).toBe(true);
    expect(existsSync(publicFile(featured!.pdfUrl!))).toBe(true);
    expect(featured?.body).toBeTruthy();
  });

  it("keeps every referenced image and the PDF on disk, with alt text", () => {
    const body = featured!.body!;
    const images = markdownImages(body);
    expect(images.length).toBeGreaterThanOrEqual(3);
    for (const image of images) {
      expect(image.alt.trim().length).toBeGreaterThan(8);
      expect(isSafeSitePath(image.src)).toBe(true);
      expect(existsSync(publicFile(image.src)), image.src).toBe(true);
      expect(insightImageSizes[image.src], `missing size for ${image.src}`).toBeDefined();
    }
    for (const src of INFOGRAPHICS) {
      expect(images.some((image) => image.src === src)).toBe(true);
    }
  });

  it("does not include a fenced code block in the featured body", () => {
    expect(featured!.body!).not.toMatch(/```/);
  });
});

describe("Insights slug pages", () => {
  it("renders the featured brief with title, infographics, and PDF link, and without a code block", async () => {
    const { default: InsightDetailPage } = await import("@/app/insights/[slug]/page");
    const ui = await InsightDetailPage({
      params: Promise.resolve({ slug: FEATURED_SLUG }),
    });
    const { container } = render(ui);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /The US–China AI Race: models, compute, chips, and practical guardrails/i,
      }),
    ).toBeDefined();

    const pdfLinks = screen.getAllByRole("link", { name: /download the (typographic )?pdf/i });
    expect(pdfLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of pdfLinks) {
      expect(link.getAttribute("href")).toBe(
        "/research/ai-race-nov2026/wayalabs-ai-race-nov2026.pdf",
      );
    }

    for (const src of INFOGRAPHICS) {
      const image = container.querySelector(`img[src="${src}"]`);
      expect(image, src).not.toBeNull();
      expect(image?.getAttribute("alt")?.trim().length).toBeGreaterThan(8);
    }

    expect(container.querySelector("pre")).toBeNull();
    expect(container.querySelector("pre code")).toBeNull();
  });

  it("still renders every other Insights post", async () => {
    const { default: InsightDetailPage } = await import("@/app/insights/[slug]/page");
    const others = insightPosts.filter((post) => post.slug !== FEATURED_SLUG);
    expect(others.length).toBeGreaterThanOrEqual(1);

    for (const post of others) {
      const ui = await InsightDetailPage({
        params: Promise.resolve({ slug: post.slug }),
      });
      const { container, unmount } = render(ui);
      expect(
        screen.getByRole("heading", { level: 1, name: post.title }),
        post.slug,
      ).toBeDefined();
      expect(within(container).queryByRole("heading", { name: /full brief/i })).toBeNull();
      unmount();
    }
  });

  it("strips unsafe markdown destinations", () => {
    const { container } = render(
      <InsightMarkdown content={'[x](javascript:alert(1)) ![y](javascript:alert(1))'} />,
    );
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("x");
  });
});
