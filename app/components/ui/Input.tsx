import { cn } from "@/app/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm text-neutral-300 font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </span>
        )}

        <input
          className={cn(
            "w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-md px-3 py-2 outline-none transition-all",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40",
            (icon && "pl-10") as string | false,
            error && "border-red-500 focus:ring-red-500/40",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
