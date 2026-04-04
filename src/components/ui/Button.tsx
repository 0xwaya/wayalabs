import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#4f8ef7] to-[#9b6dff] text-white hover:opacity-90 shadow-lg",
  secondary:
    "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)]",
  ghost: "text-[var(--muted)] hover:text-[var(--foreground)]",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 rounded-lg text-sm",
  md: "px-6 py-3 rounded-xl text-sm",
  lg: "px-7 py-3.5 rounded-xl text-sm",
};

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
