"use client";
import React from "react";

export default function Sparkline({ data = [], width=340, height=110, color="#00F0FF" }:{
  data?: number[]; width?: number; height?: number; color?: string;
}) {
  if (data.length < 2) return <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} />;
  const pad = 8;
  const xs = data.map((_, i) => i);
  const ys = data;
  const minY = Math.min(...ys) - 0.0001;
  const maxY = Math.max(...ys) + 0.0001;
  const sx = (i:number) => pad + (i / (xs.length - 1)) * (width - pad*2);
  const sy = (y:number) => height - pad - ((y - minY) / (maxY - minY)) * (height - pad*2);
  const d = xs.map((x,i) => `${i===0?"M":"L"} ${sx(x)} ${sy(ys[i])}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <line x1="0" y1={height-1} x2={width} y2={height-1} stroke="rgba(255,255,255,.12)" />
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
