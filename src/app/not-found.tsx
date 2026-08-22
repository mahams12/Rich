import { Button, Section } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section className="text-center">
      <p className="text-[#c45c3a]">404</p>
      <h1 className="display mt-3 text-4xl">This page is not in the hub</h1>
      <p className="mt-3 text-[#6d655d]">Try the portfolio, or go home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/portfolio">View portfolio</Button>
        <Button href="/" variant="ghost">Home</Button>
      </div>
    </Section>
  );
}
