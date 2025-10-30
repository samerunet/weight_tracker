"use client";
import React, { useMemo } from "react";

export default function RingProgress({ size=252, thickness=22, value=0.67 }:{
  size?:number; thickness?:number; value?:number;
}) {
  const r=(size-thickness)/2, c=2*Math.PI*r, v=Math.max(0,Math.min(1,value));
  const dash=v*c, gap=c-dash, cx=size/2, cy=size/2;

  const endAng=(-90+v*360)*Math.PI/180, fx=cx+r*Math.cos(endAng), fy=cy+r*Math.sin(endAng);
  const r1=r+thickness/2+6, r2=r+thickness/2+14, r3=r+thickness/2+22;
  const angles=useMemo(()=>Array.from({length:8},(_,i)=>i*45),[]);
  const col=["#00F0FF","#7A77FF","#FF00E5","#00FFA6"];

  return (
    <div style={{width:size,height:size}} className="relative mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F0FF"/><stop offset="60%" stopColor="#7A77FF"/><stop offset="100%" stopColor="#FF00E5"/>
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity=".22"/><stop offset="45%" stopColor="#7A77FF" stopOpacity=".16"/><stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".9"/><stop offset="60%" stopColor="#FF4DFF" stopOpacity=".6"/><stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={r+thickness*0.65} fill="url(#halo)"/>
        <circle cx={cx} cy={cy} r={r} stroke="#101527" strokeWidth={thickness} fill="none"/>
        <circle cx={cx} cy={cy} r={r} stroke="url(#g)" strokeWidth={thickness} fill="none"
          strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} filter="url(#glow)"/>

        <g className="orbit slow">
          {angles.map((a,i)=>{const t=a*Math.PI/180;return <circle key={i} cx={cx+r1*Math.cos(t)} cy={cy+r1*Math.sin(t)} r={2.6} fill={col[i%4]} filter="url(#glow)"/>})}
        </g>
        <g className="orbit mid">
          {angles.map((a,i)=>{const t=a*Math.PI/180;return <circle key={`m${i}`} cx={cx+r2*Math.cos(t)} cy={cy+r2*Math.sin(t)} r={2.2} fill={col[(i+1)%4]} filter="url(#glow)"/>})}
        </g>
        <g className="orbit fast">
          {angles.map((a,i)=>{const t=a*Math.PI/180;return <circle key={`f${i}`} cx={cx+r3*Math.cos(t)} cy={cy+r3*Math.sin(t)} r={1.8} fill={col[(i+2)%4]} filter="url(#glow)"/>})}
        </g>

        <circle cx={fx} cy={fy} r={9} fill="url(#flare)"/>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-black">{Math.round(v*100)}%</div>
        <div className="text-[var(--sub)] mt-1">To Goal</div>
      </div>
    </div>
  );
}
