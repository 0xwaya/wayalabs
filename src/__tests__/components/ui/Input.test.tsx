import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input, Textarea } from "@/components/ui/Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter name" />);
    expect(screen.getByPlaceholderText("Enter name")).toBeDefined();
  });

  it("renders as an <input> tag", () => {
    render(<Input placeholder="check-tag" />);
    expect(screen.getByPlaceholderText("check-tag").tagName).toBe("INPUT");
  });

  it("applies base rounded-xl class", () => {
    render(<Input placeholder="test" />);
    expect(screen.getByPlaceholderText("test").className).toContain("rounded-xl");
  });

  it("applies full-width class", () => {
    render(<Input placeholder="test-w" />);
    expect(screen.getByPlaceholderText("test-w").className).toContain("w-full");
  });

  it("merges an additional className without dropping base classes", () => {
    render(<Input placeholder="extra" className="extra-class" />);
    const input = screen.getByPlaceholderText("extra");
    expect(input.className).toContain("extra-class");
    expect(input.className).toContain("rounded-xl");
  });

  it("forwards name prop", () => {
    render(<Input name="email" placeholder="Email" />);
    expect((screen.getByPlaceholderText("Email") as HTMLInputElement).name).toBe("email");
  });

  it("forwards type prop", () => {
    render(<Input type="email" placeholder="Email" />);
    expect((screen.getByPlaceholderText("Email") as HTMLInputElement).type).toBe("email");
  });

  it("forwards required prop", () => {
    render(<Input required placeholder="Required" />);
    expect((screen.getByPlaceholderText("Required") as HTMLInputElement).required).toBe(true);
  });
});

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Your message" />);
    expect(screen.getByPlaceholderText("Your message").tagName).toBe("TEXTAREA");
  });

  it("applies resize-none class", () => {
    render(<Textarea placeholder="msg" />);
    expect(screen.getByPlaceholderText("msg").className).toContain("resize-none");
  });

  it("applies base rounded-xl class", () => {
    render(<Textarea placeholder="base-check" />);
    expect(screen.getByPlaceholderText("base-check").className).toContain("rounded-xl");
  });

  it("forwards rows prop", () => {
    render(<Textarea placeholder="row-check" rows={5} />);
    expect((screen.getByPlaceholderText("row-check") as HTMLTextAreaElement).rows).toBe(5);
  });

  it("merges additional className with base classes", () => {
    render(<Textarea placeholder="cls-check" className="min-h-32" />);
    const ta = screen.getByPlaceholderText("cls-check");
    expect(ta.className).toContain("min-h-32");
    expect(ta.className).toContain("resize-none");
  });
});
