"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import CryptoJS from "crypto-js";

export default function HashGeneratorPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  const algorithms = [
    "MD5",
    "SHA-1",
    "SHA-224",
    "SHA-256",
    "SHA-384",
    "SHA-512",
  ];

  const computeHash = async () => {
    if (!text && !file) return;

    let input: ArrayBuffer | string = text;

    if (file) {
      input = await file.arrayBuffer();
    }

    if (typeof input === "string") {
      if (algorithm === "MD5") return CryptoJS.MD5(input).toString();
      if (algorithm === "SHA-224") return CryptoJS.SHA224(input).toString();

      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const digest = await crypto.subtle.digest(algorithm, data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    const wordArray = CryptoJS.lib.WordArray.create(input);

    if (algorithm === "MD5") return CryptoJS.MD5(wordArray).toString();
    if (algorithm === "SHA-224") return CryptoJS.SHA224(wordArray).toString();

    const digest = await crypto.subtle.digest(algorithm, input);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const generateHash = async () => {
    const result = await computeHash();
    setHash(result || "");
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* Fond violet → noir (moitié violet, moitié noir, fondu propre) */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-linear-to-b
          from-[#8b5cf6]/60
          via-[#8b5cf6]/30
          via-[#8b5cf6]/10
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

        <div className="mt-20 sm:mt-24">
          <SectionTitle
            title="Hash Generator"
            subtitle="Generate cryptographic hashes for text or files"
          />
        </div>

        <Card className="mt-8 p-6 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl flex flex-col gap-6">

          <Input
            label="Text"
            placeholder="Enter text to hash..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFile(null);
              setHash("");
            }}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-300 font-medium">
              Or upload a file
            </label>

            <div
              className="border border-neutral-800 bg-neutral-900/40 backdrop-blur-xl rounded-lg p-6 text-center cursor-pointer hover:border-neutral-700 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) {
                  setFile(f);
                  setText("");
                  setHash("");
                }
              }}
            >
              <input
                type="file"
                className="hidden"
                id="fileInput"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  setText("");
                  setHash("");
                }}
              />
              <label htmlFor="fileInput" className="cursor-pointer text-neutral-300">
                {file ? (
                  <span className="font-medium">{file.name}</span>
                ) : (
                  "Drag & drop or click to upload"
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300 font-medium">
              Algorithm
            </label>

            <select
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-md px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setHash("");
              }}
            >
              {algorithms.map((algo) => (
                <option key={algo} value={algo}>
                  {algo}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={generateHash} disabled={!text && !file}>
            Generate Hash
          </Button>

          {hash && (
            <Card className="relative p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-lg">
              <p className="text-sm text-neutral-400 mb-1">{algorithm}</p>

              <p className="text-neutral-100 break-all text-sm sm:text-base leading-relaxed pr-20">
                {hash}
              </p>

              <button
                onClick={copyHash}
                className={`absolute right-3 top-3 text-xs sm:text-sm px-2 py-1 rounded-md transition-all border ${
                  copied
                    ? "bg-indigo-600 border-indigo-500 text-white scale-105"
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
