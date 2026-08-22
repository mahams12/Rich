import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "ghost" | "outline" | "danger";

const looks: Record<Variant, React.CSSProperties> = {
  primary: { background: "#16110e", color: "#ffffff" },
  light: { background: "#ffffff", color: "#16110e" },
  ghost: { background: "#ffffff", color: "#16110e", border: "1px solid rgba(22,17,14,0.18)" },
  outline: { background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.7)" },
  danger: { background: "#dc2626", color: "#ffffff" },
};

export function Button({
  href,
  children,
  className,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline",
    disabled && "pointer-events-none opacity-50",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} style={looks[variant]}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} style={looks[variant]} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d655d]", className)}>
      {children}
    </span>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d655d]">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#16110e] outline-none transition placeholder:text-neutral-400 focus:border-[#c45c3a]/50";
