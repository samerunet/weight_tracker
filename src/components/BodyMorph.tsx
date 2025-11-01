"use client";
import React, { useMemo, useRef, useState } from "react";

export type LengthUnit = "in" | "cm";
export type MeasureKey =
  | "chestIn" | "waistIn" | "hipsIn" | "shouldersIn" | "neckIn"
  | "bicepsLIn" | "bicepsRIn" | "forearmLIn" | "forearmRIn"
  | "thighLIn" | "thighRIn" | "calfLIn" | "calfRIn";

type Measures = Partial<Record<MeasureKey, number>>;

const CM_PER_IN = 2.54;

const FIELDS: { key: MeasureKey; label: string }[] = [
  { key:"shouldersIn", label:"Shoulders" },
  { key:"chestIn",     label:"Chest" },
  { key:"waistIn",     label:"Waist" },
  { key:"hipsIn",      label:"Hips" },
  { key:"neckIn",      label:"Neck" },
  { key:"bicepsLIn",   label:"Biceps L" },
  { key:"bicepsRIn",   label:"Biceps R" },
  { key:"forearmLIn",  label:"Forearm L" },
  { key:"forearmRIn",  label:"Forearm R" },
  { key:"thighLIn",    label:"Thigh L" },
  { key:"thighRIn",    label:"Thigh R" },
  { key:"calfLIn",     label:"Calf L" },
  { key:"calfRIn",     label:"Calf R" },
];

// Baseline circumferences (inches) for a neutral silhouette.
// We scale each region around these.
const BASE: Record<MeasureKey, number> = {
  shouldersIn: 48, chestIn: 40, waistIn: 34, hipsIn: 40, neckIn: 15,
  bicepsLIn: 13, bicepsRIn: 13, forearmLIn: 11, forearmRIn: 11,
  thighLIn: 22, thighRIn: 22, calfLIn: 15, calfRIn: 15,
};

function clamp(v:number, a:number, b:number){ return Math.max(a, Math.min(b, v)); }
function toInches(value:number, unit:LengthUnit){ return unit==="cm" ? (value/CM_PER_IN) : value; }
function fromInches(inches:number, unit:LengthUnit){ return unit==="cm" ? (inches*CM_PER_IN) : inches; }

