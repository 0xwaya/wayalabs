import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, ButtonLink } from "@/components/ui/Button";

vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("applies primary variant gradient class by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button").className).toContain("bg-gradient-to-r");
  });

  it("applies secondary variant border class", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button").className).toContain("border");
  });

  it("applies ghost variant — no gradient", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).not.toContain("bg-gradient-to-r");
  });

  it("applies sm size padding class", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("px-4");
  });

  it("applies md size padding class (default)", () => {
    render(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button").className).toContain("px-6");
  });

  it("applies lg size padding class", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("px-7");
  });

  it("forwards an additional className without discarding base classes", () => {
    render(<Button className="w-full">Full</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("w-full");
    expect(btn.className).toContain("inline-flex");
  });

  it("passes through disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });

  it("passes through type='submit'", () => {
    render(<Button type="submit">Submit</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).type).toBe("submit");
  });
});

describe("ButtonLink", () => {
  it("renders as an anchor element", () => {
    render(<ButtonLink href="/contact">Contact</ButtonLink>);
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link.tagName).toBe("A");
  });

  it("sets the correct href attribute", () => {
    render(<ButtonLink href="/about">About</ButtonLink>);
    expect((screen.getByRole("link") as HTMLAnchorElement).href).toContain("/about");
  });

  it("applies primary variant gradient class by default", () => {
    render(<ButtonLink href="/">Home</ButtonLink>);
    expect(screen.getByRole("link").className).toContain("bg-gradient-to-r");
  });

  it("applies secondary variant border class", () => {
    render(
      <ButtonLink href="/" variant="secondary">
        Secondary
      </ButtonLink>,
    );
    expect(screen.getByRole("link").className).toContain("border");
  });

  it("applies sm size padding class", () => {
    render(
      <ButtonLink href="/" size="sm">
        Small
      </ButtonLink>,
    );
    expect(screen.getByRole("link").className).toContain("px-4");
  });
});
