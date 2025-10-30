"use client";
import React, { useMemo } from "react";

export default function RingProgress({
  size = 252, thickness = 22, value = 0.67, stars = 8
}:{
  size?: number; thickness?: number; value?: number; stars?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  const dash = v * c, gap = c - dash;
  const cx = size / 2, cy = size / 2;

  const angles = useMemo(() => Array.from({length: stars}, (_,i)=> i*(360/stars)), [stars]);
  const r1 = r + thickness/2 + 6, r2 = r + thickness/2 + 14, r3 = r + thickness/2 + 22;
  const colors = ["#00F0FF","#7A77FF","#FF00E5","#00FFA6"];

  // flare position
  const endAng = (-90 + v*360) * Math.PI/180;
  const fx = cx + r * Math.cos(endAng);
  const fy = cy + r * Math.sin(endAng);

  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="60%" stopColor="#7A77FF" />
            <stop offset="100%" stopColor="#FF00E5" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.22"/>
            <stop offset="45%" stopColor="#7A77FF" stopOpacity="0.16"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="innerCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.35)"/>
            <stop offset="45%" stopColor="rgba(11,15,30,0.65)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
            <stop offset="60%" stopColor="#FF4DFF" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Halo */}
        <circle cx={cx} cy={cy} r={r + thickness*0.65} fill="url(#sunHalo)" />

        {/* Inner glow */}
        <circle cx={cx} cy={cy} r={r - thickness*0.65} fill="url(#innerCore)" opacity={0.85} />

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} stroke="#101527" strokeWidth={thickness} fill="none" />

        {/* Arc */}
        <circle
          cx={cx} cy={cy} r={r}
          stroke="url(#ringGrad)" strokeWidth={thickness} fill="none"
          strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#glow)"
        />

        {/* Orbiting neon stars */}
        <g className="orbit slow">
          {angles.map((a,i)=>{ const rad=a*Math.PI/180; return (
            <circle key={`s1-${i}`} cx={cx + r1*Math.cos(rad)} cy={cy + r1*Math.sin(rad)} r={2.6} fill={colors[i%4]} filter="url(#glow)"/>
          )})}
        </g>
        <g className="orbit mid">
          {angles.map((a,i)=>{ const rad=a*Math.PI/180; return (
            <circle key={`s2-${i}`} cx={cx + r2*Math.cos(rad)} cy={cy + r2*Math.sin(rad)} r={2.2} fill={colors[(i+1)%4]} filter="url(#glow)"/>
          )})}
        </g>
        <g className="orbit fast">
          {angles.map((a,i)=>{ const rad=a*Math.PI/180; return (
            <circle key={`s3-${i}`} cx={cx + r3*Math.cos(rad)} cy={cy + r3*Math.sin(rad)} r={1.8} fill={colors[(i+2)%4]} filter="url(#glow)"/>
          )})}
        </g>

        {/* Flare at the arc end */}
        <circle cx={fx} cy={fy} r={9} fill="url(#flare)" />
      </svg>

      {/* Center copy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1">
        <span className="text-[12px] tracking-[0.32em] uppercase text-[rgba(155,239,255,0.6)]">Progress</span>
        <div className="text-[34px] font-black drop-shadow-[0_0_24px_rgba(0,240,255,0.55)]">{Math.round(v*100)}%</div>
        <div className="text-sub text-[12px] tracking-[0.28em] uppercase">To Goal</div>
      </div>
    </div>
  );
}
