"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Unit, bmiFromLbIn, display } from "@/lib/formulas";

type Entry = { date: string; weightLb: number };

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([el]) => {
      const r = el.contentRect;
      setRect({ width: r.width, height: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, rect };
}

function smooth(values: number[], windowSize: number) {
  if (windowSize <= 1) return values;
  const half = Math.floor(windowSize / 2);
  return values.map((_, i) => {
    let s = 0, n = 0;
    for (let k = i - half; k <= i + half; k++) {
      if (k >= 0 && k < values.length) { s += values[k]; n++; }
    }
    return s / Math.max(1, n);
  });
}

export default function HistoryChart({
  entries,
  unit,
  heightIn,
  showBMI = true,
  rangeDays = "all",
  smoothWindow = 1,
}: {
  entries: Entry[];
  unit: Unit;
  heightIn: number;
  showBMI?: boolean;
  rangeDays?: number | "all";
  smoothWindow?: number;
}) {
  const margin = { top: 16, right: 18, bottom: 28, left: 34 };
  const { ref, rect } = useMeasure<HTMLDivElement>();
  const w = Math.max(280, rect.width || 320);
  const h = 220;

  // Prep data (sorted)
  const data = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const cutoff =
      rangeDays === "all" ? 0 : Date.now() - (rangeDays as number) * 86400000;
    return sorted.filter((e) => new Date(e.date).getTime() >= cutoff);
  }, [entries, rangeDays]);

  const xVals = data.map((d) => new Date(d.date).getTime());
  const yWeight = data.map((d) => d.weightLb);
  const yBMI = data.map((d) => bmiFromLbIn(d.weightLb, heightIn));

  // optional smoothing
  const yWeightS = useMemo(() => smooth(yWeight, smoothWindow), [yWeight, smoothWindow]);
  const yBMIS = useMemo(() => smooth(yBMI, smoothWindow), [yBMI, smoothWindow]);

  // scales
  const innerW = w - margin.left - margin.right;
  const innerH = h - margin.top - margin.bottom;

  const minX = xVals.length ? Math.min(...xVals) : Date.now() - 7 * 86400000;
  const maxX = xVals.length ? Math.max(...xVals) : Date.now();
  const minW = yWeightS.length ? Math.min(...yWeightS) : 150;
  const maxW = yWeightS.length ? Math.max(...yWeightS) : 250;
  const minB = yBMIS.length ? Math.min(...yBMIS) : 18;
  const maxB = yBMIS.length ? Math.max(...yBMIS) : 35;

  const x = (t: number) =>
    margin.left + ((t - minX) / Math.max(1, maxX - minX)) * innerW;
  const y1 = (v: number) =>
    margin.top + innerH - ((v - minW) / Math.max(0.0001, maxW - minW)) * innerH;
  const y2 = (v: number) =>
    margin.top + innerH - ((v - minB) / Math.max(0.0001, maxB - minB)) * innerH;

  // path builders
  const path = (xs: number[], ys: number[], yMap: (v: number) => number) => {
    if (xs.length < 2) return "";
    return xs
      .map((t, i) => `${i === 0 ? "M" : "L"} ${x(t)} ${yMap(ys[i])}`)
      .join(" ");
  };

  const weightPath = path(xVals, yWeightS, y1);
  const bmiPath = path(xVals, yBMIS, y2);

  // hover
  const [hover, setHover] = useState<null | number>(null);
  const nearest = useMemo(() => {
    if (!xVals.length || hover === null) return null;
    let idx = 0, best = Infinity;
    for (let i = 0; i < xVals.length; i++) {
      const d = Math.abs(xVals[i] - hover);
      if (d < best) { best = d; idx = i; }
    }
    return { idx, t: xVals[idx] };
  }, [hover, xVals]);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const bx = (e.nativeEvent as any).offsetX;
    const tx = minX + ((bx - margin.left) / innerW) * (maxX - minX);
    setHover(isFinite(tx) ? tx : null);
  };

  return (
    <div ref={ref} className="w-full">
      <svg
        width={w}
        height={h}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        className="block"
      >
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#7A77FF" />
          </linearGradient>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9D6BFF" />
            <stop offset="100%" stopColor="#FF4DFF" />
          </linearGradient>
        </defs>

        {/* axes/grid */}
        <g opacity={0.28}>
          {/* horizontal ticks */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = margin.top + (i / 3) * innerH;
            return <line key={i} x1={margin.left} x2={w - margin.right} y1={y} y2={y} stroke="rgba(255,255,255,.15)" />;
          })}
        </g>

        {/* weight line */}
        <path d={weightPath} stroke="url(#wg)" strokeWidth={3} fill="none" strokeLinecap="round" filter="url(#softGlow)" />

        {/* BMI line */}
        {showBMI && (
          <path d={bmiPath} stroke="url(#bg)" strokeWidth={2.25} fill="none" strokeLinecap="round" opacity={0.9} filter="url(#softGlow)" />
        )}

        {/* hover cursor */}
        {nearest && (
          <>
            <line
              x1={x(nearest.t)}
              x2={x(nearest.t)}
              y1={margin.top}
              y2={h - margin.bottom}
              stroke="rgba(255,255,255,.25)"
              strokeDasharray="4 4"
            />
            {/* dot on weight */}
            <circle
              cx={x(nearest.t)}
              cy={y1(yWeightS[nearest.idx])}
              r={4.5}
              fill="#00F0FF"
              filter="url(#softGlow)"
            />
            {/* dot on BMI */}
            {showBMI && (
              <circle
                cx={x(nearest.t)}
                cy={y2(yBMIS[nearest.idx])}
                r={3.8}
                fill="#FF4DFF"
                opacity={0.9}
                filter="url(#softGlow)"
              />
            )}
          </>
        )}
      </svg>

      {/* legend + tooltip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: "linear-gradient(90deg,#00F0FF,#7A77FF)" }} />
            <span className="text-[#9BEFFF] font-semibold">Weight</span>
          </div>
          {showBMI && (
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: "linear-gradient(90deg,#9D6BFF,#FF4DFF)" }} />
              <span className="text-[#D6E2FF]">BMI</span>
            </div>
          )}
        </div>
        {nearest && (
          <div className="px-2 py-1 rounded-lg bg-[rgba(6,8,20,.9)] border border-white/10 backdrop-blur-md">
            <span className="text-[#8EA4D2] mr-2">
              {new Date(xVals[nearest.idx]).toLocaleDateString()}
            </span>
            <span className="text-[#9BEFFF] font-bold mr-2">
              {display(yWeightS[nearest.idx], unit)} {unit}
            </span>
            {showBMI && (
              <span className="text-[#D6E2FF]">BMI {yBMIS[nearest.idx].toFixed(1)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
