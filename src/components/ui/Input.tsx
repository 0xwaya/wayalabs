import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm transition-colors focus:outline-none focus:border-[#4f8ef7]";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(inputBase, "resize-none", className)} {...props} />;
}
