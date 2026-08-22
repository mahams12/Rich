"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function TiltCard({
  children,
  className,
  max = 5,
  smoke = false,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  smoke?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 58, y: 42, on: 0 });
  const cur = useRef({ x: 58, y: 42, o: 0, rx: 0, ry: 0 });
  const [view, setView] = useState({ x: 58, y: 42, o: 0, rx: 0, ry: 0 });

  const move = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    target.current = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      on: 1,
    };
  }, []);

  const leave = useCallback(() => {
    target.current.on = 0;
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const t = target.current;
      const c = cur.current;
      c.x += (t.x - c.x) * 0.035;
      c.y += (t.y - c.y) * 0.035;
      c.o += ((t.on ? 0.9 : 0.22) - c.o) * 0.028;
      const nx = (c.x / 100 - 0.5) * max;
      const ny = (0.5 - c.y / 100) * max;
      c.ry += (nx - c.ry) * 0.04;
      c.rx += (ny - c.rx) * 0.04;
      setView({ x: c.x, y: c.y, o: c.o, rx: c.rx, ry: c.ry });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [max]);

  return (
    <div className="h-full w-full [perspective:1400px]">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className={cn("relative h-full w-full overflow-hidden", className)}
        style={{ transform: `rotateX(${view.rx}deg) rotateY(${view.ry}deg)`, transition: "none" }}
      >
        {children}
        {smoke ? (
          <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
            <div
              className="red-smoke absolute h-[520px] w-[520px] rounded-full"
              style={{ left: `${view.x}%`, top: `${view.y}%`, opacity: view.o }}
            />
            <div
              className="red-smoke-2 absolute h-[340px] w-[340px] rounded-full"
              style={{ left: `${view.x + 8}%`, top: `${view.y - 6}%`, opacity: view.o * 0.75 }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
