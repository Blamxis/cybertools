"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

export default function Base64ToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-detect Base64 (sans useEffect)
  const autoDetect = (value: string) => {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;

    if (base64Regex.test(value) && value.length % 4 === 0) {
      setMode("decode");
    } else {
      setMode("encode");
    }
  };

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      setError("");
    } catch {
      setError("Invalid input for Base64 encoding.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError("");
    } catch {
      setError("Invalid Base64 string.");
      setOutput("");
    }
  };

  const process = () => {
    if (mode === "encode") handleEncode();
    else handleDecode();
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const swapValues = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="relative min-h-screen w-full">

      {/*  Fond bleu → noir */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-linear-to-b
          from-[#3b82f6]/60
          via-[#3b82f6]/20
          to-black
          min-h-screen
        "
      />

      <PageContainer size="sm" className="relative px-4 sm:px-6">

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
        <div className="mt-20 sm:mt-24">
          <SectionTitle
            title="Base64 Encoder / Decoder"
            subtitle="Smart encoding and decoding with auto-detection"
          />
        </div>

        {/* Main Card */}
        <Card className="mt-8 p-6 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl flex flex-col gap-6">

          {/* MODE TOGGLE */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setMode("encode")}
              className={`px-5 py-2.5 rounded-md border transition-all font-medium ${
                mode === "encode"
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              Encode
            </button>

            <button
              onClick={() => setMode("decode")}
              className={`px-5 py-2.5 rounded-md border transition-all font-medium ${
                mode === "decode"
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              Decode
            </button>
          </div>

          {/* INPUT */}
          <Input
            label="Input"
            placeholder="Enter text or Base64 string..."
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              setOutput("");
              setError("");
              autoDetect(value);
            }}
          />

          {/* CHARACTER COUNT */}
          <p className="text-xs text-neutral-400 text-right">
            {input.length} characters
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* MAIN ACTION */}
            <button
              onClick={process}
              disabled={!input}
              className="
                w-full px-5 py-2.5 rounded-md font-medium border
                bg-blue-600 border-blue-500 text-white
                hover:bg-blue-500 transition-all
                shadow-md shadow-blue-500/20
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {mode === "encode" ? "Encode" : "Decode"}
            </button>

            {/* SWAP */}
            <button
              onClick={swapValues}
              disabled={!output}
              className="
                w-full px-5 py-2.5 rounded-md font-medium border
                bg-neutral-800 border-neutral-700 text-neutral-300
                hover:bg-neutral-700 transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Swap
            </button>

            {/* CLEAR */}
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
            <div className="p-3 rounded-md bg-red-900/40 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* OUTPUT */}
          {output && (
            <Card className="relative p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-lg">
              <p className="text-sm text-neutral-400 mb-1">Result</p>

              <p className="text-neutral-100 break-all text-sm sm:text-base leading-relaxed pr-20">
                {output}
              </p>

              <button
                onClick={copyOutput}
                className={`absolute right-3 top-3 text-xs sm:text-sm px-2 py-1 rounded-md transition-all border ${
                  copied
                    ? "bg-blue-600 border-blue-500 text-white scale-105"
                    : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                }`}
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
