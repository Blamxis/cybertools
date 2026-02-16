"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";

/* ---------------------------------------------
   PURE FUNCTION — OUTSIDE COMPONENT (NO WARNINGS)
---------------------------------------------- */
function generatePasswordString(length: number, chars: string) {
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    noAmbiguous: false,
  });

  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | "very-strong">("weak");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const ambiguousChars = "{}[]()/\\'\"~,;:.<>";

  /* ---------------------------------------------
     GENERATE PASSWORD (PURE + SAFE)
  ---------------------------------------------- */
  const generatePassword = () => {
    let chars = "";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*_-+=";

    if (options.noAmbiguous) {
      chars = chars
        .split("")
        .filter((c) => !ambiguousChars.includes(c))
        .join("");
    }

    if (!chars) return;

    const pwd = generatePasswordString(length, chars);

    setPassword(pwd);
    updateStrength(pwd);

    setHistory((prev) => {
      const updated = [pwd, ...prev];
      return updated.slice(0, 5);
    });
  };

  /* ---------------------------------------------
     PASSWORD STRENGTH
  ---------------------------------------------- */
  const updateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) setStrength("weak");
    else if (score === 2) setStrength("medium");
    else if (score === 3) setStrength("strong");
    else setStrength("very-strong");
  };

  /* ---------------------------------------------
     COPY + CLEAR
  ---------------------------------------------- */
  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const clearAll = () => {
    setPassword("");
    setHistory([]);
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* 🌿 Fond vert → noir */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-linear-to-b
          from-[#22c55e]/60
          via-[#22c55e]/20
          to-black
          min-h-screen
        "
      />

      {/* FIX MOBILE SCROLL: pt-20 */}
      <PageContainer size="lg" className="relative px-4 sm:px-6 flex pt-20 sm:pt-0">

        {/* PANEL PRINCIPAL */}
        <div className="flex-1">

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
              title="Password Generator"
              subtitle="Generate secure passwords with advanced options"
            />
          </div>

          {/* Main Card */}
          <Card className="mt-8 p-6 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl flex flex-col gap-6">

            {/* LENGTH */}
            <div>
              <label className="text-sm text-neutral-300 font-medium">Length: {length}</label>
              <input
                type="range"
                min={4}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full mt-2 accent-green-500"
              />
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "lowercase", label: "Lowercase" },
                { key: "uppercase", label: "Uppercase" },
                { key: "numbers", label: "Numbers" },
                { key: "symbols", label: "Symbols" },
                { key: "noAmbiguous", label: "Avoid ambiguous chars" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 text-neutral-300">
                  <input
                    type="checkbox"
                    checked={options[opt.key as keyof typeof options]}
                    onChange={() =>
                      setOptions((prev) => ({
                        ...prev,
                        [opt.key]: !prev[opt.key as keyof typeof options],
                      }))
                    }
                    className="accent-green-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generatePassword}
                className="
                  w-full px-5 py-2.5 rounded-md font-medium border
                  bg-green-600 border-green-500 text-white
                  hover:bg-green-500 transition-all
                  shadow-md shadow-green-500/20
                "
              >
                Generate
              </button>

              <button
                onClick={generatePassword}
                disabled={!password}
                className="
                  w-full px-5 py-2.5 rounded-md font-medium border
                  bg-neutral-800 border-neutral-700 text-neutral-300
                  hover:bg-neutral-700 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Regenerate
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

            {/* PASSWORD OUTPUT */}
            {password && (
              <Card className="relative p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-lg">
                <p className="text-sm text-neutral-400 mb-1">Generated Password</p>

                <p className="text-neutral-100 break-all text-lg font-mono pr-20">
                  {password}
                </p>

                <button
                  onClick={copyPassword}
                  className={`absolute right-3 top-3 text-xs sm:text-sm px-2 py-1 rounded-md transition-all border ${
                    copied
                      ? "bg-green-600 border-green-500 text-white scale-105"
                      : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </Card>
            )}

            {/* STRENGTH METER */}
            {password && (
              <div className="mt-2">
                <p className="text-sm text-neutral-300 mb-1">Strength</p>
                <div className="w-full h-2 rounded bg-neutral-800 overflow-hidden">
                  <div
                    className={`
                      h-full transition-all
                      ${
                        strength === "weak"
                          ? "bg-red-500 w-1/4"
                          : strength === "medium"
                          ? "bg-yellow-500 w-2/4"
                          : strength === "strong"
                          ? "bg-green-500 w-3/4"
                          : "bg-green-400 w-full"
                      }
                    `}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* MOBILE/TABLET HISTORY */}
          <div className="lg:hidden w-full mt-6">
            <Card className="p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl">
              <h3 className="text-lg font-semibold text-neutral-200 mb-3">History</h3>

              {history.length === 0 && (
                <p className="text-neutral-500 text-sm">No passwords generated yet.</p>
              )}

              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                {history.map((pwd, i) => (
                  <div
                    key={i}
                    className="p-2 bg-neutral-800/40 border border-neutral-700 rounded-md flex justify-between items-center"
                  >
                    <span className="text-neutral-300 text-xs break-all">{pwd}</span>

                    <button
                      onClick={() => navigator.clipboard.writeText(pwd)}
                      className="text-xs px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-200 border border-neutral-600"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* DESKTOP SIDEBAR HISTORY */}
        <div className="hidden lg:block w-64 ml-6 sticky top-24 h-fit">
          <Card className="p-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-200 mb-3">History</h3>

            {history.length === 0 && (
              <p className="text-neutral-500 text-sm">No passwords generated yet.</p>
            )}

            <div className="flex flex-col gap-3">
              {history.map((pwd, i) => (
                <div
                  key={i}
                  className="p-2 bg-neutral-800/40 border border-neutral-700 rounded-md flex justify-between items-center"
                >
                  <span className="text-neutral-300 text-xs break-all">{pwd}</span>

                  <button
                    onClick={() => navigator.clipboard.writeText(pwd)}
                    className="text-xs px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-200 border border-neutral-600"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
