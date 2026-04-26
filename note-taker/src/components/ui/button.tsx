"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md transition-colors",
          {
            "bg-[var(--ink-primary)] text-white hover:opacity-90": variant === "primary",
            "bg-transparent border border-[var(--border)] text-[var(--ink-primary)] hover:bg-[var(--hover-surface)]": variant === "secondary",
            "bg-transparent text-[var(--ink-secondary)] hover:bg-[var(--hover-surface)]": variant === "ghost",
            "bg-[var(--danger)] text-white hover:opacity-90": variant === "danger",
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };