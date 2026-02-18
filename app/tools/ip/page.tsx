"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";

/* ---------------------------------------------------
   PURE VALIDATION FUNCTIONS (NO ESLINT WARNINGS)
---------------------------------------------------- */

// IPv4 regex
const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

// IPv6 regex (simplified but robust)
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(([0-9a-fA-F]{1,4}:){1,7}:)|(::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}))$/;

// CIDR regex
const cidrRegex =
  /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3})\/([0-9]|[1-2][0-9]|3[0-2])$/;

// Private IPv4 ranges
function isPrivateIPv4(ip: string) {
  const parts = ip.split(".").map(Number);
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

// Special IPv4 ranges
function isSpecialIPv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts[0] === 127) return true; // loopback
  if (parts[0] === 169 && parts[1] === 254) return true; // link-local
  return false;
}

export default function IPValidatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    valid: boolean;
    type: string;
    details: string[];
  }>(null);

  const [copied, setCopied] = useState(false);

  /* ---------------------------------------------------
     VALIDATION LOGIC
  ---------------------------------------------------- */
  const validateIP = () => {
    const ip = input.trim();
    const details: string[] = [];

    // IPv4-mapped IPv6 (::ffff:x.x.x.x)
    if (ip.startsWith("::ffff:")) {
      const v4 = ip.replace("::ffff:", "");
      if (ipv4Regex.test(v4)) {
        return setResult({
          valid: true,
          type: "IPv6 (IPv4-mapped)",
          details: [
            "Valid IPv4-mapped IPv6 address",
            `Mapped IPv4: ${v4}`,
          ],
        });
      }
    }

    // CIDR
    if (cidrRegex.test(ip)) {
      details.push("Valid CIDR notation");
      return setResult({
        valid: true,
        type: "CIDR",
        details,
      });
    }

    // IPv4
    if (ipv4Regex.test(ip)) {
      details.push("Valid IPv4 address");

      if (isPrivateIPv4(ip)) details.push("Private IP range");
      else details.push("Public IP range");

      if (isSpecialIPv4(ip)) details.push("Special/reserved IP");

      return setResult({
        valid: true,
        type: "IPv4",
        details,
      });
    }

    // IPv6
    if (ipv6Regex.test(ip)) {
      details.push("Valid IPv6 address");
      return setResult({
        valid: true,
        type: "IPv6",
        details,
      });
    }

    // Invalid
    return setResult({
      valid: false,
      type: "Invalid",
      details: ["The IP address format is incorrect."],
    });
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* Fond jaune → noir */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-linear-to-b
          from-yellow-400/50
          via-yellow-400/10
          to-neutral-950
          min-h-screen
        "
      />

      {/* FIX MOBILE SCROLL + FIX DESKTOP OVERLAP */}
      <PageContainer
        size="sm"
        className="relative px-4 sm:px-6 pt-28 sm:pt-24"
      >

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
          title="IP Validator"
          subtitle="Validate IPv4, IPv6 and CIDR formats instantly"
        />

        {/* Main Card */}
        <Card className="mt-8 p-6 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-xl flex flex-col gap-6">

          {/* INPUT */}
          <div>
            <label className="text-sm text-neutral-300 font-medium">IP Address</label>
            <input
              type="text"
              placeholder="Enter IPv4, IPv6 or CIDR..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setResult(null);
              }}
              className="
                w-full mt-2 px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700
                text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400
              "
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={validateIP}
              disabled={!input}
              className="
                w-full px-5 py-2.5 rounded-md font-medium border
                bg-yellow-500 border-yellow-400 text-black
                hover:bg-yellow-400 transition-all
                shadow-md shadow-yellow-500/20
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Validate
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

          {/* RESULT */}
          {result && (
            <Card
              className={`
                p-4 border shadow-lg backdrop-blur-xl mt-2
                ${
                  result.valid
                    ? "bg-green-900/30 border-green-700"
                    : "bg-red-900/30 border-red-700"
                }
              `}
            >
              <p className="text-sm text-neutral-300 mb-2">Result</p>

              <p
                className={`
                  text-lg font-semibold mb-2
                  ${result.valid ? "text-green-400" : "text-red-400"}
                `}
              >
                {result.type}
              </p>

              <ul className="text-neutral-300 text-sm flex flex-col gap-1">
                {result.details.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>

              <button
                onClick={copyResult}
                className={`
                  mt-4 text-xs px-3 py-1 rounded-md border transition-all
                  ${
                    copied
                      ? "bg-yellow-500 border-yellow-400 text-black scale-105"
                      : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                  }
                `}
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </Card>
          )}
        </Card>
      </PageContainer>
    </div>
  );
}
