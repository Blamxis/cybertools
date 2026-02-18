import Link from "next/link";
import { ReactNode } from "react";

/**
 * ToolCard premium
 * - Glow subtil au hover
 * - Icône plus grande
 * - Style SaaS moderne
 */
export default function ToolCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition shadow-sm hover:shadow-[0_0_20px_rgba(120,119,198,0.15)]"
    >
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h2 className="text-xl font-medium text-white">{title}</h2>
      </div>

      <p className="text-neutral-400 text-sm group-hover:text-neutral-300 transition">
        {description}
      </p>
    </Link>
  );
}
