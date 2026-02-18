import { AnalysisContext, ModuleResult, Severity } from "../types/analysis";

// === NORMALISATION (accepte absolument TOUT sans planter) ===
function normalize(rawUrl: string): AnalysisContext {
  let fixed = rawUrl.trim();

  if (fixed.startsWith("?")) {
    fixed = "https://example.com/" + fixed;
  }

  if (!fixed.includes("/") && !fixed.includes("?") && !fixed.includes(".")) {
    fixed = "https://example.com/?value=" + encodeURIComponent(fixed);
  }

  if (!/^https?:\/\//i.test(fixed)) {
    fixed = "https://" + fixed;
  }

  let url: URL;

  try {
    url = new URL(fixed);
  } catch {
    try {
      const safe = "https://example.com/safe/" + encodeURIComponent(rawUrl);
      url = new URL(safe);
    } catch {
      url = new URL("https://example.com/");
    }
  }

  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => (params[k] = v));

  return {
    rawUrl,
    url,
    normalizedUrl: url.toString(),
    host: url.hostname,
    path: url.pathname,
    params,
  };
}

// === IMPORT DES MODULES ===
import { runSqlInjectionModule } from "../modules/sqli";
import { runRedirectModule } from "../modules/redirect";
import { runUnicodeModule } from "../modules/unicode";
import { runEncodingModule } from "../modules/encoding";
import { runObfuscationModule } from "../modules/obfuscation";
import { runXssModule } from "../modules/xss";
import { runPathTraversalModule } from "../modules/path";
import { runSuspiciousParamsModule } from "../modules/params";
import { runMixedContentModule } from "../modules/mixedContent";
import { runSuspiciousDomainModule } from "../modules/suspiciousDomain";
import { runHomoglyphModule } from "../modules/homoglyph";
import { runEntropyModule } from "../modules/entropy";
import { runMixedPayloadModule } from "../modules/mixedPayload";

// === PIPELINE PRINCIPAL ===
export function analyzeUrlV2(rawUrl: string) {
  const ctx = normalize(rawUrl);

  // 1) Modules individuels
  const modules: ModuleResult[] = [
    runSqlInjectionModule(ctx),
    runRedirectModule(ctx),
    runUnicodeModule(ctx),
    runEncodingModule(ctx),
    runObfuscationModule(ctx),
    runXssModule(ctx),
    runPathTraversalModule(ctx),
    runSuspiciousParamsModule(ctx),
    runMixedContentModule(ctx),
    runSuspiciousDomainModule(ctx),
    runHomoglyphModule(ctx),
    runEntropyModule(ctx),
  ];

  // 2) Modules déclenchés
  let triggered = modules.filter((m) => m.triggered);

  // 3) Mixed payload (après les autres)
  const mixed = runMixedPayloadModule(ctx, triggered);
  if (mixed.triggered) {
    modules.push(mixed);
  }

  // 4) Recalcul des modules déclenchés
  triggered = modules.filter((m) => m.triggered);

  // 5) Risque global
  const severities = triggered.map((m) => m.severity);
  const risk =
    severities.includes("High")
      ? "High"
      : severities.includes("Medium")
      ? "Medium"
      : "Low";

  // 6) Catégories
  const categories: Record<string, number> = {};
  triggered.forEach((m) => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });

  // 7) Rapport
  const reportLines = triggered.map(
    (m) => ` - [${m.severity}] ${m.label}: ${m.description}`
  );

  const report = `=== CyberScan PRO v2 Report ===

URL: ${ctx.normalizedUrl}
Risk: ${risk}

Findings:
${reportLines.join("\n")}`;

  return {
    valid: true,
    risk: risk as Severity,
    findings: triggered.map((m) => ({
      label: m.label,
      severity: m.severity,
      description: m.description,
    })),
    categories,
    report,
    normalized: ctx.normalizedUrl,
    modulesTriggered: triggered.map((m) => m.id),
  };
}
