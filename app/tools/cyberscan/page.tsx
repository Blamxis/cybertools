"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/app/components/ui/PageContainer";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
import { Card } from "@/app/components/ui/Card";

// 🔥 Nouveau moteur PRO v2
import { analyzeUrlV2 } from "@/app/tools/cyberscan/core/analysis";
import type { AnalysisResult } from "@/app/tools/cyberscan/types/analysis";

export default function CyberScanPage() {
  const [input, setInput] = useState<string>("");

  // On stocke le résultat complet de l’analyse
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // États pour l’animation “copié”
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Lance l’analyse via ton moteur PRO v2
  const runScan = () => {
    try {
      const res = analyzeUrlV2(input);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
      setAnalysis(null);
    }
  };

  // Réinitialise tout
  const clearAll = () => {
    setInput("");
    setAnalysis(null);
  };

  // Copie le JSON complet du résultat
  const copyFindings = () => {
    if (!analysis) return;
    const payload = JSON.stringify(analysis, null, 2);
    navigator.clipboard.writeText(payload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1200);
  };

  // Copie le rapport textuel
  const copyReport = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 1200);
  };

  // Couleur dynamique selon le niveau de risque
  const riskColor =
    analysis?.risk === "Critical"
      ? "text-red-500"
      : analysis?.risk === "High"
      ? "text-red-400"
      : analysis?.risk === "Medium"
      ? "text-orange-400"
      : "text-emerald-400";

  return (
    <div className="relative min-h-screen w-full">
      {/* Dégradé de fond */}
      <div
        className="
          absolute inset-0 -z-10 pointer-events-none
          bg-linear-to-b
          from-red-600/60
          via-red-600/10
          to-neutral-950
          min-h-screen
        "
      />

      <PageContainer
        size="lg"
        className="relative px-4 sm:px-8 pt-28 sm:pt-24 w-full"
      >
        {/* Bouton retour */}
        <div className="fixed left-4 top-4 sm:left-6 sm:top-6 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            <span className="text-lg sm:text-xl">←</span>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Titre principal */}
        <SectionTitle
          title="CyberScan PRO"
          subtitle="Analyze URLs for risky patterns, payloads and obfuscation"
        />

        {/* Layout 2 colonnes sur desktop */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">

          {/* COLONNE GAUCHE — INPUT */}
          <Card
            className="
              p-8 
              bg-neutral-900/50 backdrop-blur-xl 
              border border-red-900/40 shadow-xl 
              rounded-xl
              flex flex-col gap-6
              w-full
            "
          >
            {/* Champ URL */}
            <div>
              <label className="text-sm text-neutral-300 font-medium">
                URL to analyze ({input.length} chars)
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setAnalysis(null); // reset auto
                }}
                placeholder="https://example.com/path?param=value"
                className="
                  w-full mt-2 px-4 py-2.5 rounded-md bg-neutral-800 border border-neutral-700
                  text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500
                  wrap-break-word overflow-auto max-w-full
                "
              />
            </div>

            {/* Boutons Scan / Clear */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={runScan}
                disabled={!input.trim()}
                className="
                  w-full px-5 py-2.5 rounded-md font-medium border
                  bg-red-600 border-red-500 text-black
                  hover:bg-red-500 transition-all
                  shadow-md shadow-red-600/30
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Scan URL
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
          </Card>

          {/* COLONNE DROITE — RÉSULTATS */}
          {analysis && (
            <Card
              className="
                p-6 
                bg-neutral-950/60 border border-neutral-800 shadow-lg 
                rounded-xl 
                w-full
                overflow-hidden
                flex flex-col gap-4
              "
            >
              {/* Résumé du risque */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-neutral-400">Risk level</p>
                <p className={`text-xl font-semibold ${riskColor}`}>
                  {analysis.risk}
                </p>

                {/* URL normalisée */}
                {analysis.normalized && (
                  <p className="text-xs text-neutral-500 wrap-break-word overflow-auto max-w-full">
                    Normalized URL: {analysis.normalized}
                  </p>
                )}

                {/* Catégories */}
                {analysis.categories && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(analysis.categories).map(([cat, val]) => (
                      <span
                        key={cat}
                        className="
                          text-xs px-2 py-1 rounded-md border border-neutral-700
                          bg-neutral-900/60 text-neutral-300
                        "
                      >
                        {cat}: {val}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Liste des findings */}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-neutral-400">Findings</p>
                <ul className="flex flex-col gap-2 text-sm">
                  {analysis.findings.map((f, idx) => (
                    <li
                      key={idx}
                      className="rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-neutral-100 wrap-break-word max-w-full">
                          {f.label}
                        </span>

                        {/* Badge de sévérité */}
                        <span
                          className={`
                            text-xs px-2 py-0.5 rounded-full border
                            ${
                              f.severity === "Critical"
                                ? "border-red-500 text-red-400"
                                : f.severity === "High"
                                ? "border-red-400 text-red-300"
                                : f.severity === "Medium"
                                ? "border-orange-400 text-orange-300"
                                : "border-emerald-400 text-emerald-300"
                            }
                          `}
                        >
                          {f.severity}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 mt-1 wrap-break-word overflow-auto max-w-full">
                        {f.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Boutons de copie */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={copyFindings}
                  className={`
                    text-xs px-3 py-1 rounded-md border transition-all
                    ${
                      copiedJson
                        ? "bg-red-600 border-red-500 text-black scale-105"
                        : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                    }
                  `}
                >
                  {copiedJson ? "Copied JSON" : "Copy JSON"}
                </button>

                <button
                  onClick={copyReport}
                  className={`
                    text-xs px-3 py-1 rounded-md border transition-all
                    ${
                      copiedReport
                        ? "bg-red-600 border-red-500 text-black scale-105"
                        : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"
                    }
                  `}
                >
                  {copiedReport ? "Copied report" : "Copy report"}
                </button>
              </div>

              {/* Vue avancée */}
              <details className="mt-4">
                <summary className="cursor-pointer text-neutral-400 text-sm">
                  Advanced view
                </summary>

                <pre
                  className="
                    mt-3 p-3 bg-neutral-900/60 border border-neutral-800 
                    text-xs text-neutral-300 rounded-md 
                    whitespace-pre-wrap wrap-break-word 
                    overflow-x-auto max-w-full
                  "
                >
                  {analysis.report}
                </pre>
              </details>
            </Card>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
