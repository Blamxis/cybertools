import { cn } from "@/app/lib/utils";
import { Button } from "./Button";
import React from "react";

interface TerminalBoxProps {
  output: string;
  className?: string;
  copy?: boolean;
}

export function TerminalBox({ output, className, copy = true }: TerminalBoxProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "bg-black/80 border border-neutral-800 rounded-md p-4 font-mono text-sm text-neutral-300",
          "shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]",
          "overflow-y-auto max-h-96 whitespace-pre-wrap"
        )}
      >
        {output || "No output yet..."}
      </div>

      {copy && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleCopy}
        >
          Copy
        </Button>
      )}
    </div>
  );
}