export default function BodyMorph({
  unit,
  measures,
  bodyFatPct = 20,          // used to tint "fat" overlay
  onEdit,
}:{
  unit: LengthUnit;
  measures: Measures;        // in *inches* internally (we display in unit)
  bodyFatPct?: number;
  onEdit: (key:MeasureKey, valueInUnit:number)=>void; // write-through to store
}) {
  const wrapRef = useRef<HTMLDivElement|null>(null);
  const [popover, setPopover] = useState<null | { key:MeasureKey; label:string; x:number; y:number; val:string }>(null);

  // Build per-region scale factor vs baseline
  const scale = (key:MeasureKey) => {
    const vIn = measures[key];
    const base = BASE[key];
    if (!vIn || !base) return 1;
    return clamp(vIn / base, 0.7, 1.6); // keep shape reasonable
  };

  // Fat overlay opacity driven by body-fat%
  const fatOpacity = useMemo(()=> clamp((bodyFatPct - 10) / 25, 0, 0.85), [bodyFatPct]);

  // Open input at cursor
  function openFor(e: React.MouseEvent, key:MeasureKey, label:string){
    const rect = wrapRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left ?? 0);
    const y = e.clientY - (rect?.top ?? 0);
    const currentIn = measures[key];
    const shown = currentIn != null ? fromInches(currentIn, unit).toFixed(1) : "";
    setPopover({ key, label, x, y, val: shown });
  }

  function commit(){
    if(!popover) return;
    const raw = parseFloat(popover.val);
    if(!isFinite(raw)) { setPopover(null); return; }
    onEdit(popover.key, raw);
    setPopover(null);
  }

  // SVG geometry (viewBox 320x520)
  // We draw simple parametric shapes; widths height scale with regions.
  const W = 320, H = 520;
  const sShould = scale("shouldersIn");
  const sChest   = scale("chestIn");
  const sWaist   = scale("waistIn");
  const sHips    = scale("hipsIn");
  const sNeck    = scale("neckIn");
  const sBiL     = scale("bicepsLIn"), sBiR = scale("bicepsRIn");
  const sFoL     = scale("forearmLIn"), sFoR = scale("forearmRIn");
  const sThL     = scale("thighLIn"), sThR = scale("thighRIn");
  const sCaL     = scale("calfLIn"),  sCaR = scale("calfRIn");

  // colors + glow
  const muscleFill = "#00F0FF";
  const fatFill    = "#FF4DFF";

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block select-none">
        <defs>
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowPink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* --- MUSCLE LAYER (cyan) --- */}
        <g fill={muscleFill} opacity={0.26} filter="url(#glowCyan)">
          {/* neck */}
          <rect x={150 - 10*sNeck} y={60} width={20*sNeck} height={24} rx={10}/>
          {/* shoulders bar */}
          <rect x={80} y={84} width={160} height={24} rx={12} transform={`translate(0,0) scale(${sShould},1)`} transform-origin="160 96"/>
          {/* chest ellipse */}
          <ellipse cx={160} cy={130} rx={54*sChest} ry={36}/>
          {/* waist ellipse */}
          <ellipse cx={160} cy={190} rx={38*sWaist} ry={30}/>
          {/* hips ellipse */}
          <ellipse cx={160} cy={250} rx={46*sHips} ry={34}/>
          {/* arms (upper/lower) */}
          {/* left */}
          <rect x={60} y={120} width={22*sBiL} height={70} rx={12} onClick={(e)=>openFor(e,"bicepsLIn","Biceps L")}/>
          <rect x={56} y={190} width={18*sFoL} height={70} rx={10} onClick={(e)=>openFor(e,"forearmLIn","Forearm L")}/>
          {/* right */}
          <rect x={238-22*sBiR} y={120} width={22*sBiR} height={70} rx={12} onClick={(e)=>openFor(e,"bicepsRIn","Biceps R")}/>
          <rect x={242-18*sFoR} y={190} width={18*sFoR} height={70} rx={10} onClick={(e)=>openFor(e,"forearmRIn","Forearm R")}/>
          {/* legs (thighs, calves) */}
          {/* left */}
          <rect x={125-16*sThL} y={290} width={32*sThL} height={90} rx={16} onClick={(e)=>openFor(e,"thighLIn","Thigh L")}/>
          <rect x={125-14*sCaL} y={380} width={28*sCaL} height={90} rx={14} onClick={(e)=>openFor(e,"calfLIn","Calf L")}/>
          {/* right */}
          <rect x={195-16*sThR} y={290} width={32*sThR} height={90} rx={16} onClick={(e)=>openFor(e,"thighRIn","Thigh R")}/>
          <rect x={195-14*sCaR} y={380} width={28*sCaR} height={90} rx={14} onClick={(e)=>openFor(e,"calfRIn","Calf R")}/>
          {/* clickable torso zones */}
          <ellipse cx={160} cy={130} rx={54*sChest} ry={36} onClick={(e)=>openFor(e,"chestIn","Chest")} />
          <ellipse cx={160} cy={190} rx={38*sWaist} ry={30} onClick={(e)=>openFor(e,"waistIn","Waist")} />
          <ellipse cx={160} cy={250} rx={46*sHips} ry={34} onClick={(e)=>openFor(e,"hipsIn","Hips")} />
          <rect x={150 - 10*sNeck} y={60} width={20*sNeck} height={24} rx={10} onClick={(e)=>openFor(e,"neckIn","Neck")} />
          <rect x={80} y={84} width={160} height={24} rx={12} onClick={(e)=>openFor(e,"shouldersIn","Shoulders")} />
        </g>

        {/* --- FAT LAYER (pink), thickened to suggest subcutaneous layer --- */}
        <g fill={fatFill} opacity={fatOpacity} filter="url(#glowPink)">
          <ellipse cx={160} cy={130} rx={56*sChest} ry={38}/>
          <ellipse cx={160} cy={190} rx={40*sWaist} ry={32}/>
          <ellipse cx={160} cy={250} rx={48*sHips}  ry={36}/>
          <rect x={60-2} y={120-2} width={2+22*sBiL+4} height={70+4} rx={14}/>
          <rect x={238-22*sBiR-2} y={120-2} width={2+22*sBiR+4} height={70+4} rx={14}/>
          <rect x={56-2} y={190-2} width={2+18*sFoL+4} height={70+4} rx={12}/>
          <rect x={242-18*sFoR-2} y={190-2} width={2+18*sFoR+4} height={70+4} rx={12}/>
          <rect x={125-16*sThL-2} y={290-2} width={2+32*sThL+4} height={90+4} rx={18}/>
          <rect x={195-16*sThR-2} y={290-2} width={2+32*sThR+4} height={90+4} rx={18}/>
          <rect x={125-14*sCaL-2} y={380-2} width={2+28*sCaL+4} height={90+4} rx={16}/>
          <rect x={195-14*sCaR-2} y={380-2} width={2+28*sCaR+4} height={90+4} rx={16}/>
        </g>

        {/* Outlines for clarity */}
        <g fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1">
          <ellipse cx={160} cy={130} rx={56*sChest} ry={38}/>
          <ellipse cx={160} cy={190} rx={40*sWaist} ry={32}/>
          <ellipse cx={160} cy={250} rx={48*sHips}  ry={36}/>
        </g>

        {/* labels hint */}
        <text x="160" y="24" fill="#8EA4D2" fontSize="12" textAnchor="middle">Tap a region to enter size</text>
      </svg>

      {/* Input popover */}
      {popover && (
        <div className="absolute z-10" style={{ left: popover.x, top: popover.y }}>
          <div className="rounded-xl bg-[rgba(6,8,20,.95)] border border-white/20 backdrop-blur-md p-2 shadow-[0_0_24px_rgba(0,240,255,.2)]">
            <div className="text-xs text-[#8EA4D2]">{popover.label} ({unit})</div>
            <div className="mt-1 flex gap-2">
              <input
                className="input w-24"
                inputMode="decimal"
                autoFocus
                value={popover.val}
                onChange={(e)=>setPopover(p=>p?{...p, val:e.target.value}:p)}
                onKeyDown={(e)=>{ if(e.key==="Enter") commit(); if(e.key==="Escape") setPopover(null); }}
              />
              <button className="btn" onClick={commit}>Save</button>
              <button className="btn" onClick={()=>setPopover(null)}>X</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
