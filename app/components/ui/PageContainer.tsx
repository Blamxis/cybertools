import { cn } from "@/app/lib/utils";
import React from "react";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function PageContainer({
  className,
  size = "md",
  ...props
}: PageContainerProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 py-10",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
