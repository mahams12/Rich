import { TechLogo } from "@/components/brand/TechLogo";
import { aiStudio, techStack } from "@/data/showcase";

export function TechStack() {
  const row = [...techStack, ...techStack];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d655d]">Built with</p>
      <h2 className="display mx-auto mt-3 max-w-2xl text-3xl tracking-tight sm:text-4xl">A modern, production-grade stack</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6d655d]">
        The same frameworks trusted by serious product teams, so your site launches fast, stays stable, and does not feel dated.
      </p>

      <div className="mt-10 overflow-hidden">
        <div className="marquee-stack flex w-max gap-10">
          {row.map((item, i) => (
            <div key={`${item.name}-${i}`} className="w-24 shrink-0">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(22,17,14,0.08)] ring-1 ring-black/5">
                <TechLogo name={item.name} />
              </div>
              <p className="mt-3 text-xs font-medium text-[#4a433c]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl border-t border-dashed border-black/15 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d655d]">AI studio</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-10">
          {aiStudio.map((item) => (
            <div key={item.name} className="text-center">
              <div className="mx-auto grid place-items-center">
                <TechLogo name={item.name} circular />
              </div>
              <p className="mt-2 text-sm font-medium text-[#4a433c]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
