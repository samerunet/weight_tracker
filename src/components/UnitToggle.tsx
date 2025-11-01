"use client";
import React from "react";
import type { Unit } from "@/src/lib/formulas";

export default function UnitToggle({ unit, onChange }:{ unit: Unit; onChange:(u:Unit)=>void }) {
  const Item = ({u,label}:{u:Unit;label:string}) => (
    <button
      onClick={()=>onChange(u)}
      className={
        "px-3 py-1 rounded-lg text-xs font-black transition " +
        (unit===u
          ? "bg-[#0CF] text-black shadow-[0_0_16px_rgba(0,240,255,.6)]"
          : "bg-transparent border border-white/20 text-[#9BEFFF] hover:border-white/40")
      }>
      {label}
    </button>
  );
  return (
    <div className="flex gap-2">
      <Item u="lb" label="lb" />
      <Item u="kg" label="kg" />
    </div>
  );
}
