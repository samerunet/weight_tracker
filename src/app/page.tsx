"use client";
import StatCard from "@/components/StatCard";
import RingProgress from "@/components/RingProgress";
import { NeonButton, Tile, BottomNav } from "@/components/NeonBits";

function Sparkline(){
  return (
    <svg width="100%" viewBox="0 0 340 110" className="mt-2">
      <g>
        <line x1="40" y1="12" x2="40" y2="98" className="axis"/>
        <line x1="40" y1="98" x2="330" y2="98" className="axis"/>
        {[210,190,160].map((yLabel, i)=>(
          <g key={i}>
            <line x1="40" y1={12 + i*28} x2="330" y2={12 + i*28} className="tick"/>
            <text x="8" y={16 + i*28} fill="var(--sub)" fontSize="12" fontWeight="700">{yLabel}</text>
          </g>
        ))}
      </g>
      <path d="M40,70 C80,65 120,60 160,75 C200,90 240,88 280,78 300,74 320,72 330,72"
            className="spark" stroke="rgba(0,240,255,.9)" strokeWidth="2.5"/>
      <path d="M40,75 C90,92 150,92 210,80 C250,72 290,70 330,66"
            className="spark" stroke="rgba(255,0,229,.9)" strokeWidth="2.5" strokeDasharray="4 6"/>
      <text x="48" y="104" fill="var(--sub)" fontSize="13" fontWeight="700">Start</text>
      <text x="290" y="104" fill="var(--sub)" fontSize="13" fontWeight="700">Goal</text>
    </svg>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen max-w-[720px] mx-auto px-3">
      <div className="neon-vignette" />
      <div className="device-frame" />

      <div className="safe-wrap pt-6">
        <h1 className="text-center text-[32px] font-black title-neon">NEON FIT</h1>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <StatCard label="Weight"   value="186" unit="lb" variant="blue" />
          <StatCard label="BMI"      value="25.1"           variant="magenta" />
          <StatCard label="Body Fat" value="22.5" unit="%"  variant="magenta" />
        </div>

        <div className="mt-6 flex justify-center"><RingProgress value={0.67}/></div>
        <div className="mt-2">{Sparkline()}</div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="btn-neon cyan w-full text-[15px] tracking-wide">+ Add Weight</button>
          <button className="btn-neon pink w-full text-[15px] tracking-wide">Log meal</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Tile tone="cyan">
            <div className="text-[15px] font-black">Scan Food</div>
            <div className="text-[13px] text-[var(--sub)] mt-1">Daily Calorie Target</div>
            <div className="text-[--baby] text-xl font-black mt-1">2850 kcal</div>
          </Tile>
          <Tile tone="pink">
            <div className="text-[15px] font-black">Full Body (3×/Week)</div>
            <div className="text-[13px] text-[var(--sub)]">Intermediate Workout Plan</div>
            <div className="mt-2 w-6 h-6 rounded-full border-[3px] border-[rgba(0,255,166,.9)] border-t-[rgba(0,240,255,.2)]" />
          </Tile>
        </div>
      </div>

      <BottomNav active="Home"/>
    </main>
  );
}
