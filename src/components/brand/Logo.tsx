import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9", className)} aria-hidden>
      <rect width="40" height="40" rx="12" fill="#1a1410" />
      <path
        d="M12 10h5.2l5.8 11.4V10H28v20h-5.2L17 18.7V30H12V10Z"
        fill="#f4efe8"
      />
      <circle cx="28.4" cy="11.2" r="2.1" fill="#c45c3a" />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("font-display text-[1.05rem] font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
        novexa<span className={light ? "text-white/70" : "text-[#c45c3a]"}>hub</span>
      </span>
    </span>
  );
}
