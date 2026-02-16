"use client";

import {
  ShieldCheckIcon,
  KeyIcon,
  HashtagIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import ToolCard from "./components/ToolCard";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 relative overflow-hidden">
      {/* BACKGROUND PREMIUM ++ */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.22),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6))]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[url('/noise.png')] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="text-center pt-28 pb-20 relative z-10 max-w-3xl mx-auto px-6 animate-fade-in">
        {/* TITRE PREMIUM */}
        <h1 className="text-5xl font-mono font-semibold uppercase tracking-widest text-neutral-200">
          CyberTools Suite
        </h1>

        {/* SOUS-TITRE */}
        <p className="text-neutral-400 mt-5 text-lg leading-relaxed">
          A refined collection of passive cybersecurity tools crafted with
          precision, clarity and modern UI principles. Designed for developers,
          students and security enthusiasts.
        </p>

        {/* BADGES PREMIUM ++ */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          <span className="px-4 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 text-sm backdrop-blur-sm">
            6 Tools
          </span>
          <span className="px-4 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 text-sm backdrop-blur-sm">
            Passive Security
          </span>
          <span className="px-4 py-1.5 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300 text-sm backdrop-blur-sm">
            Open‑Source
          </span>
        </div>
      </section>

      {/* GRID DES OUTILS */}
      <section
        id="tools"
        className="relative z-10 max-w-6xl mx-auto px-6 pb-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
      >
        <ToolCard
          title="Hash Generator"
          description="Generate SHA-256, SHA-1, MD5 and more."
          icon={<HashtagIcon className="w-10 h-10 text-indigo-400" />}
          href="/tools/hash"
        />

        <ToolCard
          title="Base64 Encoder/Decoder"
          description="Encode or decode Base64 strings."
          icon={<ArrowPathIcon className="w-10 h-10 text-blue-400" />}
          href="/tools/base64"
        />

        <ToolCard
          title="Password Generator"
          description="Generate strong and secure passwords."
          icon={<KeyIcon className="w-10 h-10 text-emerald-400" />}
          href="/tools/password"
        />

        <ToolCard
          title="IP Validator"
          description="Validate IPv4 / IPv6 addresses."
          icon={<GlobeAltIcon className="w-10 h-10 text-yellow-400" />}
          href="/tools/ip"
        />

        <ToolCard
          title="URL Encoder/Decoder"
          description="Encode or decode URL strings."
          icon={<LockClosedIcon className="w-10 h-10 text-pink-400" />}
          href="/tools/url"
        />

        <ToolCard
          title="CyberScan"
          description="Passive web security analyzer."
          icon={<ShieldCheckIcon className="w-10 h-10 text-red-400" />}
          href="/tools/cyberscan"
        />
      </section>

      {/* FOOTER */}
      <footer className="text-center text-neutral-600 text-sm pb-10 relative z-10">
        © {new Date().getFullYear()} CyberTools Suite — Built by Maxime Gavinet
      </footer>
    </main>
  );
}
