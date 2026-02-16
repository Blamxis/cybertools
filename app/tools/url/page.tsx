"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";

/* ---------------------------------------------------
   PURE FUNCTIONS (NO ESLINT WARNINGS)
---------------------------------------------------- */

function safeEncode(str: string): { ok: boolean; result: string } {
  try {
    return { ok: true, result: encodeURIComponent(str) };
  } catch {
    return { ok: false, result: "Encoding failed." };
  }
}

function safeDecode(str: string): { ok: boolean; result: string } {
  try {
    return { ok: true, result: decodeURIComponent(str) };
  } catch {
    return { ok: false, result: "Invalid encoded string." };
  }
}

function autoDetect(str: string): "encode" | "decode" {
  return /%[0-9A-Fa-f]{2}/.test(str) ? "decode" : "encode";
}

/* ---------------------------------------------------
   INVALID ENCODING DETECTOR (FIX FOR %ZZ, %G1, etc.)
---------------------------------------------------- */
function looksLikeInvalidEncoding(str: string): boolean {
  // % suivi d'un caractère non hexadécimal
  if (/%[^0-9A-Fa-f]/.test(str)) return true;

  // % suivi d'un hex valide mais pas deux caractères
  if (/%[0-9A-Fa-f]([^0-9A-Fa-f]|$)/.test(str)) return true;

  return false;
}

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "auto">("auto");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------------------
     PROCESS LOGIC
  ---------------------------------------------------- */
  const process = () => {
    setError("");
    setOutput("");

    const text = input.trim();
    if (!text) return;

    // 🔥 NEW: detect invalid encoded strings BEFORE auto-detect
    if (looksLikeInvalidEncoding(text)) {
      return setError("Invalid encoded string.");
    }

    const action: "encode" | "decode" =
      mode === "auto" ? autoDetect(text) : mode;

    if (action === "encode") {
      const res = safeEncode(text);
      if (!res.ok) return setError("Encoding failed.");
      setOutput(res.result);
    } else {
      const res = safeDecode(text);
      if (!res.ok) return setError("Invalid encoded string.");
      setOutput(res.result);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* 🌸 Fond rose → noir */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-gradient-to-b
          from-pink-500/50
          via-pink-500/10
          to-neutral-950
          min-h-screen
        "
      />

      {/* FIX MOBILE SCROLL */}
      <PageContainer size="sm" className="relative px-4 sm:px-6 pt-28 sm:pt-24">

        {/* Back Button */}
        <div className="fixed left-4 top-4 sm:left-6 sm:top-6 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            <span className="text-lg sm:text-xl">←</span>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <SectionTitle
          title="URL Encoder / Decoder"
          subtitle="Encode or decode URLs instantly with auto-detection"
        />

        {/* Main Card */}
        <Card className="mt-8 p-6 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl flex flex-col gap-6">

          {/* INPUT */}
          <div>
            <label className="text-sm text-neutral-300 font-medium">
              Input ({input.length} chars)
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
                setOutput("");
              }}
              placeholder="Enter text to encode or decode..."
              className="
                w-full mt-2 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700
                text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-pink-400
                min-h-[120px]
              "
            />
          </div>

          {/* MODE SELECTOR */}
          <div className="flex flex-wrap gap-3">
            {[
              { key: "encode", label: "Encode" },
              { key: "decode", label: "Decode" },
              { key: "auto", label: "Auto Detect" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() =>
                  setMode(m.key as "encode" | "decode" | "auto")
                }
                className={`
                  px-4 py-2 rounded-md border text-sm transition-all
                  ${
                    mode === m.key
                      ? "bg-pink-500 border-pink-400 text-black shadow-md shadow-pink-500/20"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                  }
                `}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={process}
              disabled={!input}
              className="
                w-full px-5 py-2.5 rounded-md font-medium border
                bg-pink-500 border-pink-400 text-black
                hover:bg-pink-400 transition-all
                shadow-md shadow-pink-500/20
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Process
            </button>

            <button
              onClick={clearAll}
              className="
                w-full px-5 py-2.5 rounded-md font-medium border
                bg-neutral-800 border-neutral-700 text-neutral-300
                hover:bg-neutral-700 transition-all
              "
            >
              Clear
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}

          {/* OUTPUT */}
          {output && (
            <Card className="p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-lg mt-2">
              <p className="text-sm text-neutral-400 mb-1">Output</p>

              <p className="text-neutral-100 break-all text-sm sm:text-base font-mono pr-20">
                {output}
              </p>

              <button
                onClick={copyOutput}
                className={`
                  mt-4 text-xs px-3 py-1 rounded-md border transition-all
                  ${
                    copied
                      ? "bg-pink-500 border-pink-400 text-black scale-105"
                      : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                  }
                `}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </Card>
          )}
        </Card>
      </PageContainer>
    </div>
  );
}
