import { cn } from "@/app/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-1 mb-6", className)}>
      <h2 className="text-2xl font-semibold text-neutral-100 tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-neutral-400 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}
