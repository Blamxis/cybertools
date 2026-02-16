import { cn } from "@/app/lib/utils";
import { Button } from "./Button";

interface ResultBoxProps {
  value: string;
  label?: string;
  className?: string;
}

export function ResultBox({ value, label, className }: ResultBoxProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {label && (
        <p className="text-sm text-neutral-400 font-medium">{label}</p>
      )}

      <div className="relative bg-neutral-900 border border-neutral-800 rounded-md p-4 text-neutral-200 font-mono text-sm break-all">
        {value}

        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleCopy}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
