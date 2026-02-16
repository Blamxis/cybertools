import { cn } from "@/app/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "glass" | "bordered";
}

export function Card({
  className,
  padding = "md",
  variant = "default",
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const variantClasses = {
    default: "bg-neutral-900 border border-neutral-800 rounded-lg",
    glass:
      "bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-lg",
    bordered:
      "bg-neutral-900 border-2 border-neutral-700 rounded-lg",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        "shadow-[0_0_20px_-5px_rgba(0,0,0,0.4)] transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}
