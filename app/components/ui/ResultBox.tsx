"use client";

import { useState } from "react";


export function ResultBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-4 pr-16 sm:pr-20">
      <p className="text-sm text-neutral-400 mb-1">{label}</p>

      <p className="text-neutral-100 break-all text-sm sm:text-base leading-relaxed">
        {value}
      </p>

      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 sm:right-4 sm:top-4 text-xs sm:text-sm px-2 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
