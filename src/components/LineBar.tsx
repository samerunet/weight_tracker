"use client";
import React from "react";

export default function LineBar({ value=0 }:{ value?: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="w-full">
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: pct+"%", background: "linear-gradient(90deg,#00F0FF,#7A77FF,#FF00E5)" }} />
      </div>
      <div className="mt-2 text-right text-[#8EA4D2] font-bold">{pct}%</div>
    </div>
  );
}
